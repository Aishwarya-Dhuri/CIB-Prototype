import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class AccountStatementService {
  accountPeriod: string = '';
  selectedAccountPeriodOption: string = '';
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
      name: 'statementPeriod',
      type: 'String',
      value: 'Mini Statement',
      displayName: 'Statement Period',
    },
    {
      name: 'dateRange',
      type: 'String',
      value: '',
      displayName: 'Date',
    },
    {
      name: 'transactionType',
      type: 'String',
      value: 'All',
      displayName: 'Transaction Type',
    },
    {
      name: 'transactionAmountFrom',
      type: 'Amount',
      value: '',
      displayName: 'Transaction Amount Form',
    },
    {
      name: 'transactionAmountTo',
      type: 'Amount',
      value: '',
      displayName: 'Transaction Amount To',
    },
    {
      name: 'referenceNumber',
      type: 'String',
      value: '',
      displayName: 'Reference Number',
    },
  ];

  searchFilters: any[] = this._searchFilters;

  selectedAccount: string = '';
  selectedAccountNumber: string = '';

  constructor() {}

  getResetFilters() {
    return cloneDeep(this._searchFilters);
  }
}
