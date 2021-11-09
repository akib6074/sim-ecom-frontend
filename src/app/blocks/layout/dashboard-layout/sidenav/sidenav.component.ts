import { Component, Inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { ResponseService } from '../../../../shared/services/response.service';
import { ApiConfigService } from '../../../../core/services/api-config.service';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  tokenId: string;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public readonly token: TokenStorageService,
    private readonly responseService: ResponseService,
    private readonly apiConfigService: ApiConfigService,
    private router: Router,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  ngOnInit(): void {
    this.tokenId = this.token.getUserId();
  }

  logOut(): void {
    this.token.signOut();
    this.goLoginPage();
    this.responseService.message('Logged out', false);
  }

  goLoginPage = () => {
    this.document.location.href = this.apiConfigService.getLoginUrl();
  };

  gotoChangePassword = (token: any) => {
    this.router.navigate(['/auth/reset-password/' + token]);
  };
}
