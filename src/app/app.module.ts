import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core/core.module';
import {HttpClientModule} from '@angular/common/http';
import {BlocksModule} from './blocks/blocks.module';
import {AppComponent} from './blocks/root/app.component';
import {authInterceptorProvider} from './core/interceptors/auth.interceptor';
import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt';
import {AuthGuard} from './shared/guards/auth.guard';
import {LoggedGuard} from './shared/guards/logged.guard';
import {AdminGuard} from './shared/guards/admin.guard';
import {SuperAdminGuard} from './shared/guards/super-admin.guard';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    BlocksModule,
    SharedModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    authInterceptorProvider,
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    JwtHelperService,
    AuthGuard,
    LoggedGuard,
    AdminGuard,
    SuperAdminGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
