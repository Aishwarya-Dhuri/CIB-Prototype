import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Event } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AppSettingService } from '../../@services/app-setting.service';
import { FormInputFieldComponent } from '../form-input-field/form-input-field.component';

@Component({
  selector: 'app-range-input-field',
  templateUrl: './range-input-field.component.html',
  styleUrls: ['./range-input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeInputFieldComponent),
      multi: true,
    },
  ],
})
export class RangeInputFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
  @ViewChild('rangeField') rangeField: FormInputFieldComponent;
  @ViewChild('rangeFilter') rangeFilter: OverlayPanel;

  @Input('value') value?: string = '';
  fromValue: string = '';
  toValue: string = '';

  //required
  @Input() id!: string;
  @Input() name!: string;
  @Input() label!: string;

  //optional
  @Input('inputType') inputType?: 'normal' | 'numeric' | 'cardNumber' | 'currencyFormatNotZero' =
    'normal';
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() icon?: string;
  @Input() helpText?: string;
  @Input() showClear: boolean = false;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() customErrorMessage: string = '';

  @Output() focus = new EventEmitter<Event>();
  @Output() focusout = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<Event>();

  onChange: any = (value: string) => {};

  onTouched: any = () => {};

  constructor(private appSettingService: AppSettingService) {}

  ngOnInit(): void {
    if (!['normal', 'numeric', 'currencyFormatNotZero', 'cardNumber'].includes(this.inputType)) {
      this.inputType = 'normal';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.value) {
      const values = this.value.split('-');
      this.fromValue = values[0] ? values[0].trim() : '';
      this.toValue = values[1] ? values[1].trim() : '';
    }
  }

  onApply(event: Event) {
    this.value = this.fromValue + ' - ' + this.toValue;
    this.onCancel(event);
  }

  onClear(event: Event) {
    this.value = '';
    this.fromValue = '';
    this.toValue = '';
  }

  onCancel(event: Event) {
    if (this.rangeFilter) {
      this.rangeFilter.hide();
    }
  }

  changed(event: Event | any): void {
    if (this.rangeField) {
      this.rangeField.changed(event);
    }

    const value: string = (<HTMLInputElement>event.target).value;

    this.onChange(value);

    this.value = value;
  }

  onFocus(event: Event): void {
    this.rangeFilter.toggle(event);
    this.focus.emit(event);
  }

  onFocusOut(event: Event): void {
    this.focusout.emit(event);
  }

  onBlur(event: Event): void {
    this.blur.emit(event);
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
