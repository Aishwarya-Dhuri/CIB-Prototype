import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BillAcceptanceService {
  billId: string;
  billIds: any[];

  constructor() {}
}
