import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

class OutwordTelegraphicTransfer {
  constructor(
    public accountNumber = '',
    public paymentMethodDetails = new AdditionalDetails(),
    public intermediateBankDetails = new AdditionalDetails(),
    public effectiveFrom = '',
    public effectiveTill = '',
    public defaultAccount = false,
    public beneficiaryAdviceDispatchMode = [],
    public isFavourite = 'N',
  ) {}
}

class AdditionalDetails {
  constructor(
    public accid = new Date().getTime(),
    public bicCode = '',
    public bankSortCode = '',
    public beneficiaryBank = '',
    public beneficiaryBankBranch = '',
    public address1 = '',
    public address2 = '',
    public address3 = '',
  ) {}
}

@Component({
  selector: 'app-outward-telegraphic-transfer',
  templateUrl: './outward-telegraphic-transfer.component.html',
  styleUrls: ['./outward-telegraphic-transfer.component.scss'],
})
export class OutwardTelegraphicTransferComponent implements OnInit {
  @Output() addAccount = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input('account') account: any;
  formData: OutwordTelegraphicTransfer;

  selectedDetailsType = '';

  bicCodeColDefUrl: string = 'payments/transactions/singlePaymentRequest/private/bicCodeColDef';
  bicCodeRowDefUrl: string = 'payments/transactions/singlePaymentRequest/private/bicCodeData';

  isShowBicCodeModal = false;

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
      this.formData = new OutwordTelegraphicTransfer();
    }
  }

  onBicCodeSelection(e: any) {
    this.formData[this.selectedDetailsType].bicCode = e.bicCode;
    this.formData[this.selectedDetailsType].beneficiaryBank = e.bankName;
    this.formData[this.selectedDetailsType].beneficiaryBankBranch = e.branchName;
    this.formData[this.selectedDetailsType].address1 = e.city;
    this.formData[this.selectedDetailsType].address2 = e.country;
  }

  add() {
    const account: any = {
      ...this.formData,
      status: this.account ? 'Update' : 'Create',
    };
    account.beneficiaryAdviceDispatchMode = this.formData.beneficiaryAdviceDispatchMode.join(', ');

    this.addAccount.emit({ account: account });
  }
}
