import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../../core/enum/microservices.enum';
import { TokenStorageService } from '../../../../../app/core/services/token-storage.service';

@Injectable()
export class ShopCountResolveService implements Resolve<any> {
  Url =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + 'shops/shop-count';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService,
    private readonly token: TokenStorageService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (this.token.isMerchant()) {
      let url = `${this.Url}/${this.token.getUserId()}`;
      return this._httpClient.get(url).pipe(
        map((res: any) => res?.payload?.data || {}),
        map((shopCount: any) => ({ count: shopCount })),
      );
    }
  }
}
