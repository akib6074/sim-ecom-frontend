import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { DepartmentResolveService } from './resolvers/department-resolve.service';
const routes: Routes = [
  {
    path: '',
    component: AddComponent,
    data: {
      title: 'add ticket',
    },
    resolve: {
      departments: DepartmentResolveService,
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
export class TicketRoutingModule {}
