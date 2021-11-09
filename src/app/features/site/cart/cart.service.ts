import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/dto/reponse/response.dto';

@Injectable()
export class CartService {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER) + 'carts';
  url = this.apiConfigService.getUrl(MicroserviceURL.ORDER) + 'orders';

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}

  loadCustomerCart(): Observable<ResponseDto> {
    const customerCartUrl = this.baseUrl + '/customer-cart';
    return this._httpClient.get(customerCartUrl) as Observable<ResponseDto>;
  }
}
