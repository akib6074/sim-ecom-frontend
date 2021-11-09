import {ResetPasswordComponent} from './component/reset-password/reset-password.component';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LoginComponent} from './component/login/login.component';
import {OtpComponent} from './component/otp/otp.component';
import {AuthRoutingModule} from './auth-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { AuthLayoutModule } from '../../blocks/layout/auth-layout/auth-layout.module';
import { AuthService } from './auth.service';
import { ForgetPasswordComponent } from './component/forget-password/forget-password.component';
import { RegisterComponent } from './component/register/register.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    OtpComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    AuthLayoutModule,
    AuthRoutingModule,
    NgxCaptchaModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}
