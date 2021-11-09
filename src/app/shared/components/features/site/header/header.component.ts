import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import { Component } from '@angular/core';
import { ApiConfigService } from '../../../../../core/services/api-config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  companyInfo: any = this.apiConfigService.getCompanyInfo();

  constructor(
    private readonly apiConfigService: ApiConfigService,
    public readonly token: TokenStorageService
  ) {}
}
