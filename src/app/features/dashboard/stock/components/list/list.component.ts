import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import {
  Component,
  OnInit,
} from '@angular/core';
import {StockService} from '../../stock.service';
import {ImageType} from "../../../../../core/enum/image-type.enum";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  page = 1;
  limit = 20;
  products: any[] = [];
  imageType = ImageType.PRODUCT_SMALL;

  constructor(
    private readonly stockService: StockService,
    public readonly token: TokenStorageService
  ) {

  }

  ngOnInit(): void {
    this.stockService
      .pagination(this.page, this.limit)
      .subscribe((res) => {
        if (res?.page?.data) {
          this.products.push(...res?.page?.data);
          console.log(this.products);
        }
      })
  }

  showMore = () => {

  }

}
