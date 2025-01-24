import { Injectable } from '@angular/core';
import { OutwardTelegraphicTransfer } from '../@models/outward-telegraphic-center.model';

@Injectable({
  providedIn: 'root',
})
export class OutwardTelegraphicTransferService {
  activeStepIndex = 0;

  _letterOfCredit = new OutwardTelegraphicTransfer();

  letterOfCredit = null;

  resetLetterOfCredit() {
    this.letterOfCredit = new OutwardTelegraphicTransfer();
  }

  constructor() {
    this.resetLetterOfCredit();
  }
}
