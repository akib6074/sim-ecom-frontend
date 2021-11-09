import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {ResponseService} from '../../../../../shared/services/response.service';
import {ShopTypeService} from '../../shop-type.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit, OnDestroy {
  addShopTypeForm!: FormGroup;
  isLoading = false;
  btnLabel = 'Save';
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly shopTypeService: ShopTypeService,
    private readonly snackBarService: ResponseService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.formInit();
  }

  formInit = () => {
    this.addShopTypeForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  };

  save = () => {
    if (this.addShopTypeForm.valid) {
      this.saveData();
    }
  };

  saveData = () => {
    this.isLoading = true;
    this.shopTypeService
      .create(this.addShopTypeForm.value)
      .subscribe((response: any) => {
        this.isLoading = false;
        if (this.snackBarService.fire(response)) {
          this.addShopTypeForm.reset();
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
