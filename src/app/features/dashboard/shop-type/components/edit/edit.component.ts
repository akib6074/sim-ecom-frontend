import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {ResponseService} from '../../../../../shared/services/response.service';
import {ShopTypeService} from '../../shop-type.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  editShopTypeForm!: FormGroup;
  isLoading = false;
  btnLabel = 'Update';
  id = '';
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly shopTypeService: ShopTypeService,
    private readonly snackBarService: ResponseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.formInit(this.route.snapshot.data?.shopType);
  }

  formInit = (shopType: any) => {
    this.id = shopType.id;
    this.editShopTypeForm = new FormGroup({
      name: new FormControl(shopType.name, Validators.required),
    });
  };

  save = () => {
    if (this.editShopTypeForm.valid) {
      this.saveData();
    }
  };

  saveData = () => {
    this.isLoading = true;
    this.shopTypeService
      .update(this.id, this.editShopTypeForm.value)
      .subscribe((response: any) => {
        this.isLoading = false;
        if (this.snackBarService.fire(response)) {
          this.editShopTypeForm.reset();
          this.router.navigate(['/dashboard/shop-type']);
        } else {
          this.btnLabel = 'Try Again!';
        }
      });
  };

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
