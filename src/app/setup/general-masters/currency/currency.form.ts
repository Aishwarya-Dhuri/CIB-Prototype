import { Validators } from '@angular/forms';
import { Master } from 'src/app/shared/@forms/master.form';

export const Currency: { [key: string]: any } = {
  ...Master,
  currencyCode: ['101'],
  currencyDesc: ['', Validators.required],
  coreCurrencyCode: ['', Validators.required],
  currencySymbol: ['₿', Validators.required],
  currencyDecimal: ['2', [Validators.required, Validators.max(99)]],
  majorUnit: ['3', Validators.required],
  minorUnit: ['1', Validators.required],
};
