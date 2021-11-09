import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../app/shared/shared.module';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { CouponRoutingModule } from './coupon-routing.module';
import { CouponService } from './coupon.service';
import { ThanaResolveService } from './resolvers/thana-resolve.service';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [AddComponent, ListComponent],
  imports: [CommonModule, SharedModule, CouponRoutingModule, DragDropModule],
  providers: [CouponService, ThanaResolveService],
})
export class CouponModule {}
