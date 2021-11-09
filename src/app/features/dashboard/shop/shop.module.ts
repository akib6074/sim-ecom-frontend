import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ShopRoutingModule } from './shop-routing.module';
import { ListComponent } from './components/list/list.component';
import { ShopService } from './shop.service';
import { AddComponent } from './components/add/add.component';
import { MerchantResolveService } from './resolvers/merchant-resolve.service';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../../../environments/environment';
import { EditComponent } from './components/edit/edit.component';
import { EditResolveService } from './resolvers/edit-resolve.service';
import { TypeResolveService } from './resolvers/type-resolve.service';
import { ShopCountResolveService } from './resolvers/shop-count-resolve.service';

@NgModule({
  declarations: [ListComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    SharedModule,
    ShopRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_map_api,
      libraries: ['places'],
    }),
  ],
  providers: [
    ShopService,
    MerchantResolveService,
    TypeResolveService,
    EditResolveService,
    ShopCountResolveService,
  ],
})
export class ShopModule {}
