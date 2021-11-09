import { AgmCoreModule } from '@agm/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SharedModule } from '../../../shared/shared.module';
import { HistoryContentComponent } from './components/history-content/history-content.component';
import { HistoryComponent } from './components/history/history.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { StatusHistoryComponent } from './components/status-history/status-history.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderService } from './order.service';
import { OrderResolveService } from './resolvers/order-resolve.service';

@NgModule({
  declarations: [HistoryComponent, HistoryContentComponent, StatusHistoryComponent, InvoiceComponent],
  imports: [
    CommonModule,
    SharedModule,
    OrderRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_map_api,
      libraries: ['places'],
    }),
  ],
  providers: [OrderService, DatePipe,OrderResolveService],
})
export class OrderModule {}
