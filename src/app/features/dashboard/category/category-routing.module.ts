import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ListComponent} from './components/list/list.component';
import {AddComponent} from './components/add/add.component';
import {EditComponent} from './components/edit/edit.component';
import {RootsResolveService} from './resolvers/roots-resolve.service';
import {EditResolveService} from './resolvers/edit-resolve.service';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    data: {title: 'All Categories'},
  },
  {
    path: 'add',
    component: AddComponent,
    data: {title: 'Add'},
    resolve: {
      roots: RootsResolveService
    }
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: {title: 'Edit'},
    resolve: {
      roots: RootsResolveService,
      category: EditResolveService
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {
}
