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
import { TicketService } from '../../ticket.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit, AfterViewChecked, OnInit {
  displayedColumns: string[] = [
    'seriall no.',
    'ticketDepartment',
    'subject',
    'issueDetails',
  ];

  TicketStatus = TicketStatus;
  dataSource: any[] = [];
  ticktsDetails: any;
  status = false;

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private readonly ticketService: TicketService,
    private readonly cdRef: ChangeDetectorRef,
    public readonly token: TokenStorageService
  ) {
    if (this.token.isAdmin()) {
      this.displayedColumns.push('name', 'mail', 'mobile', 'date', 'actions');
    } else {
      this.displayedColumns.push('status');
    }
  }

  ngAfterViewInit(): void {
    this.showAll();
  }

  ngOnInit(): void {}

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue;
    console.log(filterValue);
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  changeStatus = (id: string, status: TicketStatus) => {
    const changeTicketStatusDto = new ChangeTicketStatusDto();
    changeTicketStatusDto.ticketId = id;
    changeTicketStatusDto.status = status;
    this.ticketService
      .changeTicketStatus(changeTicketStatusDto)
      .subscribe((res) => {
        console.log(res);
      });
  };

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

          return this.ticketService.pagination(page, limit, sort, order);
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
        console.log(data);
        this.dataSource = data;
      });
  };

  trimString(text: any, length: number) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  changeSeeMoreStatus() {
    if (this.status) {
      this.status = false;
    } else {
      this.status = true;
    }
  }
}
