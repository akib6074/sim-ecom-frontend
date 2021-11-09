import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from '../../../../../shared/services/response.service';
import { ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ShopService } from '../../shop.service';
import { IPoint } from '../../../../../core/dto/point.dto';
import { ImageSnippetDto } from '../../../../../core/dto/image.dto';
import { MapsAPILoader } from '@agm/core';
import { TokenStorageService } from '../../../../../../app/core/services/token-storage.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  editShopForm!: FormGroup;
  isLoading = false;
  btnLabel = 'Update';
  id = '';
  isMerchantSearching = false;
  merchantFiltering: FormControl = new FormControl();
  merchantOptions: Array<{ id: string; name: string }> = [];
  filteredMerchantOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);
  isTypeSearching = false;
  typeFiltering: FormControl = new FormControl();
  typeOptions: Array<{ id: string; name: string }> = [];
  filteredTypeOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);
  /***************** location ****************/
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  location: IPoint = {
    x: 0,
    y: 0,
  };
  zoom = 15;
  /**************** image *******************/
  selectedCoverFile!: ImageSnippetDto;
  shopCoverImageName = '';
  selectedProfileFile!: ImageSnippetDto;
  shopProfileImageName = '';
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();
  private geoCoder: any;

  constructor(
    private readonly shopService: ShopService,
    private readonly snackBarService: ResponseService,
    private route: ActivatedRoute,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public readonly token: TokenStorageService
  ) {
    if (this.token.isAdmin()) {
      this.router.navigate(['/dashboard/shop/edit']);
    } else {
      if (!this.token.hasLicenseAndNID()) {
        this.router.navigate(['/dashboard/user/edit/profile']);
      }
    }
  }

  ngOnInit(): void {
    if (this.route.snapshot.data?.merchants?.length > 0) {
      this.merchantOptions = this.route.snapshot.data?.merchants;
    } else {
      this.merchantOptions = [];
    }
    this.filteredMerchantOptions.next(this.merchantOptions);

    this.typeOptions = this.route.snapshot.data?.types;
    this.filteredTypeOptions.next(this.typeOptions);

    this.formInit(this.route.snapshot.data?.shop);
    this.filterMerchant();
    this.filterType();
    this.mapLoader();
  }

  formInit = (shop: any) => {
    this.id = shop.id;
    this.editShopForm = new FormGroup({
      name: new FormControl(shop.name, Validators.required),
      domain: new FormControl(shop.domain, Validators.required),
      url: new FormControl(shop.url, [
        Validators.required,
        Validators.pattern(
          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
        ),
      ]),
      location: new FormControl(shop.location, Validators.required),
      geoLocation: new FormControl(shop.geoLocation),
      shopTypeID: new FormControl(shop.shopType?.id, Validators.required),
      merchantID: new FormControl(shop?.merchant?.id, Validators.required),
      shopCoverImage: new FormControl(
        this.shopCoverImageName,
        Validators.required
      ),
      shopProfileImage: new FormControl(
        this.shopProfileImageName,
        Validators.required
      ),
      description: new FormControl(shop.description, Validators.required),
    });
  };

  filterMerchant = () => {
    this.merchantFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isMerchantSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.merchantOptions) {
            return [];
          }
          return this.merchantOptions.filter(
            (merchant) =>
              merchant.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isMerchantSearching = false;
          this.filteredMerchantOptions.next(filtered);
        },
        () => {
          this.isMerchantSearching = false;
        }
      );
  };

  filterType = () => {
    this.typeFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isTypeSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.typeOptions) {
            return [];
          }
          return this.typeOptions.filter(
            (type) => type.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isTypeSearching = false;
          this.filteredTypeOptions.next(filtered);
        },
        () => {
          this.isTypeSearching = false;
        }
      );
  };

  save = () => {
    if (this.editShopForm.valid) {
      this.saveData();
    }
  };

  saveData = () => {
    this.isLoading = true;
    this.shopService
      .update(this.id, this.editShopForm.value)
      .subscribe((response: any) => {
        this.isLoading = false;
        if (this.snackBarService.fire(response)) {
          Promise.all([this.saveCoverImage(), this.saveProfileImage()]).then(
            () => {
              this.editShopForm.reset();
              this.router.navigate(['/dashboard/shop']);
            }
          );
        } else {
          this.btnLabel = 'Try Again!';
        }
      });
  };

  saveCoverImage = () => {
    this.shopService.uploadCoverImage(this.shopCoverImageName).subscribe(() => {
      console.log('Cover image uploaded to server successfully');
    });
    return true;
  };

  saveProfileImage = () => {
    this.shopService
      .uploadProfileImage(this.shopProfileImageName)
      .subscribe(() => {
        console.log('Profile image uploaded to server successfully');
      });
    return true;
  };

  /***************** location ****************/
  mapLoader = () => {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.location.x = place.geometry.location.lat();
          this.location.y = place.geometry.location.lng();
        });
      });
    });
  };

  getAddress(latitude: any, longitude: any): void {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            this.editShopForm.controls.location.setValue(
              results[0].formatted_address
            );
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  addMarker = (lat: number, lng: number) => {
    this.location.x = lat;
    this.location.y = lng;
    this.editShopForm.controls.geoLocation.setValue(this.location);
    this.getAddress(this.location.x, this.location.y);
  };

  /********************** image ************************/
  waitForCoverImageRes = (imageInput: any) => {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedCoverFile = new ImageSnippetDto(event.target.result, file);
      this.shopService
        .uploadCoverImageRedis(this.selectedCoverFile.file)
        .subscribe(
          (res) => {
            this.shopCoverImageName = res.filename;
            this.editShopForm.controls.shopCoverImage.setValue(
              this.shopCoverImageName
            );
          },
          (err) => {
            console.log(err);
          }
        );
    });
    reader.readAsDataURL(file);
  };

  waitForProfileImageRes = (imageInput: any) => {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedProfileFile = new ImageSnippetDto(event.target.result, file);
      this.shopService
        .uploadProfileImageRedis(this.selectedProfileFile.file)
        .subscribe(
          (res) => {
            this.shopProfileImageName = res.filename;
            this.editShopForm.controls.shopProfileImage.setValue(
              this.shopProfileImageName
            );
          },
          (err) => {
            console.log(err);
          }
        );
    });
    reader.readAsDataURL(file);
  };

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private setCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.x = position.coords.latitude;
        this.location.y = position.coords.longitude;
        this.editShopForm.controls.geoLocation.setValue(this.location);
        this.getAddress(this.location.x, this.location.y);
      });
    }
  }
}
