import {Component, Input} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {catchError, finalize} from 'rxjs/operators';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {noop, of} from 'rxjs';


@Component({
  selector: 'file-upload',
  templateUrl: 'file-upload.component.html',
  styleUrls: ['file-upload.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: FileUploadComponent
  },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FileUploadComponent
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor, Validator {

  @Input()
  requiredFileType: string;

  fileName = '';
  disabled = false;
  fileUploadError = false;
  fileUploadSuccess = false;
  uploadProgress: number;
  onChange = (fileName: string) => {};
  onTouch = () => {};
  onValidatorChange = () => {};

  constructor(private http: HttpClient) {
  }

  onClick(fileUpload: HTMLInputElement) {
    this.onTouch();
    fileUpload.click();
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('thumbnail', file);
      this.http.post('/api/thumbnail-upload', formData, {
        reportProgress: true,
        observe: 'events'
      })
        .pipe(
          catchError(error => {
            this.fileUploadError = true;
            return of(error);
          }),
          finalize(() => {
            this.uploadProgress = null;
          })
          // tslint:disable-next-line:no-shadowed-variable
      ).subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        } else if (event.type == HttpEventType.Response) {
          this.fileUploadSuccess = true;
          this.onChange(this.fileName);
          // Report the new validation state
          this.onValidatorChange();
        }
      });
    }
  }

  // Set the value from parent Form
  writeValue(value: any): void {
    this.fileName = value;
  }

  // Register the value to the parent form
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // The user touch the component
  // Just hit the open button
  registerOnTouched(onTouch: any): void {
    this.onTouch = onTouch;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  registerOnValidatorChange(onValidatorChange: () => void) {
    this.onValidatorChange = onValidatorChange;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    // No errors
    if (this.fileUploadSuccess) {
      return null;
    }

    let errors: any = {
      requiredFileType: this.requiredFileType
    };

    if (this.fileUploadError) {
      errors.uploadFailed = true;
    }

    return errors;
  }
}
