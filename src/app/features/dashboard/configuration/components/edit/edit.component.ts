import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../../configuration.service';
import { ResponseService } from '../../../../../shared/services/response.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  editConfigurationForm!: FormGroup;
  id = '';

  constructor(
    private route: ActivatedRoute,
    private readonly configurationService: ConfigurationService,
    private readonly responseService: ResponseService
  ) {}

  ngOnInit(): void {
    console.log();
    this.initForm(this.route.snapshot.data?.editConfiguration);
  }

  initForm(editConfiguration: any) {
    this.id = editConfiguration.id;
    this.editConfigurationForm = new FormGroup({
      name: new FormControl(editConfiguration.name, [Validators.required]),
      value: new FormControl(editConfiguration.value, [Validators.required]),
    });
  }

  update = () => {
    if (this.editConfigurationForm.valid) {
      this.configurationService
        .update(this.id, this.editConfigurationForm.value)
        .subscribe((res) => {});
    } else {
      this.responseService.message('Please fill all the fields!!');
    }
  };
}
