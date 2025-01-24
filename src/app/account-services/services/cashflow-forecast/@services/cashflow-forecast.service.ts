import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CashflowForecastService {
  selectedCurrency: string;

  forecastPeriod: string = '01-Jan-2022 - 30-Jun-2022';
  selectedForecastPeriodOption: string = 'Custom';

  cashflowTransactionsRowData: any[] = [
    {
      id: '01',
      source: ['Opening Balance'],
      valueDate: '1 Oct 2022',
      transactionNarration: '',
      beneficiaryPayers: '',
      withdrawals: '',
      deposited: '',
      balance: '747040.40',
      moreActions: false,
    },
    {
      id: '02',
      source: ['Actual Transactions'],
      valueDate: '',
      transactionNarration: '',
      beneficiaryPayers: '',
      withdrawals: '',
      deposited: '',
      balance: '',
      moreActions: false,
    },
    {
      id: '03',
      source: ['Actual Transactions', 'CBS'],
      valueDate: '05 OCT 2022',
      transactionNarration: '',
      beneficiaryPayers: '',
      withdrawals: '56600',
      deposited: '',
      balance: '27870',
      moreActions: false,
    },
    {
      id: '04',
      source: ['Actual Transactions', 'CBS '],
      valueDate: '08 OCT 2022',
      transactionNarration: '',
      beneficiaryPayers: '',
      withdrawals: '15400',
      deposited: '',
      balance: '12470',
      moreActions: false,
    },
    {
      id: '05',
      source: ['Actual Transactions', 'CBS  '],
      valueDate: '14 OCT 2022',
      transactionNarration: '',
      beneficiaryPayers: '',
      withdrawals: '',
      deposited: '12930.30',
      balance: '25370.20',
      moreActions: false,
    },
    {
      id: '06',
      source: ['Actual Transactions', 'CBS   '],
      valueDate: '05 OCT 2022',
      transactionNarration: '',
      beneficiaryPayers: '',
      withdrawals: '',
      deposited: '5666',
      balance: '30970.30',
      moreActions: false,
    },
    {
      id: '07',
      source: ['Manual Entry - One Time'],
      valueDate: '06 NOV 2022',
      transactionNarration: 'Invoice Finance EMI',
      beneficiaryPayers: 'Ms ABC',
      withdrawals: '1550.60',
      deposited: '',
      balance: '15920.40',
      moreActions: false,
    },
    {
      id: '08',
      source: ['Collection'],
      valueDate: '06 DEC 2022',
      transactionNarration: 'Cheque Deposit',
      beneficiaryPayers: 'John Miller',
      withdrawals: '',
      deposited: '9210',
      balance: '25130',
      moreActions: true,
    },
    {
      id: '09',
      source: ['Payment'],
      valueDate: '06 NOV 2022',
      transactionNarration: 'Invoice Finance EMI',
      beneficiaryPayers: 'Ms ABC',
      withdrawals: '1550.60',
      deposited: '',
      balance: '15920.40',
      moreActions: true,
    },
    {
      id: '10',
      source: ['Collection '],
      valueDate: '06 DEC 2022',
      transactionNarration: 'Cheque Deposit',
      beneficiaryPayers: 'John Miller',
      withdrawals: '',
      deposited: '9210',
      balance: '25130',
      moreActions: true,
    },
    {
      id: '11',
      source: ['Manual Entry - One Time '],
      valueDate: '06 NOV 2022',
      transactionNarration: 'Finance Repayment',
      beneficiaryPayers: '',
      withdrawals: '31000',
      deposited: '',
      balance: '-5930',
      moreActions: true,
    },
    {
      id: '12',
      source: ['Collection  '],
      valueDate: '12 DEC 2022',
      transactionNarration: 'Cheque Deposit',
      beneficiaryPayers: 'John Miller',
      withdrawals: '',
      deposited: '7800',
      balance: '1870.10',
      moreActions: true,
    },
  ];

  cashflowIgnoredTransactionsRowData: any[] = [
    {
      id: '07',
      source: ['Manual Entry - One Time'],
      valueDate: '06 NOV 2022',
      transactionNarration: 'Invoice Finance EMI',
      beneficiaryPayers: 'Ms ABC',
      withdrawals: '1550.60',
      deposited: '',
      balance: '15920.40',
      moreActions: false,
    },
    {
      id: '08',
      source: ['Collection'],
      valueDate: '06 DEC 2022',
      transactionNarration: 'Cheque Deposit',
      beneficiaryPayers: 'John Miller',
      withdrawals: '',
      deposited: '9210',
      balance: '25130',
      moreActions: true,
    },
    {
      id: '09',
      source: ['Payment'],
      valueDate: '06 NOV 2022',
      transactionNarration: 'Invoice Finance EMI',
      beneficiaryPayers: 'Ms ABC',
      withdrawals: '1550.60',
      deposited: '',
      balance: '15920.40',
      moreActions: true,
    },
    {
      id: '10',
      source: ['Collection '],
      valueDate: '06 DEC 2022',
      transactionNarration: 'Cheque Deposit',
      beneficiaryPayers: 'John Miller',
      withdrawals: '',
      deposited: '9210',
      balance: '25130',
      moreActions: true,
    },
    {
      id: '11',
      source: ['Manual Entry - One Time '],
      valueDate: '06 NOV 2022',
      transactionNarration: 'Finance Repayment',
      beneficiaryPayers: '',
      withdrawals: '31000',
      deposited: '',
      balance: '-5930',
      moreActions: true,
    },
    {
      id: '12',
      source: ['Collection  '],
      valueDate: '12 DEC 2022',
      transactionNarration: 'Cheque Deposit',
      beneficiaryPayers: 'John Miller',
      withdrawals: '',
      deposited: '7800',
      balance: '1870.10',
      moreActions: true,
    },
  ];

  accounts: any[] = [];

  selectedAccount: any;

  insights: any[] = [
    {
      icon: 'fa-level-up-alt',
      class: 'text-color-success',
      label: 'AE611234958209401190202- INR Account has High cashflow for OCT 2022',
    },

    {
      icon: 'fa-level-down-alt',
      class: 'text-color-danger',
      label: 'AE611234958209401190202- INR Account has Low cashflow for DEC 2022.',
    },
    {
      icon: 'fa-level-up-alt',
      class: 'text-color-success',
      label: 'AE611234958209401190202- INR Account has High cashflow for OCT 2022',
    },

    {
      icon: 'fa-level-down-alt',
      class: 'text-color-danger',
      label: 'AE611234958209401190202- INR Account has Low cashflow for DEC 2022.',
    },
  ];

  constructor() {}

  getAccountInfo(accountNumber: string) {
    return this.accounts.find((account: any) => account.accountNumber == accountNumber);
  }
}
