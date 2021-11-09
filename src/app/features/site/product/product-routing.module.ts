import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductProfileComponent } from './components/product-profile/product-profile.component';
import { ProductComponent } from './components/product/product.component';
import { ProductByIdResolveService } from './resolvers/product-by-id-resolve.service';
import { CategoryProfileComponent } from './components/category-profile/category-profile.component';
import { CategoryByIdResolveService } from './resolvers/category-by-id-resolve.service';
import { WishlistResolveService } from './resolvers/wishlist-resolve.service';
import { PromotionResolveService } from '../home/resolvers/promotion-resolve.service';
import { PopularProductResolveService } from './resolvers/popular-product-resolve.service';
import { TrendingProductResolveService } from './resolvers/trending-product-resolve.service';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    data: {
      title: 'Products',
    },
    resolve: {
      wishlist: WishlistResolveService,
      promotions: PromotionResolveService,
      popularProducts: PopularProductResolveService,
      trendingProducts: TrendingProductResolveService,
    },
  },
  {
    path: 'category/:id',
    component: CategoryProfileComponent,
    data: {
      title: 'Category profile',
    },
    resolve: {
      category: CategoryByIdResolveService,
    },
  },
  {
    path: ':id',
    component: ProductProfileComponent,
    data: {
      title: 'Product profile',
    },
    resolve: {
      product: ProductByIdResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
