import { Component, EventEmitter, Output } from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
} from '@angular/router';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { ResponseService } from '../../../../services/response.service';
import { ShoppingCartService } from '../../../../services/shopping-cart.service';
import { CartInterface } from '../../../../interfaces/cart.interface';
import { CreateCartDetailsDto } from '../../../../dto/cart/create/create-cart-details.dto';
import { UserProfileService } from '../../../../../features/dashboard/user/components/user-profile/userprofile.service';
import { AddressDto } from '../../../../../../app/shared/dto/core/address.dto';
import { UserDto } from '../../../../../../app/shared/dto/user/user.dto';
import { ImageType } from '../../../../../core/enum/image-type.enum';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  @Output() closeCart = new EventEmitter<boolean>();
  cart: Array<CartInterface> = [];
  imageType = ImageType.PRODUCT_SMALL;
  unit = ['item', 'items'];
  index: number;
  calculatedCart = {
    items: 0,
    totalAmount: 0,
    discount: 0,
    additionalShippingCharge: 0,
    vat: 0,
    shippingCharge: 0,
    grandTotal: 0,
  };
  coupon = '';
  isInMaxCartPage = false;
  isLoading = false;
  address!: AddressDto;
  user!: UserDto;

  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    private readonly tokenService: TokenStorageService,
    private readonly responseService: ResponseService,
    private readonly userProfileService: UserProfileService,
    private readonly router: Router
  ) {
    Promise.all([
      router.events.subscribe((routerEvent: Event) => {
        if (
          routerEvent instanceof NavigationEnd ||
          routerEvent instanceof NavigationCancel ||
          routerEvent instanceof NavigationError
        ) {
          this.isInMaxCartPage = routerEvent.url.includes('cart');
        }
      }),
      this.shoppingCartService.cart$.subscribe((cart) => {
        this.cart = cart;
        this.calculatedCart = this.shoppingCartService.calculateCart(cart);
        if (this.calculatedCart.items <= 1) {
          this.index = 0;
        } else {
          this.index = 1;
        }
      }),
      this.shoppingCartService.coupon$.subscribe((coupon) => {
        this.coupon = coupon;
      }),
      this.userProfileService
        .getUserProfile(tokenService.getUserId())
        .subscribe((res) => {
          this.user = res?.payload?.data;
          this.address = this.user?.address;
        }),
    ])
      .then((t) => t)
      .catch((e) => e);
  }

  increment = (product: any) => {
    this.shoppingCartService.addProduct(product, 0);
  };

  decrement = (product: any, quantity: number) => {
    if (quantity !== 1) {
      this.shoppingCartService.decrementProduct(product);
    }
  };

  remove = (productID: string) => {
    this.shoppingCartService.removeProduct(productID);
  };

  hideCart = () => {
    this.closeCart.emit(true);
  };

  toFixedNumber = (value: string | number): number =>
    Number(Number(value.toString()).toFixed(2));

  getPrice(product: any) {
    if (product && product.productAttribute) {
      return Number(product?.productAttribute?.price || 0);
    } else {
      return Number(product?.product?.price || 0);
    }
  }

  couponApply = () => {
    this.shoppingCartService.addCoupon(this.coupon);
    this.responseService.message('COUPON IS APPLIED', false);
  };

  placeOrder = () => {
    if (this.tokenService.isLoggedIn()) {
    } else {
      this.router.navigate(['/auth', 'login']);
    }
    if (!this.cart?.length) {
      this.responseService.message('Add something to the cart first!!');
      return;
    }
    if (this.tokenService.isLoggedIn()) {
      const cartDetails: CreateCartDetailsDto[] = [];
      this.cart.forEach((cartDetail) => {
        const createCartDetailsDto = new CreateCartDetailsDto();
        createCartDetailsDto.quantity = cartDetail?.quantity;
        createCartDetailsDto.productID = cartDetail?.product?.id;
        if (cartDetail?.productAttribute?.id) {
          createCartDetailsDto.productAttributeID =
            cartDetail?.productAttribute?.id;
        }
        cartDetails.push(createCartDetailsDto);
      });
      const cart = {
        userID: this.tokenService.getUserId(),
        cartDetails,
      };
      this.shoppingCartService.createCart(cart).subscribe(
        (res: any) => {
          if (!res.error && res?.payload.data) {
            this.responseService.fire(res);
            this.shoppingCartService.setPlacedOrder(res?.payload?.data);
            this.hideCart();
            this.router.navigate(['/cart']);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      this.responseService.message('Please login first!');
      this.router.navigate(['/auth/login']);
    }
  };

  // order part
  proceedToBilling = (): void => {
    if (!this.cart?.length) {
      this.responseService.message('Add something to the cart first!!');
      return;
    }
    if (this.tokenService.isLoggedIn()) {
      this.generateOrder();
    } else {
      this.router.navigate(['/auth/login']);
    }
  };

  generateOrder = () => {
    const cartID = this.shoppingCartService.getPlacedOrder().id;
    const cart = {
      userID: this.tokenService.getUserId(),
      cartID,
      coupon: this.coupon,
      reference: 'test',
      status: 1,
    };
    if (!this.isLoading) {
      this.isLoading = true;
      this.shoppingCartService.createOrder(cart).subscribe(
        (res: any) => {
          this.isLoading = false;
          if (!res.error && res.payload.data) {
            this.responseService.message(
              'Order is created. Redirecting to billing page!',
              false
            );
            this.shoppingCartService.clearCart();
            this.shoppingCartService.removePlacedOrder();
            this.shoppingCartService.setPendingOrder(res?.payload?.data);
            this.router.navigate(['/order/' + res?.payload?.data?.id]);
          }
        },
        (error: any) => {
          console.log(error);
          this.isLoading = false;
        }
      );
    }
  };
}
