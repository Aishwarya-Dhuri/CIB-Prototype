import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

class InitialFundTransfer {
  constructor(
    public accid = new Date().getTime(),
    public accountNumber = '',
    public effectiveFrom = '',
    public effectiveTill = '',
    public defaultAccount = false,
    public beneficiaryAdviceDispatchMode = [],
    public isFavourite = 'N',
  ) {}
}

@Component({
  selector: 'app-internal-fund-transfer',
  templateUrl: './internal-fund-transfer.component.html',
  styleUrls: ['./internal-fund-transfer.component.scss'],
})
export class InternalFundTransferComponent implements OnInit {
  @Output() addAccount = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input('account') account: any;
  formData: InitialFundTransfer;

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
      this.formData = new InitialFundTransfer();
    }
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
