import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

class CEFTS {
  constructor(
    public accid = new Date().getTime(),
    public accountNumber = '',
    public beneficiaryBank = '',
    public beneficiaryBankBranch = '',
    public address1 = '',
    public address2 = '',
    public address3 = '',
    public effectiveFrom = '',
    public effectiveTill = '',
    public defaultAccount = false,
    public beneficiaryAdviceDispatchMode = [],
    public isFavourite = 'N',
  ) {}
}

@Component({
  selector: 'app-cefts',
  templateUrl: './cefts.component.html',
  styleUrls: ['./cefts.component.scss'],
})
export class CeftsComponent implements OnInit {
  @Output() addAccount = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input('account') account: any;

  formData: CEFTS;

  isShowBeforeSubmitModel = false;

  paymentMethods = [];

  constructor() {}

  ngOnInit(): void {
    if (this.account) {
      const account: any = {
        ...this.account,
      };
      account.beneficiaryAdviceDispatchMode =
        this.account.beneficiaryAdviceDispatchMode.split(', ');

      this.formData = account;
    } else {
      this.formData = new CEFTS();
    }
  }

  add() {
    this.isShowBeforeSubmitModel = false;

    const account: any = {
      ...this.formData,
      status: this.account ? 'Update' : 'Create',
    };
    account.beneficiaryAdviceDispatchMode = this.formData.beneficiaryAdviceDispatchMode.join(', ');

    this.addAccount.emit({
      account: account,
      paymentMethods: this.paymentMethods,
    });
  }
}
