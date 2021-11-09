import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'src/app/shared/dto/reponse/response.dto';
import {FilterOption} from "../../../core/dto/filter-option.dto";
import {ProductDto} from "../../../shared/dto/product/product.dto";
import {ProductAttributeDto} from 'src/app/shared/dto/product/product-attribute.dto';

@Injectable()
export class ProductService {

  productUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG);
  productSearchUrl =
    this.apiConfigService.getUrl(MicroserviceURL.SEARCH) + 'products';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {
  }

  getByCategoryPagination(
    catID: string,
    page: number,
    limit: number,
    filter: FilterOption,
  ): Observable<any> {
    return this._httpClient.get(
      `${
      this.productUrl + 'products'
        }/find/category?id=${catID}&page=${page}&limit=${limit}&price=${filter.price}&rating=${filter.rating}&algorithm=${filter.algorithm}`
    );
  }

  getProductReview = (id: string): Observable<ResponseDto> => {
    return this._httpClient.get(
      `${this.productUrl + 'product-review'}/product/${id}`
    ) as Observable<ResponseDto>;
  };

  getByProductLocationPagination(
    page: number,
    limit: number,
    lat: number,
    lng: number,
  ): Observable<any> {
    return this._httpClient.get(
      `${this.productSearchUrl}/search/location?p=${page}&l=${limit}&lat=${lat}&lng=${lng}`
    );
  }

  getProductsBySearchKeyPagination(
    page: number,
    limit: number,
    query: string,
  ): Observable<any> {
    return this._httpClient.get(
      `${this.productSearchUrl}/search?q=${query}&p=${page}&l=${limit}`
    );
  }


  isProductAttributeMatched(filter: any, matchingNames: string[], productAttribute: ProductAttributeDto): boolean{
    let isMatched = true;
    for (let key of matchingNames) {
      let matched = false;
      for (let attribute of productAttribute.attributes) {
        if (attribute?.attributeGroup?.isColorGroup) {
          if (filter[key] && filter[key] !== attribute.color) {
            break;
          }
        } else {
          if (filter[key] && filter[key] !== attribute.name) {
            break;
          }
        }

        if (key === attribute?.attributeGroup?.name) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        return false;
      }
    }
    return isMatched;
  }

  findAttributeNames(filter: any, attributeKeyNames: string[], index: number, product: ProductDto): any[] {
    let matchedAttributes: any[] = [];

    let matchingNames = [];
    let key = null;
    let i = 0;

    for(let attributeName of attributeKeyNames) {
      matchingNames.push(attributeName);
      if (i === index) {
        key = attributeName;
        break;
      }
      i++;
    }

    for(let productAttribute of product?.productAttributes) {
      if (productAttribute.quantity <= 0) {
        continue;
      }

      if (!this.isProductAttributeMatched(filter, matchingNames, productAttribute)) {
        continue;
      }

      for (let attribute of productAttribute.attributes) {
        if (key === attribute?.attributeGroup?.name) {
          if (attribute?.attributeGroup?.isColorGroup) {
            matchedAttributes.push({
              name:attribute.color,
              id: productAttribute.id,
              key: key,
            });
          } else {
            matchedAttributes.push({
              name:attribute.name,
              id: productAttribute.id,
              key: key,
            });
          }
        }
      }
    }
    return matchedAttributes;
  }


  getMaxAttributeKeyNames(product: ProductDto): string[] {
    let maxAttributeNames = new Set<string>();
    if (product?.productAttributes?.length) {
      for (let productAttribute of product.productAttributes) {
        if (productAttribute.quantity <= 0) {
          continue;
        }
        const attributeNames = new Set<string>();
        for (let attribute of productAttribute?.attributes) {
          if (attribute?.attributeGroup?.name) {
            attributeNames.add(attribute?.attributeGroup?.name);
          }
        }
        if (attributeNames.size > maxAttributeNames.size){
          maxAttributeNames = attributeNames;
        }
      }
    }
    return Array.from(maxAttributeNames.values());
  }
}
