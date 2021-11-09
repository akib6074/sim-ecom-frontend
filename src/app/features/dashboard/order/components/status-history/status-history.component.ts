import { OrderDto } from './../../../../../shared/dto/order/order.dto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../order.service';
import { UsersService } from '../../../../../core/services/users.service';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { UserDto } from '../../../../../shared/dto/user/user.dto';

@Component({
  selector: 'app-status-history',
  templateUrl: './status-history.component.html',
  styleUrls: ['./status-history.component.scss'],
})
export class StatusHistoryComponent implements OnInit {
  displayedColumns: string[] = [
    'image',
    'productDescription',
    'unitPrice',
    'quantity',
    'subTotal',
    'button',
  ];
  dataSource: any[] = [];
  orderId: string;
  user: UserDto;
  order: OrderDto;
  totalPrice: number;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly orderService: OrderService,
    private readonly usersService: UsersService,
    private readonly token: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.orderId = params.get('orderId') as string;
      this.loadOrderDetails(this.orderId);
      this.loadUserAddress();
    });
  }

  loadOrderDetails(id: string) {
    this.orderService.findByID(id).subscribe((res) => {
      if (!res.error && res.payload?.data) {
        this.order = res?.payload?.data;
        console.log(this.order);
        this.dataSource = this.order.orderDetails;
        this.totalPrice = Number(
          this.order?.orderDetails
            ?.reduce(
              (acc: number, current: any) =>
                acc + Number(current.product.price) * current.quantity,
              0
            )
            .toFixed(2)
        );
        console.log(this.totalPrice);
      }
    });
  }

  loadUserAddress() {
    this.usersService
      .findProfileById(this.token.getUserId())
      .subscribe((res) => {
        if (!res.error && res.payload?.data) {
          this.user = res?.payload?.data;
        }
      });
  }
}
