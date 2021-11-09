import { UsersService } from './../../../../../core/services/users.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CouponService } from '../../coupon.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  constructor(
    private readonly couponService: CouponService,
    private readonly usersService: UsersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getAllUser();
  }

  allUsers: any[] = [];

  selectedUsers: any[] = [];

  getAllUser = () => {
    this.usersService.findAll().subscribe((res: any) => {
      this.allUsers = res?.payload?.data;
      console.log(this.allUsers);
    });
  };

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
