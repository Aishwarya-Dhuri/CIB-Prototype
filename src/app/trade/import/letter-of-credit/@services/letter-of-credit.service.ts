import { Injectable } from '@angular/core';
import { LetterOfCredit } from '../@models/letter-of-credit.model';

@Injectable({
  providedIn: 'root',
})
export class LetterOfCreditService {
  activeStepIndex = 0;

  _letterOfCredit = new LetterOfCredit();

  letterOfCredit = null;

  resetLetterOfCredit() {
    this.letterOfCredit = new LetterOfCredit();
  }

  constructor() {
    this.resetLetterOfCredit();
  }
}
