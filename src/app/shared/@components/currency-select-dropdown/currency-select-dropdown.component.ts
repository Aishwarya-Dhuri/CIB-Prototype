import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { _ } from 'ag-grid-community';
import { CurrencyService } from '../../@services/currency.service';

@Component({
  selector: 'app-currency-select-dropdown',
  templateUrl: './currency-select-dropdown.component.html',
  styleUrls: ['./currency-select-dropdown.component.scss'],
})
export class CurrencySelectDropdownComponent implements OnInit {
  @Input('selectStyleClass') selectStyleClass?: string = '';
  @Input('flagStyleClass') flagStyleClass?: string = '';
  @Input('showFlag') showFlag?: boolean = true;
  @Input('classes') classes?: string = '';
  @Input('selectedCurrency') currency: string;

  @Output() currencyChanged = new EventEmitter<any>();

  currencyList: any[] = [];

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.getCurrencyList().subscribe((currencyList: any[]) => {
      this.currencyList = currencyList;
    });
    if (!this.currency) {
      this.currencyService.getCurrency().subscribe((currency: any) => {
        if (currency) {
          this.currency = currency.displayName;
        }
      });
    }
  }

  currencyChange(currency: any) {
    const selectedCurrency = this.currencyList.find((c: any) => c.displayName === currency);
    if (selectedCurrency) {
      this.currencyChanged.emit(selectedCurrency);
      // this.currencyService.setCurrency(selectedCurrency);
    }
  }
}
