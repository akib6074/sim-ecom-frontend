import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopReviewDto } from './../../../../../../shared/dto/shop/shop-review.dto';
import { HomeService } from './../../../home.service';

@Component({
  selector: 'app-shop-review',
  templateUrl: './shop-review.component.html',
  styleUrls: ['./shop-review.component.scss'],
})
export class ShopReviewComponent implements OnInit {
  shopRating: number = 0;
  prevRating: number = 3;
  starCount: number = 5;
  shopReviews: ShopReviewDto[] = [];

  shop: any = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly homeService: HomeService
  ) {
    this.shop = this.route.snapshot.data?.shop;
  }

  ngOnInit() {
    this.getReviews();
  }

  onRatingChanged(rating: any) {
    this.shopRating = rating;
  }

  getReviews = () => {
    this.homeService.getShopReviews(this.shop.id).subscribe((res) => {
      this.shopReviews = res?.payload?.data.map((review: any) => {
        review.shopRating = Number(review.shopRating);
        console.log(typeof review.shopRating);
        return review;
      });
      console.log(this.shopReviews);
    });
  };

  reviewSubmitted(data: any) {
    console.log(data);
    this.shopReviews.push(data);
  }
}
