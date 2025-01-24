import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WealthManagementService {
  private wealthManagementData: any;

  selectedCurrencyCode: string;
  investmentData: any;

  constructor() {}

  getWealthManagementData() {
    return this.wealthManagementData;
  }

  setWealthManagementData(wealthManagementData: any) {
    this.wealthManagementData = wealthManagementData;
  }
}
