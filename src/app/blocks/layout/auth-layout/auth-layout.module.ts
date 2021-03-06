import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout/layout.component';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
})
export class AuthLayoutModule {
}
