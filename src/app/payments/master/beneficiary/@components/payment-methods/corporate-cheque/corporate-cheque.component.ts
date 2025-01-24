import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

class CorporateCheque {
  constructor(
    public accid = new Date().getTime(),
    public instrumentDispatchTo = '',
    public instrumentDispatchMode = '',
    public effectiveFrom = '',
    public effectiveTill = '',
    public beneficiaryAdviceDispatchMode = [],
  ) {}
}

@Component({
  selector: 'app-corporate-cheque',
  templateUrl: './corporate-cheque.component.html',
  styleUrls: ['./corporate-cheque.component.scss'],
})
export class CorporateChequeComponent implements OnInit {
  @Output() addAccount = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input('account') account: any;
  formData: CorporateCheque;

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
      this.formData = new CorporateCheque();
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
