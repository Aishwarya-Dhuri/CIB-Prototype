import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-running-balance-renderer',
  templateUrl: './running-balance-renderer.component.html',
  styleUrls: ['./running-balance-renderer.component.scss'],
})
export class RunningBalanceRendererComponent implements OnInit, AgRendererComponent {
  cellValue!: any;
  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('context') context?: any;
  @Input('field') field?: any;

  public params: ICellRendererParams | any;

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

  public invokeParentMethod() {
    this.params.context.componentParent.onDebitCreditAdvice(this.params.data);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
