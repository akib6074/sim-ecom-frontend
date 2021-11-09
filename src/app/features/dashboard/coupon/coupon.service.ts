import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `coupon`;

  constructor(
    private apiConfigService: ApiConfigService,
    private readonly _httpClient: HttpClient
  ) {}

  pagination = (
    page: number,
    limit: number,
    sort: string,
    order: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    );

  create = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}`, dto);


  getAll = (): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}`);
}
