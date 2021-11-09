import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductReviewDto } from '../../../../../../app/shared/dto/product/product-review.dto';
import { ProductService } from '../../../../../../app/features/site/product/product.service';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { ImageService } from '../../../../../shared/services/image.service';
import { ResponseService } from '../../../../../shared/services/response.service';
import { ShoppingCartService } from '../../../../../shared/services/shopping-cart.service';
import { ProductDto } from '../../../../../shared/dto/product/product.dto';

@Component({
  selector: 'app-product-profile',
  templateUrl: './product-profile.component.html',
  styleUrls: ['./product-profile.component.scss'],
})
export class ProductProfileComponent implements OnInit, AfterViewInit {

  product: ProductDto;
  isImageLoading = true;
  productImages: any[] = [];

  productReviews: ProductReviewDto[] = [];

  productDescription = true;
  ratingReview = false;
  state: string;

  rating = 0;
  starCount = 5;

  attributes: {
    [x: string]: { name: string; id: string }[];
  } = {};
  attributeKeyNames: string[] = [];

  filter: any = {};

  firstLevelAttributes: any[] = [];
  firstLevelSelectedAttribute: any = {};

  secondLevelAttributes: any[] = [];
  secondLevelSelectedAttribute: any = {};

  selectedProductAttributeId: string;

  constructor(
    private readonly route: ActivatedRoute,
    private imageService: ImageService,
    private router: Router,
    private cartService: ShoppingCartService,
    private responseService: ResponseService,
    private cdRef: ChangeDetectorRef,
    private productService: ProductService
  ) {
    this.product = this.route.snapshot.data?.product;
  }

  ngOnInit(): void {
    this.setAttributes();
    this.loadImage();
    this.loadReviews();
  }

  onRatingChanged(rating: any) {
    this.rating = rating;
  }

  loadReviews = () => {
    this.productService.getProductReview(this.product.id).subscribe((res) => {
      this.productReviews = res?.payload?.data;
    });
  };

  setInitialFilter = () => {
    for (let key of this.attributeKeyNames) {
      this.filter[key] = '';
    }
  };

  setAttributes = () => {
    if (!this.product?.productAttributes?.length) {
      return;
    }

    this.product.productAttributes.forEach((pa: any) => {
      if (pa?.attributes?.length) {
        pa.attributes.forEach((attribute: any) => {
          this.attributes[attribute?.attributeGroup?.name] = [];
        });
      }
    });

    this.product.productAttributes.forEach((pa: any) => {
      if (pa?.attributes?.length) {
        pa.attributes.forEach((attribute: any) => {
          if (attribute?.attributeGroup?.isColorGroup) {
            this.attributes[attribute?.attributeGroup?.name].push({
              name: attribute.color,
              id: attribute.id,
            });
          } else {
            this.attributes[attribute?.attributeGroup?.name].push({
              name: attribute.name,
              id: attribute.id,
            });
          }
        });
      }
    });

    this.attributeKeyNames = this.productService.getMaxAttributeKeyNames(this.product);
    this.setInitialFilter();

    if (this.attributeKeyNames && this.attributeKeyNames.length > 0) {
      this.firstLevelAttributes = this.productService.findAttributeNames(this.filter,this.attributeKeyNames,0,this.product);
      if (this.firstLevelAttributes && this.firstLevelAttributes.length) {
        this.firstLevelSelectedAttribute = this.firstLevelAttributes[0];
        this.selectedProductAttributeId = this.firstLevelSelectedAttribute.id;
        this.filter[this.firstLevelSelectedAttribute.key] = this.firstLevelSelectedAttribute.name;
      }
    }

    if (this.attributeKeyNames && this.attributeKeyNames.length > 1) {
      this.setSecondLevelAttributes();
    }
  };

  loadImage = (): void => {
    this.isImageLoading = true;
    Promise.all([
      this.product.image.cover.includes('http:')
        ? this.productImages.push({ path: this.product.image.cover })
        : this.product.image.cover.includes('assets')
        ? this.productImages.push({ path: this.product.image.cover })
        : this.productImages.push({
            path: this.imageService.loadImage(
              this.product.image.cover,
              ImageType.PRODUCT_BIG
            ),
          }),
      this.product.image.gallery.forEach((image: any) => {
        if (image.includes('http:')) {
          this.productImages.push({ path: image });
        } else if (image.includes('assets')) {
          this.productImages.push({ path: image });
        } else {
          this.productImages.push({
            path: this.imageService.loadImage(image, ImageType.PRODUCT_BIG),
          });
        }
        console.log(this.productImages);
      }),
    ]).then(() => {
      this.isImageLoading = false;
    });
  };

  addToCart = (product: ProductDto) => {
    if (this.selectedProductAttributeId) {
      let productAttribute = product.productAttributes.filter((productAttribute)=> productAttribute.id === this.selectedProductAttributeId)
      this.cartService.addProduct(product, 1, productAttribute[0]);
    } else {
      this.cartService.addProduct(product, 1);
    }
    this.responseService.message('Added to cart successfully!!', false);
  };

  gotoShop = (product: ProductDto) => {
    this.router.navigate(['/shop/' + product?.shop?.name.replace(/\s/g, '~~')]);
  };

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  showProductDescription() {
    this.productDescription = true;
    this.ratingReview = false;
  }

  showRatingReview(el: HTMLElement) {
    this.productDescription = false;
    this.ratingReview = true;
    if (el) {
      el.scrollIntoView();
    }
  }

  reviewSubmitted(data: any) {
    this.productReviews.push(data);
  }

  onFirstAttributeSelectionChange(value:any) {
    let selectedAttribute = this.firstLevelAttributes.filter((attribute) => attribute.name === value);
    if (selectedAttribute && selectedAttribute.length) {
      this.firstLevelSelectedAttribute = selectedAttribute[0];
      this.selectedProductAttributeId = this.firstLevelSelectedAttribute.id;
      this.filter = {};
      this.filter[this.firstLevelSelectedAttribute.key] = this.firstLevelSelectedAttribute.name;
      this.setSecondLevelAttributes();
    }
  }

  onSecondAttributeSelectionChange(value:any) {
    let selectedAttribute = this.secondLevelAttributes.filter((attribute)=>attribute.name === value);
    if (selectedAttribute && selectedAttribute.length) {
      this.secondLevelSelectedAttribute = selectedAttribute[0];
      this.selectedProductAttributeId = this.secondLevelSelectedAttribute.id;
      this.filter[this.secondLevelSelectedAttribute.key] = this.secondLevelSelectedAttribute.name;
    }
  }

  setSecondLevelAttributes() {
    this.secondLevelAttributes = this.productService.findAttributeNames(this.filter, this.attributeKeyNames,1, this.product);
    if (this.secondLevelAttributes && this.secondLevelAttributes.length) {
      this.secondLevelSelectedAttribute = this.secondLevelAttributes[0];
      this.filter[this.secondLevelSelectedAttribute.key] = this.secondLevelSelectedAttribute.name;
    }
  }

}
