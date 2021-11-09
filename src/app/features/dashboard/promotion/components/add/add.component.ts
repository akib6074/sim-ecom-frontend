import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject,ReplaySubject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ResponseService } from '../../../../../../app/shared/services/response.service';
import { ImageSnippetDto } from '../../../../../../app/core/dto/image.dto';
import { TokenStorageService } from '../../../../../../app/core/services/token-storage.service';
import { PromotionService } from '../../promotion.service';
import { PromotionType } from '../../../../../core/enum/promotion-type.enum';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit, OnDestroy {
  protected _onDestroy = new Subject<void>();

  isShopSearching = false;
  shopFiltering: FormControl = new FormControl();

  shopOptions: Array<{
    id: string;
    name: string;
    typeId: string;
    type: string;
  }> = [];

  filteredShopOptions: ReplaySubject<
    {
      id: string;
      name: string;
      typeId: string;
      type: string;
    }[]
  > = new ReplaySubject<
    {
      id: string;
      name: string;
      typeId: string;
      type: string;
    }[]
  >(1);

  isProductSearching = false;
  productFiltering: FormControl = new FormControl();

  productOptions: Array<{
    id: string;
    name: string;
    categoryId: string;
    category: string;
  }> = [];

  filteredProductOptions: ReplaySubject<
    {
      id: string;
      name: string;
      categoryId: string;
      category: string;
    }[]
  > = new ReplaySubject<
    {
      id: string;
      name: string;
      categoryId: string;
      category: string;
    }[]
  >(1);

  selectedCoverFile!: ImageSnippetDto;
  promotionCoverImageName = '';
  promotionTypeEnum = PromotionType;
  selectedPromotionType = '1' as PromotionType;
  promotionForm!: FormGroup;
  minDate = new Date();
  minStartDate = new Date();
  isLoading = false;

  constructor(
    private readonly token: TokenStorageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly promotionService: PromotionService,
    private readonly snackBarService: ResponseService
  ) {
    if (this.token.isAdmin()) {
      this.router.navigate(['/dashboard/promotion/add']);
    } else {
      if (!this.token.hasLicenseAndNID()) {
        this.router.navigate(['/dashboard/user/edit/profile']);
      }
    }
    console.log(this.route.snapshot.data);
    this.productOptions = this.route.snapshot.data?.products;
    this.filteredProductOptions.next(this.productOptions);

    this.shopOptions = this.route.snapshot.data?.shops;
    this.filteredShopOptions.next(this.shopOptions);
  }

  ngOnInit(): void {
    this.formInit();
    this.filterShop();
    this.filterProduct();
  }

  ngOnDestroy(): void {
    this._onDestroy.unsubscribe();
  }

  formInit = () => {
    this.promotionForm = new FormGroup({
      shopID: new FormControl(null, Validators.required),
      shopTypeID: new FormControl(null, Validators.required),
      productID: new FormControl(null, Validators.required),
      categoryID: new FormControl(null, Validators.required),
      type: new FormControl(this.selectedPromotionType, [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      promotionCoverImage: new FormControl(
        this.promotionCoverImageName,
        Validators.required
      ),
    });
  };

  filterShop = () => {
    this.shopFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isShopSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.shopOptions) {
            return [];
          }
          return this.shopOptions.filter(
            (shop) => shop.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isShopSearching = false;
          this.filteredShopOptions.next(filtered);
        },
        () => {
          this.isShopSearching = false;
        }
      );
  };

  filterProduct = () => {
    this.productFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isProductSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.productOptions) {
            return [];
          }
          return this.productOptions.filter(
            (product) =>
              product.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isProductSearching = false;
          this.filteredProductOptions.next(filtered);
        },
        () => {
          this.isProductSearching = false;
        }
      );
  };

  onShopChange(data: any) {
    const selectedShop = this.shopOptions.filter(
      (shop) => shop.id === data.value
    );
    if (selectedShop && selectedShop.length > 0) {
      this.promotionForm.controls.shopTypeID.setValue(selectedShop[0].typeId);
    }
  }

  onProductChange(data: any) {
    const selectedProduct = this.productOptions.filter(
      (product) => product.id === data.value
    );
    if (selectedProduct && selectedProduct.length > 0) {
      this.promotionForm.controls.categoryID.setValue(
        selectedProduct[0].categoryId
      );
    }
  }

  onPromotionTypeChange(data: any) {
    this.selectedPromotionType = data.value;
  }

  onStartDateChange(data: any) {
    this.minStartDate = data.value;
  }

  save() {
    if (this.promotionForm.valid) {
      this.saveData();
    }
  }

  saveData() {
    this.isLoading = true;
    const promotion = this.promotionForm.value;
    promotion.type = parseInt(promotion.type, 10);
    this.promotionService.create(promotion).subscribe((response: any) => {
      this.isLoading = false;
      if (this.snackBarService.fire(response)) {
        Promise.all([this.savePromotionImage(promotion.type)]).then(() => {
          this.promotionForm.reset();
          this.router.navigate(['/dashboard/promotion/list']);
        });
      }
    });
  }

  savePromotionImage = (type: number) => {
    this.promotionService
      .uploadCoverImage(this.promotionCoverImageName, type)
      .subscribe(() => {
        console.log('Profile image uploaded to server successfully');
      });
    return true;
  };

  waitForCoverImageRes = (imageInput: any) => {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedCoverFile = new ImageSnippetDto(event.target.result, file);
      this.promotionService
        .uploadCoverImageRedis(this.selectedCoverFile.file)
        .subscribe(
          (res) => {
            console.log(res);
            this.promotionCoverImageName = res.filename;
            this.promotionForm.controls.promotionCoverImage.setValue(
              this.promotionCoverImageName
            );
          },
          (err) => {
            console.log(err);
          }
        );
    });
    reader.readAsDataURL(file);
  };
}
