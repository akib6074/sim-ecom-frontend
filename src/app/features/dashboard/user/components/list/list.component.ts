import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, of} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {UsersService} from '../../../../../core/services/users.service';
import {ResponseService} from '../../../../../shared/services/response.service';
import {ConfirmDialogComponent} from '../../../../../shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'gender',
    'action',
  ];
  dataSource: any[] = [];
  pagination = {
    isLoading: true,
    rowsPerPage: 10,
    totalCount: 0,
  };
  isSuperAdmin = false;
  allUser = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  constructor(
    private userService: UsersService,
    private readonly responseService: ResponseService,
    private readonly matDialog: MatDialog,
  ) {
  }

  ngAfterViewInit(): void {
    this.showAllUser();
  }

  showAllUser(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.pagination.isLoading = true;
          const page = this.paginator.pageIndex + 1;
          const limit = this.paginator.pageSize;
          const sort = this.sort.active;
          const order = this.sort.direction.toUpperCase();
          return this.userService.pagination(page, limit, sort, order);
        }),
        map((res) => {
          const {count, data} = res.page;
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
  }


  delete = (id: string) => {
    this.dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Are you sure to delete?',
        message: 'This can`t be undone',
      }
    });

    this.dialogRef.afterClosed().subscribe(yes => {
      if (yes) {
        this.userService.delete(id).subscribe((res) => {
          this.responseService.fire(res);
        });
      }
      this.dialogRef = null;
    });
  };
}
