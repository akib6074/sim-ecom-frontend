import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `products`;

  constructor(
    private apiConfigService: ApiConfigService,
    private readonly _httpClient: HttpClient
  ) {}

  pagination = (
    page: number,
    limit: number
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}/stock?page=${page}&limit=${limit}`
    );

}
