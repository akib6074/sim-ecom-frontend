import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LayoutComponent} from './layout/layout.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatButtonToggleModule,
    MatTooltipModule,
  ],
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
})
export class SiteLayoutModule {
}
