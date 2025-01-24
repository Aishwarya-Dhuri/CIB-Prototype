import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-link-action-renderer',
  templateUrl: './link-action-renderer.component.html',
  styleUrls: ['./link-action-renderer.component.scss'],
})
export class LinkActionRendererComponent implements AgRendererComponent {
  actions!: any[];

  constructor() {}

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.actions = params.data.links ? params.data.links : [];
  }

  public invokeParentMethod(action: any, event: any) {
    const paramList = action.paramList ? action.paramList.split(',') : [];
    let paramListValues = [];
    paramList.forEach((param: any) => {
      paramListValues.push(this.params.data[param.trim()]);
    });
    if (this.params.context.componentParent[action.methodName])
      this.params.context.componentParent[action.methodName](...paramListValues, event);
    else
      console.error(
        'kindly give implementation for : ' + action.methodName + '(' + action.paramList + ')',
      );
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
