import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductService {

  getProductsData() {
    return [
      {
        id: '1000',
        amount: 'INR 30,00,00,000',
        totalValue: 'Total Value',
        count: '109',
        totalNo: 'Total Number',
        cashflowDetails: 'Cash Pickup Summary'
      },
      {
        id: '1001',
        amount: 'INR 45,00,00,000',
        totalValue: 'Total Value',
        count: '98',
        totalNo: 'Total Number',
        cashflowDetails: 'Cheque Pickup Summary'
      },
      {
        id: '1002',
        amount: 'INR 28,00,00,000',
        totalValue: 'Total Value',
        count: '110',
        totalNo: 'Total Number',
        cashflowDetails: 'Cash Delivery'
      }
    ];
  }

  getProductsSmall() {
    return Promise.resolve(this.getProductsData().slice(0, 10));
  }

  constructor() { }
}
