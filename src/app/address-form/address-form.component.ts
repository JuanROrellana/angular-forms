import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder, FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  Validators
} from '@angular/forms';
import {noop, Subscription} from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: AddressFormComponent
  }]
})
export class AddressFormComponent implements ControlValueAccessor, OnDestroy {

  constructor(private fb: FormBuilder) {
  }

  @Input()
  legend: string;
  onChangeSub: Subscription;

  form: FormGroup = this.fb.group({
    addressLine1: [null, [Validators.required]],
    addressLine2: [null, [Validators.required]],
    zipCode: [null, [Validators.required]],
    city: [null, [Validators.required]]
  });

  onTouched = () => {};

  // its used from the parent component to write new values on the child component
  writeValue(value: any): void {
    if (value) {
      this.form.setValue(value);
    }
  }

  // Use on the parent form to register the touched component
  // User interacted with the form
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  // If the control should be enable/disable
  setDisabledState(disabled: boolean) {
    if (disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  // When the form values changes report to the parent component
  registerOnChange(onChange: any): void {
    this.onChangeSub = this.form.valueChanges.subscribe(onChange);
  }

  ngOnDestroy(): void {
    this.onChangeSub.unsubscribe();
  }
}



