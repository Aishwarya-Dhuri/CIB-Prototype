import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-payment-date-renderer',
  templateUrl: './payment-date-renderer.component.html',
  styleUrls: ['./payment-date-renderer.component.scss'],
})
export class PaymentDateRendererComponent implements OnInit {
  cellValue!: any;

  public params: ICellRendererParams | any;

  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: any;
  @Input('context') context?: any;

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.params = {
        data: this.data,
        context: this.context,
      };

      this.cellValue = this.data[this.field];
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  dateChange() {
    this.params.context.paymentDateChanged(this.cellValue, this.params.data.id);
  }
}
