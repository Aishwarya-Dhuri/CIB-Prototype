import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-acc-currency-renderer',
  templateUrl: './acc-currency-renderer.component.html',
  styleUrls: ['./acc-currency-renderer.component.scss'],
})
export class AccCurrencyRendererComponent implements OnInit {
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

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value;
  }

  public invokeParentMethod(link: any) {
    this.params.context.componentParent.onLinkClick(link);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
