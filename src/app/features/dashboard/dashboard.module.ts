import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardService} from './dashboard.service';
import {SharedModule} from '../../shared/shared.module';
import {DashboardLayoutModule} from '../../blocks/layout/dashboard-layout/dashboard-layout.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DashboardLayoutModule,
    SharedModule,
  ],
  providers: [DashboardService],
})
export class DashboardModule {
}
