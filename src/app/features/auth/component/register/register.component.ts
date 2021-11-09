import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, filter, map, takeUntil, tap } from 'rxjs/operators';

import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { ResponseDto } from '../../../../shared/dto/reponse/response.dto';
import { ResponseService } from '../../../../shared/services/response.service';
import { AuthService } from '../../auth.service';

interface Options {
  value: number;
  label: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  genders: Options[] = [
    { value: 1, label: 'Male' },
    { value: 2, label: 'Female' },
    { value: 3, label: 'Unknown' },
  ];

  countryCodes: Options[] = [{ value: +88, label: 'BD (+88)' }];

  address!: string;
  isLoading = false;
  isSubmitted = false;
  registrationForm!: FormGroup;
  passwordVisibility = false;
  confirmPasswordVisibility = false;
  maxDate = new Date();
  registrationType!: string | null;

  isSearching = false;
  isFetching = true;

  districtOptions: Array<{ id: string; name: string }> = [];
  districtFiltering: FormControl = new FormControl();
  filteredDistrictOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  thanaOptions: Array<{ id: string; name: string }> = [];
  thanaFiltering: FormControl = new FormControl();
  filteredThanaOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly responseService: ResponseService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.registrationType = params.get('type');
      this.initForm();
      this.filterDistrict();
      this.filterThana();
      this.getDistricts();
    });
  }

  initForm = () => {
    this.registrationForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      dateOfBirth: new FormControl(null, [Validators.required]),
      countryCode: new FormControl(this.countryCodes[0].value, [
        Validators.required,
      ]),
      phone: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,20})/),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        this.matchPasswordValidator,
      ]),
      district: new FormControl(null, [Validators.required]),
      thana: new FormControl(null, [Validators.required]),
      addressPlain: new FormControl(null, [Validators.required]),
      captcha: new FormControl(null, [Validators.required]),
    });
  };

  hasError = (control: string, error: string) =>
    this.registrationForm.controls[control].hasError(error);

  getDistricts = () => {
    {
      this.authService.getIdsAndNamesDistricts().subscribe((res) => {
        this.districtOptions = res;
        this.filteredDistrictOptions.next(this.districtOptions);
        this.isFetching = false;
      });
    }
  };

  filterDistrict = () => {
    this.districtFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.districtOptions) {
            return [];
          }
          return this.districtOptions.filter(
            (district) =>
              district?.name?.toLowerCase().indexOf(search?.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isSearching = false;
          this.filteredDistrictOptions.next(filtered);
        },
        () => {
          this.isSearching = false;
        }
      );
  };

  filterThana = () => {
    this.thanaFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.thanaOptions) {
            return [];
          }
          return this.thanaOptions.filter(
            (thana) =>
              thana?.name?.toLowerCase().indexOf(search?.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isSearching = false;
          this.filteredThanaOptions.next(filtered);
        },
        () => {
          this.isSearching = false;
        }
      );
  };

  onDistrictSelect = () => {
    const districtID = this.registrationForm.controls.district.value || '';
    this.getThanasByDistrict(districtID);
  };

  getThanasByDistrict = (districtID: string = '') => {
    this.authService
      .getIdsAndNamesThanasByDistrict(districtID)
      .subscribe((res) => {
        this.thanaOptions = res;
        this.filteredThanaOptions.next(this.thanaOptions);
        this.isFetching = false;
      });
  };

  matchPasswordValidator = (control: AbstractControl) => {
    if (control && control.value) {
      const passwordControl = control.root.get('password');
      if (control.value !== passwordControl?.value) {
        return { hasError: true };
      }
    }
    return null;
  };

  gotoOtp = (userId: string) => {
    this.router.navigate(['/auth/otp/' + userId]);
  };

  register = () => {
    if (this.registrationForm.valid) {
      this.isSubmitted = true;
      const userDto = this.registrationForm.value;
      delete userDto.countryCode;
      delete userDto.confirmPassword;
      // eslint-disable-next-line eqeqeq
      if (this.registrationType == 'merchant') {
        userDto.type = 4;
      } else {
        userDto.type = 3;
      }

      this.authService.register(userDto).subscribe(
        (response: ResponseDto) => {
          this.responseService.fire(response);
          if (!response.error) {
            const userId = response.payload?.data.id;

            this.tokenStorageService.saveUser(response);
            this.gotoOtp(userId);
          }
        },
        (err: any) => {
          this.responseService.fire(err);
          this.isSubmitted = false;
        }
      );
    } else {
      if (!this.registrationForm.controls.captcha.valid) {
        this.responseService.message('Invalid captcha');
      } else {
        this.responseService.message('Fill up all required fields!');
      }
    }
  };

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
