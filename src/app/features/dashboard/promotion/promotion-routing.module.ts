import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import { ProductResolveService } from './resolvers/product-resolve.service';
import { ShopResolveService } from './resolvers/shop-resolve.service';

const routes: Routes = [
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Add' },
    resolve: {
      shops: ShopResolveService,
      products: ProductResolveService,
    },
  },
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'List' },
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionRoutingModule {}
