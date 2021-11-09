import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import { ChangeTicketStatusDto } from './../../../../../shared/dto/core/change-ticket-status.dto';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TicketStatus } from '../../../../../shared/enum/ticket-status.enum';
import {CouponService} from '../../coupon.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit, AfterViewChecked, OnInit {
  displayedColumns: string[] = [
    'seriall no.',
    'startDate',
    'endDate',
    'description',
    'quantity',
    'couponCode',
  ];

  dataSource: any[] = [];

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private readonly couponService: CouponService,
    private readonly cdRef: ChangeDetectorRef,
    public readonly token: TokenStorageService
  ) {

  }

  ngAfterViewInit(): void {
    this.showAll();
  }

  ngOnInit(): void {}

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue;
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  showAll = () => {
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

          return this.couponService.pagination(page, limit, sort, order);
        }),
        map((res) => {
          const { count, data } = res.page;
          this.pagination.isLoading = false;
          this.pagination.totalCount = count;
          return data;
        }),
        catchError(() => {
          this.pagination.isLoading = false;
          return of([]);
        })
      )
      .subscribe((data) => {
        this.dataSource = data;
      });
  };

}
