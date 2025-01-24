import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-edit-currency-renderer',
  templateUrl: './edit-currency-renderer.component.html',
  styleUrls: ['./edit-currency-renderer.component.scss'],
})
export class EditCurrencyRendererComponent implements OnInit {
  cellValue!: any;

  constructor() {}

  ngOnInit(): void {}

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.data;
  }

  public invokeParentMethod(link: any) {
    this.params.context.componentParent.onLinkClick(link);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  amountChange() {
    this.params.context.componentParent[
      this.cellValue.module == 'payment'
        ? 'paymentOutstandingAmountUpdated'
        : 'invoiceBalanceUpdated'
    ](
      this.cellValue.module == 'payment' ? this.cellValue.outstandingAmount : this.cellValue.amount,
      this.params.data.id,
    );
  }
}
