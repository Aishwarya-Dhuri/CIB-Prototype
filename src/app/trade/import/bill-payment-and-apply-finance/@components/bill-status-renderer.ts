import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-bill-status-renderer',
  template: `
    <div
      *ngIf="cellValue == 'Pending Acceptance'"
      pTooltip="This bill is not yet accepted hence payment / apply finance cannot be initiated. Please initiate the acceptance request of this bill from the Bill Acceptance module."
    >
      {{ cellValue }}
    </div>
    <div *ngIf="cellValue != 'Pending Acceptance'">
      {{ cellValue }}
    </div>
  `,
})
export class BillStatusRendererComponent implements AgRendererComponent {
  cellValue: any;

  params: ICellRendererParams;

  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
