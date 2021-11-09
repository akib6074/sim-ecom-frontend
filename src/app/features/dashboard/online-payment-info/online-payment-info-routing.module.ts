import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Online Payment Info' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlinePaymentInfoRoutingModule {}
