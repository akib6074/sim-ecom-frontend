import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ApiConfigService} from '../../../../core/services/api-config.service';
import {MicroserviceURL} from '../../../../core/enum/microservices.enum';

@Injectable()
export class CategoryResolveService implements Resolve<any> {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + 'categories';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this._httpClient.get(`${this.baseUrl}`).pipe(
      map((res: any) => res?.payload?.data || {}),
      map((shops: any[]) => shops.map((data: any) => ({id: data.id, name: data.name})))
    );
  }
}
