import { Injectable } from '@angular/core';
import { BillPresentment } from '../@models/bill-presentment.model';
@Injectable({
  providedIn: 'root',
})
export class BillPresentmentService {
  activeStepIndex = 0;
  _billPresentment = new BillPresentment();
  billPresentment = null;

  resetBillPresentment() {
    this.billPresentment = new BillPresentment();
  }

  constructor() {
    this.resetBillPresentment();
  }
}
