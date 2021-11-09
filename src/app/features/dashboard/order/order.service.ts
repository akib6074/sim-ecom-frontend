import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroserviceURL } from 'src/app/core/enum/microservices.enum';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { ResponseDto } from '../../../shared/dto/reponse/response.dto';

@Injectable()
export class OrderService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER) + `orders`;

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  pagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    status = 0
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&status=${status}`
    );

  findByID = (id: string): Observable<ResponseDto> =>
    this._httpClient.get(`${this.baseUrl}/${id}`) as Observable<ResponseDto>;

  changeStatusByID = (
    id: string,
    status: { status: number }
  ): Observable<ResponseDto> =>
    this._httpClient.put(
      `${this.baseUrl}/change-status/${id}`,
      status
    ) as Observable<ResponseDto>;

  remove = (id: string | null): Observable<any> =>
    this._httpClient.delete(`${this.baseUrl}/${id}`);
}
