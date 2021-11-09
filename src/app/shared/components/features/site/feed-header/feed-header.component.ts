import { ViewService } from './../../../../services/view.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../../core/services/loader.service';

@Component({
  selector: 'app-feed-header',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.scss'],
})
export class FeedHeaderComponent implements OnInit {
  currentRoute = '';

  filterOption = {
    search: '',
    price: '',
    rating: '',
    algorithm: 'latest',
  };

  constructor(
    private readonly router: Router,
    private readonly viewService: ViewService,
    private readonly loaderService: LoaderService,
  ) {
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.viewAsColumn();
  }

  viewAsColumn() {
    this.viewService.viewName = 'column';
  }

  viewAsRow() {
    this.viewService.viewName = 'row';
  }

  resetSearch() {
    this.loaderService.isSearchable.next(true);
  }

  filterChange = (source: any, selection: string) => {
    if (selection === 'price') {this.filterOption.price = source.value;}
    if (selection === 'rating') {this.filterOption.rating = source.value;}
    if (selection === 'algorithm') {this.filterOption.algorithm = source.value;}
    this.loaderService.filterSearch.next(this.filterOption);
  };
}
