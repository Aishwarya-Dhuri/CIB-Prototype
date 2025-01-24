import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-amount-renderer',
  template: `
    <div class="" [ngClass]="{ 'text-right': isAgGridRenderer }" *ngIf="cellValue">
      <app-base-currency [amount]="cellValue" [showCurrency]="false"></app-base-currency>
    </div>
    <div *ngIf="!cellValue">-</div>
  `,
})
export class AmountRendererComponent implements OnInit, AgRendererComponent {
  cellValue!: any;
  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: any;

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.cellValue = this.data[this.field];
    }
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.value ? params.value.toString() : '';
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
