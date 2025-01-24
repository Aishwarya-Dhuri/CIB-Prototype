import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  template: `
    <div class="inline-block p-pl-3">
      <app-icon
        class="pointer"
        icon="fa-ellipsis-v"
        (click)="showMoreActions($event, '')"
      ></app-icon>
    </div>
  `,
})
export class AccountSummeryActionsRendererComponent implements OnInit, AgRendererComponent {
  cellValue!: string;
  params: ICellRendererParams | any;

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

  showMoreActions(e: MouseEvent, action: string): void {
    this.params.context.componentParent.showMoreActions(e.pageY, e.pageX, this.params.node.data);
  }
}
