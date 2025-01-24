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
import { AutoComplete } from 'primeng/autocomplete';
import { AppSetting, ExtraSetting } from '../../@models/app-setting';
import { AppSettingService } from '../../@services/app-setting.service';
import { HttpService } from '../../@services/http.service';

@Component({
  selector: 'aps-autocomplete',
  templateUrl: './aps-autocomplete.component.html',
  styleUrls: ['./aps-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApsAutocompleteComponent),
      multi: true,
    },
  ],
})
export class ApsAutocompleteComponent implements OnInit, OnChanges, ControlValueAccessor {
  @ViewChild('autoComplete') autoComplete: AutoComplete;

  loadingOptions: boolean = false;
  isShowSearchModal: boolean = false;

  direction: string = '';
  @Input('value') val: any;

  elementId: string;
  displayName: string = '';
  @Input('searchParameter') searchParameter?: string = 'id';

  @Input('disabled') isDisabled: boolean = false;
  @Input('forceSelection') forceSelection: boolean = false;
  @Input() readonly: boolean = false;

  class: string = 'select-control';
  @Input() colorClass: string;

  error: any;

  style: string;

  @Input() backgroundStyle: string = 'normal'; // normal, primary

  @Input() showLabel: boolean = true;
  @Input() id!: string;
  @Input() name!: string;
  @Input() label!: string;

  @Input() colDefUrl!: string;

  @Input() data!: any[];

  @Input() required: boolean;
  @Input() showDelete?: boolean;
  @Input() helpText?: string;
  @Input() errorMessage?: string = 'This Field is Required';
  @Input() icon?: string;

  @Input() dataUrl?: string;
  @Input() reqBody?: any;
  @Input() isLoadUrlData?: boolean = true;

  @Output() change = new EventEmitter<any>();
  @Output() focusout = new EventEmitter<Event>();

  filteredData: any[] = [];

  onChange: any = (val: any) => {};

  onTouched: any = () => {};

  showOptions: boolean = false;
  fromUISelection: boolean = false;
  get value() {
    return this.val;
  }

  set value(val) {
    this.val = val;
    this.onChange(val);
    const d = this.data ? this.data.find((dt: any) => dt.id === this.val) : '';
    this.displayName = d ? d[this.searchParameter] : '';
    if (this.fromUISelection) {
      this.change.emit(d);
      this.fromUISelection = false;
    }
    this.onTouched();
    this.validate();
  }

  constructor(private httpService: HttpService, private appSettingService: AppSettingService) {
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
      const d = this.data ? this.data.find((dt: any) => dt.id === this.val) : '';
      this.displayName = d ? d[this.searchParameter] : '';
    }

    this.elementId =
      (this.id ? this.id : this.name ? this.name : '' + new Date().getTime()) +
      (this.label ? (this.label ? this.label.replace(' ', '_') : '') : '');

    if (this.required !== false && this.required !== undefined) {
      this.required = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.val || this.val === undefined) {
      this.val = '';
      this.displayName = '';
    } else {
      const d = this.data ? this.data.find((dt: any) => dt.id === this.val) : '';
      if (d) {
        this.displayName = d[this.searchParameter];
      } else {
        this.val = '';
        this.displayName = '';
      }
    }

    this.getUrlData();
  }

  filterData(event: any) {
    let filtered: any[] = [];
    for (let i = 0; i < this.data.length; i++) {
      let data = this.data[i];
      if (data[this.searchParameter].toLowerCase().indexOf(this.displayName.toLowerCase()) == 0) {
        filtered.push(data);
      }
    }

    this.filteredData = filtered;
    this.autoComplete.loading = true;
    this.autoComplete.suggestions = filtered;
  }

  toggleAutoComplete(event: any) {
    this.autoComplete.overlayVisible = !this.autoComplete.overlayVisible;
  }

  showAutoComplete(event: any) {
    this.autoComplete.overlayVisible = true;
  }

  hideAutoComplete(event: any) {
    this.autoComplete.overlayVisible = false;
  }

  onClickAutoComplete(event: any) {
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

        const d = this.data ? this.data.find((dt: any) => dt.id === this.val) : '';
        if (d) {
          this.displayName = d[this.searchParameter];
        } else {
          this.val = '';
          this.displayName = '';
        }

        this.loadingOptions = false;
      });
    }
  }

  onOptionSelect(value: any) {
    this.fromUISelection = true;
    this.value = value.id;
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
