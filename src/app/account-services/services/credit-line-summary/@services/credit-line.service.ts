import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreditLineService {
  private corporateList: any[] = [];
  private productList: any[] = [];
  private selectedCorporate: any = '';
  private selectedProduct: any = '';
  private creditLineCurrency: BehaviorSubject<string> = new BehaviorSubject<string>('');

  setCreditLineCurrency(creditLineCurrency: string) {
    this.creditLineCurrency.next(creditLineCurrency);
  }

  getCreditLineCurrency() {
    return this.creditLineCurrency;
  }

  getCorporateList() {
    return this.corporateList;
  }

  setCorporateList(corporateList: any[]) {
    this.corporateList = corporateList;
  }

  getSelectedCorporate() {
    return this.selectedCorporate;
  }

  setSelectedCorporate(corporate: any) {
    this.selectedCorporate = corporate;
  }

  getProductList() {
    return this.productList;
  }

  setProductList(productList: any[]) {
    this.productList = productList;
  }

  getSelectedProduct() {
    return this.selectedProduct;
  }

  setSelectedProduct(product: any) {
    this.selectedProduct = product;
  }

  constructor() {}
}
