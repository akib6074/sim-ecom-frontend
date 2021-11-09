import { PromotionRoutingModule } from './promotion-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProductResolveService } from './resolvers/product-resolve.service';
import { ShopResolveService } from './resolvers/shop-resolve.service';
import { PromotionService } from './promotion.service';
import { EditComponent } from './components/edit/edit.component';

@NgModule({
  declarations: [AddComponent, ListComponent, EditComponent],
  imports: [CommonModule, SharedModule, PromotionRoutingModule],
  providers: [ShopResolveService, ProductResolveService, PromotionService],
})
export class PromotionModule {}
