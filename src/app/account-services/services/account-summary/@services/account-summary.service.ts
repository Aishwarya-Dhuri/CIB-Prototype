import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccountSummaryService {
  private summary: any;

  private accounts: any[] = [];
  private selectedAccount: any;

  private corporate: any;
  private country: any;

  private currencies: any[] = [];
  private selectedCurrency: any;

  name: string = 'Toyota Motors';
  image: string = 'corporate-L.png';

  getSelectedAccount() {
    return this.selectedAccount;
  }

  setSelectedAccount(selectedAccount: any) {
    this.selectedAccount = selectedAccount;
  }

  getAccounts() {
    return this.accounts;
  }

  setAccounts(accounts: any[]) {
    this.accounts = accounts;
  }

  getSelectedCurrency() {
    return this.selectedCurrency;
  }

  setSelectedCurrency(selectedCurrency: any) {
    this.selectedCurrency = selectedCurrency;
  }

  getCurrencies() {
    return this.currencies;
  }

  setCurrencies(currencies: any) {
    this.currencies = currencies;
  }

  getSummary() {
    return this.summary;
  }
  setSummary(summary: any) {
    this.summary = summary;
  }

  setCorporate(corporate: any) {
    this.corporate = corporate;
  }

  getCorporate() {
    return this.corporate;
  }

  setCountry(country: any) {
    this.country = country;
  }

  getCountry() {
    return this.country;
  }

  constructor() {}
}
