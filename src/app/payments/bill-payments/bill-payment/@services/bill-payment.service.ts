import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BillPaymentService {
  billData: any[] = [];

  activeBiller: any;

  constructor() {}
}
