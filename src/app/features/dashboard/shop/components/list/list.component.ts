import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {merge, of} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {TokenStorageService} from '../../../../../../app/core/services/token-storage.service';
import {ImageType} from '../../../../../core/enum/image-type.enum';
import {ConfirmDialogComponent} from '../../../../../shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import {ShopService} from '../../shop.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit, AfterViewChecked {
  displayedColumns: string[] = [
    'shopProfileImage',
    'shopCoverImage',
    'name',
    'type',
    'domain',
    'url',
    'location',
    'action',
  ];
  dataSource: any[] = [];

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;
  coverImageType = ImageType.SHOP_COVER;
  profileImageType = ImageType.SHOP_PROFILE_SMALL;

  constructor(
    private shopService: ShopService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly token: TokenStorageService,
    private readonly router: Router
  ) {
    if (this.token.isAdmin()) {
      this.router.navigate(['/dashboard/shop/list']);
    } else {
      if (!this.token.hasLicenseAndNID()) {
        this.router.navigate(['/dashboard/user/edit/profile']);
      }
    }
  }

  ngAfterViewInit(): void {
    this.showAll();
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

          return this.shopService.pagination(page, limit, sort, order);
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
      .subscribe((data) => (this.dataSource = data));
  };

  /* delete = (id: string) => {
    this.dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Are you sure to delete?',
        message: 'This can not be undone!',
      },
    });

    this.dialogRef.afterClosed().subscribe((yes) => {
      if (yes) {
        this.shopService.remove(id).subscribe((res) => {
          this.responseService.fire(res);
          this.showAll();
        });
      }
      this.dialogRef = null;
    });
  }; */
}
