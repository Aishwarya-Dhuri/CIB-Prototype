import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppSetting, ExtraSetting } from '../../@models/app-setting';
import { AppSettingService } from '../../@services/app-setting.service';
import { HttpService } from '../../@services/http.service';
import { Dropdown } from 'primeng/dropdown';
import { Select } from '../../@models/select.model';

@Component({
  selector: 'aps-custom-select',
  templateUrl: './aps-custom-select.component.html',
  styleUrls: ['./aps-custom-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApsCustomSelectComponent),
      multi: true,
    },
  ],
})
export class ApsCustomSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  @ViewChild('dropdown') dropdown: Dropdown;

  @Input('readonly') readonly: boolean = false;
  @Input('showLabel') showLabel: boolean = true;
  @Input('disabled') isDisabled: boolean = false;
  @Input('backgroundStyle') backgroundStyle: string = 'normal'; // normal, primary

  @Input('icon') icon?: string;
  @Input('reqBody') reqBody?: any;
  @Input('dataUrl') dataUrl?: string;
  @Input('helpText') helpText?: string;
  @Input('showDelete') showDelete?: boolean;
  @Input('errorMessage') errorMessage?: string = 'This Field is Required';
  @Input('isLoadUrlData') isLoadUrlData?: boolean = true;

  @Input('id') id!: string;
  @Input('value') val!: any;
  @Input('name') name!: string;
  @Input('data') data!: Select[];
  @Input('label') label!: string;
  @Input('showLCValue') showLCValue!: string;
  @Input('required') required!: boolean;
  @Input('colorClass') colorClass!: string;

  @Output('focusout') focusout = new EventEmitter<Event>();
  @Output('change') change = new EventEmitter<any>();

  fromUISelection: boolean = false;
  loadingOptions: boolean = false;
  showOptions: boolean = false;

  class: string = 'select-control';
  displayName: string = '';
  direction: string = '';

  elementId!: string;
  style!: string;
  error!: any;

  onChange: any = (val: any) => { };
  onTouched: any = () => { };

  get value() {
    return this.val;
  }

  set value(val) {
    this.val = val;
    this.onChange(val);
    const d = this.data ? this.data.find((dt: Select) => dt.id === this.val) : '';
    this.displayName = d ? d.displayName : '';
    if (this.fromUISelection) {
      this.change.emit(d);
      this.fromUISelection = false;
    }
    this.onTouched();
    this.validate();
  }

  constructor(
    private httpService: HttpService,
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
    this.colorClass = this.colorClass ? this.colorClass : '';
    this.class = this.class + ' ' + this.colorClass;

    if (!this.data) {
      this.data = [];
      this.getUrlData();
    }

    if (!this.val || this.val === undefined) {
      this.val = '';
    } else {
      const d = this.data ? this.data.find((dt: Select) => dt.id === this.val) : '';
      this.displayName = d ? d.displayName : '';
    }

    this.elementId =
      (this.id ? this.id : this.name ? this.name : '' + new Date().getTime()) +
      (this.label ? (this.label ? this.label.replace(' ', '_') : '') : '');

    if (this.required !== false && this.required !== undefined) {
      this.required = true;
    }

    if (this.showLCValue) {
      this.renderer.setAttribute(this.el.nativeElement, 'title', this.showLCValue);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.val || this.val === undefined) {
      this.val = '';
      this.displayName = '';
    } else {
      const d = this.data ? this.data.find((dt: Select) => dt.id === this.val) : '';
      if (d) {
        this.displayName = d.displayName;
      } else {
        this.val = '';
        this.displayName = '';
      }
    }

    this.getUrlData();
  }

  toggleDropdown(event: any) {
    if (this.dropdown.disabled || this.dropdown.readonly || this.dropdown.isInputClick(event)) {
      return;
    }
    this.dropdown.onClick.emit(event);
    this.dropdown.accessibleViewChild.nativeElement.focus();
    if (this.dropdown.overlayVisible) {
      this.dropdown.documentClickListener = null;
      this.dropdown.hide();
    } else {
      this.dropdown.documentClickListener = () => { };
      this.dropdown.show();
    }

    this.dropdown.cd.detectChanges();
  }

  hideDropdown(event: any) {
    if (this.dropdown.disabled || this.dropdown.readonly || this.dropdown.isInputClick(event)) {
      return;
    }
    this.dropdown.onClick.emit(event);
    this.dropdown.accessibleViewChild.nativeElement.focus();
    this.dropdown.documentClickListener = null;
    this.dropdown.hide();
    this.dropdown.cd.detectChanges();
    this.focusout.emit(event);
  }

  onClickDropdown(event: any) {
    const selectElement = document.getElementById(this.elementId);

    setTimeout(() => {
      selectElement.focus();
    }, 0);
  }

  getUrlData() {
    if (this.isLoadUrlData && this.dataUrl) {
      this.loadingOptions = true;

      const data = { dataMap: this.reqBody ? this.reqBody : {} };

      this.httpService.httpPost(this.dataUrl, data).subscribe((res: any) => {
        this.data = res && res.dataList ? res.dataList : [];

        const d = this.data ? this.data.find((dt: Select) => dt.id === this.val) : '';
        if (d) {
          this.displayName = d.displayName;
        } else {
          this.val = '';
          this.displayName = '';
        }

        this.loadingOptions = false;
      });
    } else {
      this.data = this.data ? this.data : [];

      if (this.val) {
        const d = this.data ? this.data.find((dt: Select) => dt.id === this.val) : '';
        if (d) {
          this.displayName = d.displayName;
        } else {
          this.val = '';
          this.displayName = '';
        }
      }
    }
  }

  onOptionSelect(value: any) {
    this.fromUISelection = true;
    this.value = value;
    this.showOptions = false;
  }

  touched() {
    this.validate();
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

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
  }
}
