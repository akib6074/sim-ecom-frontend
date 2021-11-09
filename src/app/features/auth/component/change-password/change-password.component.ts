import { TokenStorageService } from './../../../../core/services/token-storage.service';
import { ResponseService } from './../../../../shared/services/response.service';
import { AuthService } from './../../auth.service';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordDto } from '../../../../shared/dto/user/reset-password.dto';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  newPasswordVisibility = false;
  presentPasswordVisibility = false;
  confirmPasswordVisibility = false;
  tokenId: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly token: TokenStorageService,
  ) {}

  public static matchValues(
    matchTo: string
  ): (arg0: AbstractControl) => ValidationErrors | null {
    return (control: any): ValidationErrors | null =>
      !!control.parent &&
      !!control.parent.value &&
      control.value === control?.parent?.controls[matchTo].value
        ? null
        : { isMatching: false };
  }

  ngOnInit(): void {
    this.tokenId = this.token.getUserId(); 
    this.initForm();
  }

  initForm = () => {
    this.changePasswordForm = new FormGroup({
      presentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,20})/),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        ChangePasswordComponent.matchValues('newPassword'),
      ]),
    });
  };

  hasError = (control: string, error: string) => {
    return this.changePasswordForm.controls[control].hasError(error);
  };

  submit = () => {
    if (this.changePasswordForm.valid) {
      const postData = new ResetPasswordDto();
      postData.presentPassword = this.changePasswordForm.value.presentPassword;
      postData.newPassword = this.changePasswordForm.value.newPassword;
      postData.confirmPassword = this.changePasswordForm.value.confirmPassword;
      postData.token = this.tokenId || '';

      this.authService.resetPassword(postData).subscribe(
        (res) => {
          this.responseService.fire(res);
        },
        (err: any) => {
          if (err.error instanceof ProgressEvent) {
            this.responseService.message(err.message);
          } else {
            this.responseService.fire(err.error || err);
          }
        }
      );
    } else {
      this.responseService.message('Fill up all required fields!');
    }
  };

  goTo = () => {
    this.router.navigate(['/']);
  };
}
