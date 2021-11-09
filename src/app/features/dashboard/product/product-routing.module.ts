import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AddComponent} from './components/add/add.component';
import {ListComponent} from './components/list/list.component';
import {EditComponent} from './components/edit/edit.component';
import {EditResolveService} from './resolvers/edit-resolve.service';
import {CategoryResolveService} from './resolvers/category-resolve.service';
import {ShopResolveService} from './resolvers/shop-resolve.service';
import {AttributeGroupResolveService} from './resolvers/attribute-group-resolve.service';

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
      categories: CategoryResolveService,
      shops: ShopResolveService,
      attributeGroups: AttributeGroupResolveService,
    }
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: {title: 'Edit'},
    resolve: {
      categories: CategoryResolveService,
      shops: ShopResolveService,
      attributeGroups: AttributeGroupResolveService,
      product: EditResolveService,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {
}
