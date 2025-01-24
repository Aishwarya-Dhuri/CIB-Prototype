import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-action-cell-renderer',
  template: ` <app-icon
  icon="fa-eye"
  class="p-pr-2 pointer"
  (click)="onActionClick('view')"
></app-icon>

<app-icon
  icon="fa-pencil"
  class="p-pr-2 pointer"
  (click)="onActionClick('edit')"
></app-icon>

<app-icon
  icon="fa-trash-alt"
  class="p-pr-2 pointer"
  (click)="onActionClick('delete')"
></app-icon>`
})
export class ActionCellRendererComponent implements OnInit {

  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  constructor() { }

  ngOnInit(): void {
  }

  onActionClick(action: string) {
    const rowData = this.params.data;
    if (this.params.context.componentParent && this.params.context.componentParent[action]) {
      this.params.context.componentParent[action](rowData);
    }
  }

}
