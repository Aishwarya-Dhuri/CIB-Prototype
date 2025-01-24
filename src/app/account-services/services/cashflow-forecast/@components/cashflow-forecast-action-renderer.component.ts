import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-auth-matrix-additional-info-renderer',
  template: `<app-icon
    *ngIf="moreActions"
    class="inline-block p-p-1 pointer"
    icon="fa-ellipsis-v"
    (click)="showMoreActions($event)"
  ></app-icon>`,
})
export class CashflowForecastActionRendererComponent implements AgRendererComponent {
  moreActions!: boolean;
  parentContext!: any;
  params: ICellRendererParams;

  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.moreActions = params.value;
    this.parentContext = params.context.componentParent;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  showMoreActions(e: MouseEvent, action: string): void {
    this.parentContext.showMoreActions(e.pageY, e.pageX, this.params.node.data);
  }
}
