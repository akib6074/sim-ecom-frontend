import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { LoaderService } from '../../../../../../app/core/services/loader.service';
import { UserProfileService } from '../../../../../../app/features/dashboard/user/components/user-profile/userprofile.service';
import { ResponseService } from '../../../../../../app/shared/services/response.service';
import { MicroserviceURL } from '../../../../../core/enum/microservices.enum';
import { ApiConfigService } from '../../../../../core/services/api-config.service';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { CartDto } from '../../../../../shared/dto/cart/cart.dto';
import { OrderDto } from '../../../../../shared/dto/order/order.dto';
import { ShoppingCartService } from '../../../../../shared/services/shopping-cart.service';
import { AddressService } from '../../address.service';
import { OrderService } from '../../order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  orderId: '';
  cart: CartDto;
  order: OrderDto | any;
  userId: string;
  index: number;
  unit = ['Item', 'Items'];

  calculatedCart = {
    items: 0,
    totalAmount: 0,
    discount: 0,
    additionalShippingCharge: 0,
    vat: 0,
    shippingCharge: 0,
    grandTotal: 0,
  };
  isActive: any;
  coupon = '';
  selectedPaymentMethod = 'Online Payment';
  paymentMethods: string[] = ['Cash On Delivery', 'Online Payment'];
  paymentUrl = this.apiConfigService.getUrl(MicroserviceURL.PAYMENT);

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly route: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    private readonly user: UserProfileService,
    public dialog: MatDialog,
    private readonly orderService: OrderService,
    private readonly addressService: AddressService,
    private readonly loaderService: LoaderService,
    private readonly responseService: ResponseService
  ) {
    this.shoppingCartService.coupon$.subscribe((coupon) => {
      this.coupon = coupon;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.orderId = data.id;
    });
    this.order = this.route.snapshot.data?.order;
    this.cart = this.order.cart;
    this.calculatedCart = this.shoppingCartService.calculateCart(
      this.cart.cartDetails
    );
    if (this.calculatedCart.items <= 1) {
      this.index = 0;
    } else {
      this.index = 1;
    }
    new Promise((resolve) => {
      this.initSslCommerze();
      resolve(true);
    })
      .then(() => {
        this.shoppingCartService.removePlacedOrder();
      })
      .catch(() => {});
  }

  initSslCommerze = () => {
    const sslBtn: any = document.getElementById('sslczPayBtn');
    sslBtn?.setAttribute('token', this.tokenStorageService.getToken());
    sslBtn?.setAttribute('order', this.order.transMaster.id);
    sslBtn?.setAttribute('postdata', {});
    sslBtn?.setAttribute('endpoint', this.paymentUrl + 'ssl-commerze/prepare');
    const script: any = document.createElement('script');
    const tag = document.getElementsByTagName('script')[0];
    script.src =
      this.apiConfigService.getPaymentMerchantApi() +
      Math.random().toString(36).substring(7);
    tag.parentNode?.insertBefore(script, tag);
  };

  changeStatus(status: number) {
    const statusDto = { status };
    this.orderService
      .changeStatusByID(this.orderId, statusDto)
      .subscribe((res) => {
        console.log(status);
        console.log(res);
      });
  }
}
