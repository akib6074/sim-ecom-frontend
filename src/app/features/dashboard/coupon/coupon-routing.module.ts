import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { ThanaResolveService } from "./resolvers/thana-resolve.service";
const routes: Routes = [
  {
    path: 'add',
    component: AddComponent,
    data: {
      title: 'add coupon',
    },
    resolve: {
      thanas: ThanaResolveService,
    },
  },
  {
    path: 'list',
    component: ListComponent,
    data: {
      title: 'List',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponRoutingModule {}
