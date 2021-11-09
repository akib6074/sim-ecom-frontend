import { ShopReviewComponent } from './components/shop-profile/shop-review/shop-review.component';
import { ShopProfileProductComponent } from './components/shop-profile/shop-profile-product/shop-profile-product.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/shop/home/home.component';
import { ShopProfileResolveService } from './resolvers/shop-profile-resolve.service';
import { PromotionResolveService } from './resolvers/promotion-resolve.service';
import { FollowingShopResolveService } from './resolvers/following-shop-resolve.service';
import { ShopTypeProfileComponent } from './components/shop-type-profile/shop-type-profile.component';
import { ShopTypeResolveService } from './resolvers/shoptype-resolve.service';
import { TrendingShopResolveService } from './resolvers/trending-shop-resolve.service';
import { PopularShopResolveService } from './resolvers/popular-shop-resolve.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home',
    },
    resolve: {
      promotions: PromotionResolveService,
      followingShops: FollowingShopResolveService,
      popularShops: PopularShopResolveService,
      trendingShops: TrendingShopResolveService,
    },
  },
  {
    path: 'shop-type/:id',
    component: ShopTypeProfileComponent,
    data: {
      title: 'Shop Type profile',
    },
    resolve: {
      type: ShopTypeResolveService,
    },
  },
  {
    path: 'shop/:name',
    component: ShopProfileProductComponent,
    data: {
      title: 'Shop Profile',
    },
    resolve: {
      shop: ShopProfileResolveService,
    },
  },
  {
    path: 'shop/:name/reviews',
    component: ShopReviewComponent,
    data: {
      title: 'Shop Review',
    },
    resolve: {
      shop: ShopProfileResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
