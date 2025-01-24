import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BillPaymentAndApplyFinanceService {
  billId: string;

  filters: any[] = [];

  constructor() {}
}
