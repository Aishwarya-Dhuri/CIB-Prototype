import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

class RTGS {
  constructor(
    public accid = new Date().getTime(),
    public accountNumber = '',
    public bicCode = '',
    public bankSortCode = '',
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
  selector: 'app-rtgs',
  templateUrl: './rtgs.component.html',
  styleUrls: ['./rtgs.component.scss'],
})
export class RtgsComponent implements OnInit {
  @Output() addAccount = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input('account') account: any;
  formData: RTGS;

  bicCodeColDefUrl: string = 'payments/transactions/singlePaymentRequest/private/bicCodeColDef';
  bicCodeRowDefUrl: string = 'payments/transactions/singlePaymentRequest/private/bicCodeData';

  isShowBicCodeModal = false;

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
      this.formData = new RTGS();
    }
  }

  onBicCodeSelection(e: any) {
    this.formData.bicCode = e.bicCode;
    this.formData.beneficiaryBank = e.bankName;
    this.formData.beneficiaryBankBranch = e.branchName;
    this.formData.address1 = e.city;
    this.formData.address2 = e.country;
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
