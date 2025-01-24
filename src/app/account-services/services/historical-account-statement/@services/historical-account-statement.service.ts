import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class HistoricalAccountStatementService {
  historicalPeriod: string = '01-Jan-2022 - 30-Jun-2022';
  selectedHistoricalPeriodOption: string = 'Custom';
  private _searchFilters: any[] = [
    {
      name: 'type',
      type: 'String',
      value: 'Account No',
      displayName: 'Type',
    },
    {
      name: 'accountNo',
      type: 'String',
      value: '',
      displayName: 'Account No',
    },
    {
      name: 'iBan',
      type: 'String',
      value: '',
      displayName: 'IBAN',
    },
    {
      name: 'dateRange',
      type: 'String',
      value: '',
      displayName: 'Date',
    },
  ];

  searchFilters: any[] = [];
  selectedAccount: string = '';
  selectedAccountNumber: string = '';

  constructor() {}

  getResetFilters() {
    return cloneDeep(this._searchFilters);
  }
}
