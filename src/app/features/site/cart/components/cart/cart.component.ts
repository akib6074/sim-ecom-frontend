import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../../../../../shared/services/shopping-cart.service';
import { CartInterface } from '../../../../../shared/interfaces/cart.interface';
import { CartService } from '../../cart.service';
import { ProductAttributeDto } from '../../../../../shared/dto/product/product-attribute.dto';
import { ResponseService } from '../../../../../shared/services/response.service';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { MatDialog } from '@angular/material/dialog';
import { AddressService } from '../../../order/address.service';
import { LoaderService } from '../../../../../../app/core/services/loader.service';
import { ShippingDialogComponent } from '../../../../../../app/shared/components/features/site/shipping-dialog/shipping-dialog.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  imageType = ImageType.PRODUCT_SMALL;
  cart: CartInterface[] | any[];
  shippingAddresses: any[] = [];
  selection: any = null;
  coupon = '';
  calculatedCart = {
    items: 0,
    totalAmount: 0,
    discount: 0,
    additionalShippingCharge: 0,
    vat: 0,
    shippingCharge: 0,
    grandTotal: 0,
  };
  isLoading = false;
  unit = ['Item', 'Items'];
  index: number;

  constructor(
    private readonly router: Router,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly cartService: CartService,
    private readonly responseService: ResponseService,
    private readonly tokenService: TokenStorageService,
    public dialog: MatDialog,
    private readonly addressService: AddressService,
    private readonly loaderService: LoaderService
  ) {
    this.shoppingCartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.calculatedCart = this.shoppingCartService.calculateCart(cart);
      if (this.calculatedCart.items <= 1) {
        this.index = 0;
      } else {
        this.index = 1;
      }
    });
  }

  ngOnInit(): void {
    this.loadCurrentCart();

    this.addressService.getCustomerShippingAddresses().subscribe((res) => {
      if (!res.error && res.payload?.data) {
        for (const address of res.payload?.data) {
          this.shippingAddresses.push(address);
          console.log(this.shippingAddresses);
        }
      }
    });

    this.addNewShippingAddress();
  }

  loadCurrentCart() {
    this.cartService.loadCustomerCart().subscribe((res) => {
      if (!res.error && !res.payload?.data?.id) {
        this.router.navigate(['/product']);
      }
    });
  }

  // order part
  proceedToBilling = (): void => {
    if (this.selection === null) {
      this.responseService.message('Please select shipping address!!');
      return;
    } else {
      if (!this.cart?.length) {
        this.responseService.message('Add something to the cart first!!');
        return;
      }
      if (this.tokenService.isLoggedIn()) {
        this.generateOrder();
      } else {
        this.router.navigate(['/auth/login']);
      }
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
          console.log(res);
          this.isLoading = false;
          if (!res.error && res?.payload?.data) {
            this.responseService.message(
              'Order is created. Redirecting to billing page!',
              false
            );
            this.shoppingCartService
              .setShippingAddress(cartID, this.selection.id)
              .subscribe((data: any) => {});
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

  increment = (product: any) => {
    this.shoppingCartService.addProduct(product, 0);
  };

  decrement = (product: any, quantity: number) => {
    if (quantity !== 1) {
      this.shoppingCartService.decrementProduct(product);
    }
  };

  getSize = (productAttribute: ProductAttributeDto): string => {
    let size = '';
    if (!productAttribute) {
      return size;
    }
    for (const attribute of productAttribute.attributes) {
      if (attribute?.attributeGroup?.name?.toLowerCase() === 'size') {
        size = attribute.name;
        break;
      }
    }
    return size;
  };

  getColor = (productAttribute: ProductAttributeDto): string => {
    let color = '';
    if (!productAttribute) {
      return color;
    }
    for (const attribute of productAttribute.attributes) {
      if (attribute?.attributeGroup?.isColorGroup) {
        color = attribute.color;
        break;
      }
    }
    return color;
  };

  getPrice(product: any) {
    if (product && product.productAttribute) {
      return Number(product?.productAttribute?.price || 0);
    } else {
      return Number(product?.product?.price || 0);
    }
  }

  remove = (productID: string) => {
    this.shoppingCartService.removeProduct(productID);
  };

  toFixedNumber = (value: string | number): number =>
    Number(Number(value.toString()).toFixed(2));

  addNewShippingAddress() {
    this.loaderService.shippingAddress.subscribe((data) => {
      if (data) {
        const addressIndex = this.shippingAddresses.findIndex(
          (address) => address.id === data.id
        );
        if (addressIndex > -1) {
          this.shippingAddresses[addressIndex] = data;
        } else {
          this.shippingAddresses.push(data);
        }
      }
    });
  }

  deleteShippingAddress() {
    this.addressService
      .deleteShippingAddress(this.selection.id)
      .subscribe((res) => {
        if (!res.error) {
          this.responseService.fire(res);
          this.shippingAddresses = this.shippingAddresses.filter(
            (address) => address.id !== this.selection.id
          );
        }
      });
  }

  openDialog(status: boolean): void {
    this.addressService.setShippingAddress(this.selection, status);
    const dialogRef = this.dialog.open(ShippingDialogComponent, {
      width: '30rem',
      autoFocus: false,
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
