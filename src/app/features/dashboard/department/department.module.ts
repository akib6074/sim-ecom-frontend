import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { DepartmentRoutingModule } from './department-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { DepartmentService } from './department.service';

@NgModule({
  declarations: [AddComponent, ListComponent],
  imports: [CommonModule, DepartmentRoutingModule, SharedModule],
  providers: [DepartmentService],
})
export class DepartmentModule {}
