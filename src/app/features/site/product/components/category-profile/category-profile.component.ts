import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ImageType} from '../../../../../core/enum/image-type.enum';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {ProductService} from '../../product.service';
import {FilterOption} from '../../../../../core/dto/filter-option.dto';

@Component({
  selector: 'app-category-profile',
  templateUrl: './category-profile.component.html',
  styleUrls: ['./category-profile.component.scss'],
})
export class CategoryProfileComponent implements OnInit {
  category: any = {};
  products: any[] = [];

  categoryImageType = ImageType.CATEGORY;

  currentPage = 1;
  limit = 8;
  throttle = 300;
  scrollDistance = 3;
  isLoading = true;
  totalCount = 0;
  filterOption: FilterOption = {
    search: '',
    price: '',
    rating: '',
    algorithm: 'latest'
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({matches}) => {
        if (matches) {
          return 3;
        }
        return 8;
      })
    ).subscribe(value => {
      this.limit = value;
    });
  }

  ngOnInit(): void {
    this.category = this.route.snapshot.data?.category;
    this.getProductsByCategory(this.filterOption);
  }

  getProductsByCategory = (filter: FilterOption) => {
    this.isLoading = true;
    this.productService.getByCategoryPagination(this.category.id, this.currentPage, this.limit, filter).subscribe(
      (res) => {
        if (!res.error) {
          const products = res?.payload?.data?.products || [];
          this.totalCount = res?.payload?.data?.count || 0;
          this.products.push(...products);
          ++this.currentPage;
        }
        this.isLoading = false;
      },
      ((error) => {
        this.isLoading = false;
      })
    );
  };

  onScrollDown = (ev: Event | EventTarget | any) => {
    this.getProductsByCategory(this.filterOption);
  };
}
