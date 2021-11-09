import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { OrderStatus } from '../../../../../../app/shared/enum/order-status.enum';
import { ImageType } from '../../../../../../app/core/enum/image-type.enum';
import { OrderService } from '../../order.service';

export interface Order {
  image: string;
  status: string;
  productDescription: ProductDescription;
  payment: string;
  total: number;
  details: string;
}

export interface ProductDescription {
  productName: string;
  quantity: string;
  date: string;
}

@Component({
  selector: 'app-history-content',
  templateUrl: './history-content.component.html',
  styleUrls: ['./history-content.component.scss'],
})
export class HistoryContentComponent
  implements AfterViewInit, AfterViewChecked, OnInit
{
  status: number;
  productImageType = ImageType.PRODUCT_SMALL;
  orderId: string | null = null;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('status') set statusInit(input: number) {
    this.status = input;
  }

  displayedColumns: string[] = [
    'image',
    'payment',
    '_totalItems',
    '_totalPrice',
    '_orderDetails',
  ];
  dataSource: any[] = [];

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  OrderStatus = OrderStatus;
  constructor(
    private readonly orderService: OrderService,
    private readonly cdRef: ChangeDetectorRef,
    public readonly token: TokenStorageService
  ) {
    if (this.token.isAdmin()) {
      this.displayedColumns.push('actions');
    } else {
      this.displayedColumns.push('status', 'invoice');
    }
  }

  ngAfterViewInit(): void {
    this.showAll();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {}

  showAll() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.pagination.isLoading = true;
          const page = this.paginator.pageIndex + 1;
          const limit = this.paginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';

          return this.orderService.pagination(
            page,
            limit,
            sort,
            order,
            this.status
          );
        }),
        map((res) => {
          const { count, data } = res.page;
          this.pagination.isLoading = false;
          this.pagination.totalCount = count;

          let i = 0;
          for (const item of data) {
            data[i]._totalPrice = item?.orderDetails.reduce(
              (acc: number, current: any) =>
                acc + Number(current?.product?.price || 0) * current.quantity,
              0
            );
            data[i]._totalItems = item?.orderDetails.reduce(
              (acc: number, current: any) => acc + current.quantity,
              0
            );
            data[i]._orderDetails = 'Order Details';
            i++;
          }
          return data;
        }),
        catchError(() => {
          this.pagination.isLoading = false;
          return of([]);
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.dataSource = data;
      });
  }

  toFixedNumber = (value: string | number): number =>
    Number(Number(value.toString()).toFixed(2));

  changeStatus(id: string, status: number) {
    const statusDto = { status };
    this.orderService.changeStatusByID(id, statusDto).subscribe((res) => {
      console.log(res);
    });
  }
}
