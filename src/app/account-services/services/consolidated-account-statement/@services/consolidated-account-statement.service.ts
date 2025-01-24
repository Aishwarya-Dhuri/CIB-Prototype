import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ConsolidatedAccountStatementService {
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
      name: 'type',
      type: 'String',
      value: '',
      displayName: 'Corporate Code',
    },
    {
      name: 'iBan',
      type: 'String',
      value: '',
      displayName: 'Corporate Name',
    },
    {
      name: 'dateRange',
      type: 'String',
      value: '',
      displayName: 'Year',
    },

    {
      name: 'dateRange',
      type: 'String',
      value: '',
      displayName: 'Month',
    },
  ];

  searchFilters: any[] = [];
  selectedAccount: string = '';
  selectedAccountNumber: string = '';

  constructor() { }

  getResetFilters() {
    return cloneDeep(this._searchFilters);
  }
}
