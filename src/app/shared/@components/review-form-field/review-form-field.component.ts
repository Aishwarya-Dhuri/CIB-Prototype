import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { first } from 'rxjs/operators';
import { CurrencyService } from '../../@services/currency.service';

@Component({
  selector: 'app-review-form-field',
  templateUrl: './review-form-field.component.html',
  styleUrls: ['./review-form-field.component.scss'],
})
export class ReviewFormFieldComponent implements OnInit {
  @Input('label') label!: string;
  @Input('value') value!: any;
  @Input('subValue') subValue?: string;
  @Input('labelToolTip') labelToolTip?: string;
  @Input('isDisplayInline') isDisplayInline?: boolean = false;
  @Input('type') type?: 'text' | 'baseCurrency' | 'file' = 'text';
  @Input('baseCurrency') baseCurrency?: string;

  @Output('onFileClick') onFileClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    if (this.type == 'baseCurrency' && !this.baseCurrency) {
      this.currencyService
        .getCurrencyName()
        .pipe(first())
        .subscribe((currency: string) => {
          this.baseCurrency = currency;
        });
    }
  }

  fileClicked() {
    this.onFileClick.emit();
  }
}
