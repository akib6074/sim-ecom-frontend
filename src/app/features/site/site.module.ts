import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {SiteLayoutModule} from '../../blocks/layout/site-layout/site-layout.module';
import {SiteRoutingModule} from './site-routing.module';
import {SiteService} from './site.service';
import {CategoryResolveService} from './resolvers/category-resolve.service';
import {ShopTypeResolveService} from './resolvers/shop-type-resolve.service';

@NgModule({
  declarations: [],
  imports: [SharedModule, CommonModule, SiteLayoutModule, SiteRoutingModule],
  providers: [SiteService, CategoryResolveService, ShopTypeResolveService],
})
export class SiteModule {
}
