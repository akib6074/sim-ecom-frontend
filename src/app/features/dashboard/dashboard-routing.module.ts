import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../../blocks/layout/dashboard-layout/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
        data: {
          title: 'Dashboard',
        },
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
        data: {
          title: 'User',
        },
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
        data: {
          title: 'Profile',
        },
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./category/category.module').then((m) => m.CategoryModule),
        data: {
          title: 'Category',
        },
      },
      {
        path: 'shop',
        loadChildren: () =>
          import('./shop/shop.module').then((m) => m.ShopModule),
        data: {
          title: 'Shop',
        },
      },
      {
        path: 'shop-type',
        loadChildren: () =>
          import('./shop-type/shop-type.module').then((m) => m.ShopTypeModule),
        data: {
          title: 'Shop Type',
        },
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./product/product.module').then((m) => m.ProductModule),
        data: {
          title: 'Product',
        },
      },
      {
        path: 'stock',
        loadChildren: () =>
          import('./stock/stock.module').then((m) => m.StockModule),
        data: {
          title: 'Stock',
        },
      },
      {
        path: 'order',
        loadChildren: () =>
          import('./order/order.module').then((m) => m.OrderModule),
        data: {
          title: 'order',
        },
      },
      {
        path: 'ticket',
        loadChildren: () =>
          import('./ticket/ticket.module').then((m) => m.TicketModule),
        data: {
          title: 'ticket',
        },
      },
      {
        path: 'coupon',
        loadChildren: () =>
          import('./coupon/coupon.module').then((m) => m.CouponModule),
        data: {
          title: 'coupon',
        },
      },
      {
        path: 'contact-us',
        loadChildren: () =>
          import('./contactUS/contact-us.module').then(
            (m) => m.ContactUsModule
          ),
        data: {
          title: 'Contact Us',
        },
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./report/report.module').then((m) => m.ReportModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'department',
        loadChildren: () =>
          import('./department/department.module').then(
            (m) => m.DepartmentModule
          ),
      },
      {
        path: 'promotion',
        loadChildren: () =>
          import('./promotion/promotion.module').then((m) => m.PromotionModule),
      },
      {
        path: 'configuration',
        loadChildren: () =>
          import('./configuration/configuration.module').then(
            (m) => m.ConfigurationModule
          ),
      },
      {
        path: 'onlinePaymentInfo',
        loadChildren: () =>
          import('./online-payment-info/online-payment-info.module').then(
            (m) => m.OnlinePaymentInfoModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
