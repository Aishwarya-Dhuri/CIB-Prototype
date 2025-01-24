import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-cashflow-forecast-month-link-renderer',
  template: `
    <a
      class="text-color-dark-shade-1 text-underline pointer"
      (click)="invokeParentMethod(cellValue)"
    >
      {{ cellValue }}
    </a>
  `,
})
export class CashflowForecastMonthLinkRendererComponent implements AgRendererComponent {
  cellValue!: any;
  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: string;
  @Input('context') context?: any;
  public params: ICellRendererParams | any;

  constructor() { }

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
    this.params = params;
    this.cellValue = params.value;
  }

  public invokeParentMethod(link: any) {
    this.params.context.componentParent.onMonthLinkClick(this.params.data);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
