import { StickyDirection } from '@angular/cdk/table';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { LoaderService } from '../../../../../../app/core/services/loader.service';
import { TokenStorageService } from '../../../../../../app/core/services/token-storage.service';
import { AuthService } from '../../../../../../app/features/auth/auth.service';
import { AddressService } from '../../../../../../app/features/site/order/address.service';
import { AddressDto } from '../../../../../../app/shared/dto/core/address.dto';
import { ResponseService } from '../../../../../../app/shared/services/response.service';

interface Options {
  value: number;
  label: string;
}

@Component({
  selector: 'app-shipping-dialog',
  templateUrl: './shipping-dialog.component.html',
  styleUrls: ['./shipping-dialog.component.scss'],
})
export class ShippingDialogComponent implements OnInit {
  shippingAddressForm!: FormGroup;

  isFetching = true;
  isSearching = false;
  isLoading = false;
  isSubmitted = false;
  countryCodes: Options[] = [{ value: +88, label: 'BD (+88)' }];
  editShippingAddressValue: any;
  formSubmitType: boolean;

  districtOptions: Array<{ id: string; name: string }> = [];
  districtFiltering: FormControl = new FormControl();
  filteredDistrictOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  thanaOptions: Array<{ id: string; name: string }> = [];
  thanaFiltering: FormControl = new FormControl();
  filteredThanaOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  protected _onDestroy = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<ShippingDialogComponent>,
    private authService: AuthService,
    private readonly addressService: AddressService,
    private readonly responseService: ResponseService,
    private readonly loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.editShippingAddressValue = this.addressService.getShippingAddress();
    this.formSubmitType = this.addressService.formSubmitType();
    this.getThanasByDistrict(this.editShippingAddressValue?.district?.id);
    this.initForm();
    this.filterDistrict();
    this.filterThana();
    this.getDistricts();
  }

  initForm = () => {
    if (this.formSubmitType) {
      this.shippingAddressForm = new FormGroup({
        alias: new FormControl(null, [Validators.required]),
        firstname: new FormControl(null, [Validators.required]),
        lastname: new FormControl(null, [Validators.required]),
        phone: new FormControl(null, [Validators.required]),
        district: new FormControl(null, [Validators.required]),
        thana: new FormControl(null, [Validators.required]),
        address: new FormControl(null, [Validators.required]),
      });
    } else {
      this.shippingAddressForm = new FormGroup({
        alias: new FormControl(this.editShippingAddressValue?.alias, [
          Validators.required,
        ]),
        firstname: new FormControl(this.editShippingAddressValue?.firstname, [
          Validators.required,
        ]),
        lastname: new FormControl(this.editShippingAddressValue?.lastname, [
          Validators.required,
        ]),
        phone: new FormControl(this.editShippingAddressValue?.phone, [
          Validators.required,
        ]),
        district: new FormControl(this.editShippingAddressValue?.district?.id, [
          Validators.required,
        ]),
        thana: new FormControl(this.editShippingAddressValue?.thana?.id, [
          Validators.required,
        ]),
        address: new FormControl(this.editShippingAddressValue?.address, [
          Validators.required,
        ]),
      });
    }
  };

  onDistrictSelect = () => {
    const districtID = this.shippingAddressForm.controls.district.value || '';
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

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.shippingAddressForm.valid) {
      if (this.formSubmitType) {
        const address = this.shippingAddressForm.value as AddressDto;
        this.addressService.addShippingAddress(address).subscribe((res) => {
          if (!res.error) {
            this.responseService.fire(res.payload?.data);
            this.loaderService.shippingAddress.next(res.payload?.data);
          }
        });
      } else {
        const updateAddress = this.shippingAddressForm.value as AddressDto;
        this.addressService
          .updateShippingAddress(
            this.editShippingAddressValue.id,
            updateAddress
          )
          .subscribe((res) => {
            if (!res.error) {
              this.responseService.fire(res.payload?.data);
              this.loaderService.shippingAddress.next(res.payload?.data);
            }
          });
      }
    }
    this.closeDialog();
  }
}
