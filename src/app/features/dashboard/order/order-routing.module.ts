import { StatusHistoryComponent } from './components/status-history/status-history.component';
import { HistoryComponent } from './components/history/history.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { OrderResolveService } from './resolvers/order-resolve.service';

const routes: Routes = [
  {
    path: '',
    component: HistoryComponent,
    data: { title: 'Order History' },
  },
  {
    path: 'details/:orderId',
    component: StatusHistoryComponent,
    data: { title: 'Order details History' },
  },
  {
    path: 'invoice/:orderId',
    component: InvoiceComponent,
    data: { title: 'Order Invoice' },
    resolve: {
      invoice: OrderResolveService,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
