import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-invoice-status-renderer',
  template: `
    <span
      class="p-p-1"
      [ngClass]="{
        'background-color-danger-light text-color-danger': cellValue == 'Overdue',
        'background-color-success-light text-color-success': cellValue == 'Normal'
      }"
    >
      {{ cellValue }}
    </span>
  `,
})
export class InvoiceStatusRendererComponent implements OnInit, AgRendererComponent {
  cellValue!: any;

  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: string;
  @Input('context') context?: any;
  public params: ICellRendererParams | any;

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.params = {
        data: this.data,
        context: this.context,
      };

      this.cellValue = this.params.data[this.field];
    }
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
