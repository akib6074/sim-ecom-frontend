import { ShopService } from './../features/dashboard/shop/shop.service';
import { ShopContentComponent } from './components/features/site/shop-content/shop-content.component';
import { PartnersComponent } from './components/features/site/partners/partners.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedRoutingModule } from './shared-routing.module';
import { AppMaterialModule } from './app-material.module';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/features/site/footer/footer.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';
import { SnackbarErrorComponent } from './components/features/site/snackbar-error/snackbar-error.component';
import { ResponseService } from './services/response.service';
import { HeaderComponent } from './components/features/site/header/header.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareModule } from 'ngx-sharebuttons';
import { TopSearchComponent } from './components/features/site/top-search/top-search.component';
import { BusinessBoostComponent } from './components/features/site/business-boost/business-boost.component';
import { FeedHeaderComponent } from './components/features/site/feed-header/feed-header.component';
import { CartComponent } from './components/features/site/cart/cart.component';
import { LiveChatComponent } from './components/features/site/live-chat/live-chat.component';
import { NotificationComponent } from './components/features/site/notification/notification.component';
import { GooglePlayPromotionComponent } from './components/features/site/google-play-promotion/google-play-promotion.component';
import { BusinessDecorationComponent } from './components/features/site/business-decoration/business-decoration.component';
import { ConfirmDialogComponent } from './components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { ImageComponent } from './components/features/dashboard/image/image.component';
import { ImageService } from './services/image.service';
import { AgmGoogleMapComponent } from './components/features/dashboard/agm-google-map/agm-google-map.component';
import { MatMenuModule } from '@angular/material/menu';
import { MinCartComponent } from './components/features/site/min-cart/min-cart.component';
import { ProductContentComponent } from './components/features/site/product-content/product-content.component';
import { UserProfileService } from '../features/dashboard/user/components/user-profile/userprofile.service';
import { ProductService } from '../features/dashboard/product/product.service';
import { ShopProfileTopComponent } from './components/features/site/shop-profile-top/shop-profile-top.component';
import { ShopProfileHeaderComponent } from './components/features/site/shop-profile-header/shop-profile-header.component';
import { ReviewComponent } from './components/features/site/review/review.component';
import { ReviewService } from './services/review.service';
import { RatingComponent } from './components/features/site/rating/rating.component';
import { FollowShopService } from './services/follow-shop.service';
import { WishlistService } from './services/wishlist.service';
import { ViewService } from './services/view.service';
import { ShippingDialogComponent } from './components/features/site/shipping-dialog/shipping-dialog.component';
import { AuthService } from '../features/auth/auth.service';
import { NotificationService } from '../features/site/notification/notification.service';

const components = [
  SnackbarErrorComponent,
  ShopContentComponent,
  TopSearchComponent,
  BusinessBoostComponent,
  FeedHeaderComponent,
  CartComponent,
  LiveChatComponent,
  NotificationComponent,
  FooterComponent,
  HeaderComponent,
  PartnersComponent,
  GooglePlayPromotionComponent,
  BusinessDecorationComponent,
  ConfirmDialogComponent,
  ImageComponent,
  AgmGoogleMapComponent,
  MinCartComponent,
  ProductContentComponent,
  ShopProfileTopComponent,
  ShopProfileHeaderComponent,
  ReviewComponent,
  RatingComponent,
  ShippingDialogComponent,
];

const services = [
  ResponseService,
  ImageService,
  UserProfileService,
  ShopService,
  ProductService,
  ReviewService,
  FollowShopService,
  WishlistService,
  ViewService,
  AuthService,
  NotificationService,
];

@NgModule({
  declarations: [...components],
  imports: [
    MatMenuModule,
    CommonModule,
    SharedRoutingModule,
    AppMaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ShareModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_map_api,
      libraries: ['places'],
    }),
  ],
  exports: [
    AppMaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ...components,
  ],
  providers: [...services, { provide: MAT_DIALOG_DATA, useValue: {} }],
})
export class SharedModule {}
