import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { MicroserviceURL } from '../enum/microservices.enum';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER) + 'users';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}

  findOne = (id: string | null): Observable<any> =>
    this._httpClient.get(this.baseUrl + '/' + id);

  findAll = (): Observable<any> => this._httpClient.get(this.baseUrl);

  pagination = (
    page: number,
    limit: number,
    sort: string,
    order: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    );

  findProfileById = (id: string | null): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}/${id}/profile`);

  update = (id: string | null, user: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/${id}`, user);

  delete = (id: string | null): Observable<any> =>
    this._httpClient.delete(`${this.baseUrl}/${id}`);

  addRole = (id: string, addRole: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}/${id}/add-role`, addRole);

  sendEmail = (mailBody: any) =>
    this._httpClient.post(`${this.baseUrl}/mail/gmail`, mailBody);

  getWishlist = (): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}/wishlist`);
}
