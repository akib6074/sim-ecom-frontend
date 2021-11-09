import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeService } from './home.service';
import { SiteLayoutModule } from '../../../blocks/layout/site-layout/site-layout.module';
import { HomeComponent } from './components/shop/home/home.component';
import { ShopCategoryComponent } from './components/shop/shop-category/shop-category.component';
import { ShopProfileProductComponent } from './components/shop-profile/shop-profile-product/shop-profile-product.component';
import { ShopProfileResolveService } from './resolvers/shop-profile-resolve.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ShopReviewComponent } from './components/shop-profile/shop-review/shop-review.component';
import { PromotionResolveService } from './resolvers/promotion-resolve.service';
import { FollowingShopResolveService } from './resolvers/following-shop-resolve.service';
import { ShopTypeProfileComponent } from './components/shop-type-profile/shop-type-profile.component';
import { ShopTypeResolveService } from './resolvers/shoptype-resolve.service';
import { PopularShopResolveService } from './resolvers/popular-shop-resolve.service';
import { TrendingShopResolveService } from './resolvers/trending-shop-resolve.service';

@NgModule({
  declarations: [
    HomeComponent,
    ShopCategoryComponent,
    ShopProfileProductComponent,
    ShopReviewComponent,
    ShopTypeProfileComponent,
  ],
  imports: [
    CommonModule,
    SiteLayoutModule,
    HomeRoutingModule,
    SharedModule,
    InfiniteScrollModule,
  ],
  providers: [
    HomeService,
    ShopProfileResolveService,
    PromotionResolveService,
    FollowingShopResolveService,
    ShopTypeResolveService,
    PopularShopResolveService,
    TrendingShopResolveService,
  ],
})
export class HomeModule {}
