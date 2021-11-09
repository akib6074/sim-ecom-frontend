import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../configuration.service';
import { Router } from '@angular/router';
import { ResponseService } from '../../../../../shared/services/response.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  configurationForm!: FormGroup;
  htmlContent = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly snackBarService: ResponseService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.configurationForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required]),
    });
  }

  submit = () => {
    const configurationData = this.configurationForm.value;
    this.configurationService
      .createConfiguration(configurationData)
      .subscribe((res) => {
        if (this.snackBarService.fire(res)) {
          this.configurationForm.reset();
          this.router.navigate(['/dashboard/configuration/list']);
        }
      });
  };
}
