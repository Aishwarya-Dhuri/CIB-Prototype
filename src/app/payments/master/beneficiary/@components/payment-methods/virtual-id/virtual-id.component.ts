import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

class VirtualId {
  constructor(
    public accid = new Date().getTime(),
    public virtualId = '',
    public effectiveFrom = '',
    public effectiveTill = '',
    public defaultAccount = false,
    public beneficiaryAdviceDispatchMode = [],
    public isFavourite = 'N',
  ) {}
}

@Component({
  selector: 'app-virtual-id',
  templateUrl: './virtual-id.component.html',
  styleUrls: ['./virtual-id.component.scss'],
})
export class VirtualIdComponent implements OnInit {
  @Output() addAccount = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input('account') account: any;
  formData: VirtualId;

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
      this.formData = new VirtualId();
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
