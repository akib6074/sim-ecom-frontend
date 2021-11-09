import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ListComponent} from './components/list/list.component';
import {AddComponent} from './components/add/add.component';
import {MerchantResolveService} from './resolvers/merchant-resolve.service';
import {EditResolveService} from './resolvers/edit-resolve.service';
import {EditComponent} from './components/edit/edit.component';
import {TypeResolveService} from './resolvers/type-resolve.service';
import {ShopCountResolveService} from './resolvers/shop-count-resolve.service';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    data: {title: 'List'},
  },
  {
    path: 'add',
    component: AddComponent,
    data: {title: 'Add'},
    resolve: {
      merchants: MerchantResolveService,
      shopCount: ShopCountResolveService,
      types: TypeResolveService
    }
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: {title: 'Edit'},
    resolve: {
      merchants: MerchantResolveService,
      types: TypeResolveService,
      shop: EditResolveService,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {
}
