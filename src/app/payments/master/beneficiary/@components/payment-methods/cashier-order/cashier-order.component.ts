import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

class CashierOrder {
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
  selector: 'app-cashier-order',
  templateUrl: './cashier-order.component.html',
  styleUrls: ['./cashier-order.component.scss'],
})
export class CashierOrderComponent implements OnInit {
  @Output() addAccount = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input('account') account: any;

  formData: CashierOrder;

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
      this.formData = new CashierOrder();
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
