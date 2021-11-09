import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Add' },
  },
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'List' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentRoutingModule {}
