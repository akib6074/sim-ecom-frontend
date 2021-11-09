import { IPoint } from './../../../../../core/dto/point.dto';
import { MapsAPILoader } from '@agm/core';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone, OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { LoaderService } from '../../../../../../app/core/services/loader.service';
import { FilterOption } from '../../../../../../app/core/dto/filter-option.dto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-search',
  templateUrl: './top-search.component.html',
  styleUrls: ['./top-search.component.scss'],
})
export class TopSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  categoryData: any[] = [];
  shopsByLocation: any;

  searchKey = '';
  locationKey = '';
  searchPlaceholder = 'Search Shops';
  currentRoute: any;

  /***************** location ****************/
  currentLocation = '';
  @ViewChild('locationSearch')
  public locationSearchElementRef!: ElementRef;

  searchLocation: IPoint = {
    x: 0,
    y: 0,
  };

  cityAddress!: string | undefined;
  cityName!: string;
  zoom = 8;
  geoCoder: any;
  filterOption: FilterOption = {
    search: '',
    price: '',
    rating: '',
    algorithm: 'latest',
  };
  showMap: boolean;
  keySearchSubscription: Subscription;
  locationSearchStatusSubscription: Subscription;
  getShopsByLocationSearchSubscription: Subscription;
  shopListByLocation: any[] = [];
  label: string;

  constructor(
    private ngZone: NgZone,
    private readonly router: Router,
    public readonly token: TokenStorageService,
    private readonly mapsAPILoader: MapsAPILoader,
    private readonly loaderService: LoaderService,
    private readonly cdrf: ChangeDetectorRef,
  ) {}

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('categories') set categories(input: any[]) {
    this.categoryData = input;
  }

  ngOnInit(): void {
    this.keySearchSubscription = this.loaderService.keySearch.subscribe((res) => {
      this.searchPlaceholder = res;
    });
    this.locationSearchStatusSubscription = this.loaderService.locationSearchStatus.subscribe((res) => {
      this.showMap = res;
    });
    this.getShopsByLocationSearchSubscription = this.loaderService.getShopsByLocationSearch.subscribe((res) => {
      this.shopListByLocation = res;
    });
    this.mapLoader();
    this.currentRoute = this.router.url;
  }

  ngAfterViewInit(): void {
    this.cdrf.detectChanges();
  }

  gotoCategoryProfile = (category: any) => {
    this.router.navigate(['/product/category/' + category.id]);
  };

  location = (value: string) => {
    if (!value) {
      this.loaderService.locationSearch.next({ x: 0, y: 0 });
    }
  };

  filterChange = (source: any, selection: string) => {
    if (selection === 'price') {this.filterOption.price = source.value;}
    if (selection === 'rating') {this.filterOption.rating = source.value;}
    if (selection === 'algorithm') {this.filterOption.algorithm = source.value;}
    if (this.filterOption.search && this.filterOption.search.length > 2) {
      this.loaderService.filterSearch.next(this.filterOption);
    }
  };

  search = () => {
    this.filterOption.search = this.searchKey;
    this.loaderService.filterSearch.next(this.filterOption);
  };

  goToProfile = () => {
    if (this.token.isLoggedIn()) {
      this.router.navigate(['/dashboard/user/profile']);
    } else {
      this.router.navigate(['/auth', 'login']);
    }
  };

  /***************** location ****************/
  mapLoader = () => {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      const autocomplete = new google.maps.places.Autocomplete(
        this.locationSearchElementRef.nativeElement
      );

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.searchLocation.x = place.geometry.location.lat();
          this.searchLocation.y = place.geometry.location.lng();
          this.cityAddress = place.formatted_address;
          this.cityName = place.name;
          if (this.cityAddress && this.cityAddress?.indexOf('Bangladesh') > 0) {
            this.loaderService.locationSearch.next(this.searchLocation);
          }
          this.zoom = 12;
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
            this.currentLocation = results[0].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  searchShopsOrProducts() {
    if (this.searchLocation && this.searchLocation.x && this.searchLocation.y) {
      this.loaderService.locationSearch.next(this.searchLocation);
      if (this.showMap === false) {
        this.showMap = true;
        this.loaderService.locationSearchStatus.next(this.showMap);
      }
      else {
        this.showMap = false;
        this.loaderService.locationSearchStatus.next(this.showMap);
      }
    }
  }

  private setCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.searchLocation.x = position.coords.latitude;
        this.searchLocation.y = position.coords.longitude;
        this.getAddress(this.searchLocation.x, this.searchLocation.y);
      });
    }
  }

  closeMap() {
    this.showMap = false;
    this.loaderService.locationSearchStatus.next(this.showMap);
  }

  ngOnDestroy(): void {
    if (this.locationSearchStatusSubscription) {
      this.locationSearchStatusSubscription.unsubscribe();
    }
    if (this.keySearchSubscription) {
      this.keySearchSubscription.unsubscribe();
    }
    if (this.getShopsByLocationSearchSubscription) {
      this.getShopsByLocationSearchSubscription.unsubscribe();
    }
  }
}
