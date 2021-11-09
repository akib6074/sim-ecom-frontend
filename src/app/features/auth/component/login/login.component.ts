import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TokenStorageService} from '../../../../core/services/token-storage.service';
import {ResponseService} from '../../../../shared/services/response.service';
import {AuthService} from '../../auth.service';
import {LoginDto} from '../../../../shared/dto/user/login.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordVisibility = false;
  isKeepLogin = 0;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private responseService: ResponseService
  ) {
  }

  ngOnInit(): void {
    this.tokenStorage.removeToken();
    this.tokenStorage.removeUser();
    this.initForm();
  }

  initForm = () => {
    this.loginForm = new FormGroup({
      phoneOrEmail: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  };

  changeCheckBox(event: any): void {
    if (event === true) {
      this.isKeepLogin = 1;
    } else {
      this.isKeepLogin = 0;
    }
  }

  onSubmit = () => {
    if (this.loginForm.valid) {
      const dataForSubmit = new LoginDto();
      dataForSubmit.phone = this.loginForm.value.phoneOrEmail;
      dataForSubmit.email = this.loginForm.value.phoneOrEmail;
      dataForSubmit.password = this.loginForm.value.password;
      dataForSubmit.isChecked = this.isKeepLogin;

      this.authService.login(dataForSubmit).subscribe(
        (data) => {
          this.responseService.fire(data);
          if (!data.error) {
            this.tokenStorage.saveToken(data?.payload?.data.accessToken);
            this.tokenStorage.saveUser(data);
            this.goTo();
          }
        },
        (err: any) => {
          if (err.error instanceof ProgressEvent) {
            this.responseService.message(err.message);
          } else {
            this.responseService.fire(err.error || err);
          }
        }
      );
    }
  };

  goTo = () => {
    if (this.tokenStorage.isOnlyCustomer()) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  };
}
