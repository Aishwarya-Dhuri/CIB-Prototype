import { Injectable } from '@angular/core';
import { BankGuarantee } from '../@models/bank-guarantee.model';
@Injectable({
  providedIn: 'root',
})
export class BankGuaranteeService {
  activeStepIndex = 0;

  _bankGuarantee = new BankGuarantee();

  bankGuarantee = null;

  resetBankGuarantee() {
    this.bankGuarantee = new BankGuarantee();
  }

  constructor() {
    this.resetBankGuarantee();
  }
}
