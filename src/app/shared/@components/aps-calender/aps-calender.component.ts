import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Calendar } from 'primeng/calendar';
import { AppSetting, ExtraSetting } from '../../@models/app-setting';
import { AppSettingService } from '../../@services/app-setting.service';

@Component({
  selector: 'app-aps-calender',
  templateUrl: './aps-calender.component.html',
  styleUrls: ['./aps-calender.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApsCalenderComponent),
      multi: true,
    },
  ],
})
export class ApsCalenderComponent implements OnInit, OnChanges {
  direction: string = '';

  @HostBinding('attr.style')
  value?: string = '';

  @ViewChild('calender') calender: Calendar;

  showCalender(event: any) {
    if (!this.isDisabled && !this.readonly) {
      this.calender.toggle();
      event?.stopPropagation();
    }
  }
  /*https://primefaces.org/primeng/showcase/#/calendar*/
  //required
  @Input() id!: string;
  @Input() name!: string;
  @Input() label!: string;
  @Input() showLCValue!: string;

  @Input('style') style?: string = 'style1';
  @Input('isStyleChange') isStyleChange?: boolean = true;
  @Input('showTime') showTime?: boolean = false;
  @Input('hourFormat') hourFormat?: string = '24';
  @Input('showIcon') showIcon?: boolean = true;
  @Input('dateFormat') dateFormat?: string = 'dd-M-yy';
  @Input('selectOtherMonths') selectOtherMonths?: boolean = true;
  @Input('monthNavigator') monthNavigator?: boolean = false;
  @Input('yearNavigator') yearNavigator?: boolean = false;
  @Input('yearRange') yearRange?: string = '2000:2030';
  @Input('timeOnly') timeOnly?: boolean = false;
  @Input('showOtherMonths') showOtherMonths?: boolean = false;
  @Input('dataType') dataType?: string = 'string';
  @Input('view') view?: string = 'date';
  @Input('defaultDate') defaultDate?: any = null;
  @Input('minDate') minDate?: any = null;
  @Input('maxDate') maxDate?: any = null;
  // @Input() inputId?: string = '';
  @Input() numberOfMonths?: number = 1;
  @Input() selectionMode?: string = 'single';
  @Input() hideOnDateTimeSelect?: boolean = true;

  //optional

  @Input() helpText?: string;
  @Input() errorMessage?: string = 'This Field is Required';

  @Input() showLabel: boolean = true;
  @Input() showClear: boolean = false;
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() error: boolean = false;

  @Output() focus = new EventEmitter<Event>();
  @Output() focusout = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<Event>();
  @Output() onRightIcon = new EventEmitter<void>();
  @Output() change = new EventEmitter<any>();

  private parseError: boolean;

  isDisabled = false;

  onChange: any = (value: string) => { };

  onTouched: any = () => { };

  constructor(
    private appSettingService: AppSettingService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.style = appSetting.formControlStyle;
    });
    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      this.direction = extraSetting.direction;
    });
  }

  ngOnInit(): void {
    if (this.isStyleChange) {
      //check
    }
    if (this.showLCValue) {
      this.renderer.setAttribute(this.el.nativeElement, 'title', this.showLCValue);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.minDate) {
      this.minDate = new Date(this.minDate);
    }
    if (this.maxDate) {
      this.maxDate = new Date(this.maxDate);
    }
  }

  onRightIconClick() {
    this.onRightIcon.emit();
  }

  touched() {
    this.onTouched();
    this.validate();
  }

  changed(value: any): void {
    this.onChange(value);

    this.change.emit(value);

    this.value = value;
    this.validate();

    this.onFocusOut();
  }

  onFocus(event: Event): void {
    this.focus.emit(event);
  }

  onBlur(event: Event): void {
    this.blur.emit(event);
  }

  onFocusOut(event?: Event): void {
    this.focusout.emit(event);
  }

  validate() {
    if (this.required) {
      if (!this.value) {
        this.error = true;
        return;
      }

      this.error = false;
    }
  }

  clearInput(): void {
    this.value = '';
    this.onChange(this.value);
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
    this.isDisabled = isDisabled;
  }
}
