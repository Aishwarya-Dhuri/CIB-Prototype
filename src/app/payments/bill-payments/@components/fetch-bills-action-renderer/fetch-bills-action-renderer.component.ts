import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-fetch-bills-action-renderer',
  templateUrl: './fetch-bills-action-renderer.component.html',
  styleUrls: ['./fetch-bills-action-renderer.component.scss'],
})
export class FetchBillsActionRendererComponent implements OnInit {
  actions!: any;

  public params: ICellRendererParams | any;

  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('index') index?: any;
  @Input('data') data?: any;
  @Input('field') field?: any;
  @Input('context') context?: any;

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.params = {
        data: this.data,
        node: { rowIndex: this.index },
        context: this.context,
      };

      this.actions = this.params.data[this.field] ? this.params.data[this.field] : [];
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.actions = params.data.actions ? params.data.actions : [];
  }

  public invokeParentMethod(action: any) {
    this.params.context.componentParent[action.methodName](
      this.params.node.rowIndex,
      this.params.data,
    );
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
