import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageType } from '../../../../../../app/core/enum/image-type.enum';

@Component({
  selector: 'app-shop-profile-top',
  templateUrl: './shop-profile-top.component.html',
  styleUrls: ['./shop-profile-top.component.scss'],
})
export class ShopProfileTopComponent implements OnInit {
  shop: any = {};
  coverImageType = ImageType.SHOP_COVER;
  profileImageType = ImageType.SHOP_PROFILE_SMALL;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.shop = this.route.snapshot.data?.shop;
  }

  catchProductFilter = (e: any): void => {
    console.log(e);
  };

  seeGoogleMap = (): void => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${this.shop.geoLocation.x}, ${this.shop.geoLocation.y}`;
    window.open(`${mapUrl}`, '_blank');
  };
}
