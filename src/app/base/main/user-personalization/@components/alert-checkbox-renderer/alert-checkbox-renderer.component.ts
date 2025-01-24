import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams, RowNode } from 'ag-grid-community';

@Component({
  selector: 'app-alert-checkbox-renderer',
  template: `
    <div style="display: flex;padding: 0.5rem;">
      <p-checkbox
        class="p-pr-3"
        [name]="id"
        value="Email"
        [(ngModel)]="channelType"
        [disabled]="isDisabled()"
        (onChange)="onChange()"
      ></p-checkbox>
      <p-checkbox
        class="p-px-4"
        [name]="id"
        value="SMS"
        [(ngModel)]="channelType"
        [disabled]="isDisabled()"
        (onChange)="onChange()"
      ></p-checkbox>
      <p-checkbox
        class="p-px-4"
        [name]="id"
        value="Online"
        [(ngModel)]="channelType"
        [disabled]="isDisabled()"
        (onChange)="onChange()"
      ></p-checkbox>
    </div>
  `,
})
export class AlertCheckboxRendererComponent implements AgRendererComponent {
  id!: string;
  channelType!: string[];
  parentComponentRef!: any;
  node!: RowNode;
  params: ICellRendererParams;

  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.id = params.data.id;
    this.channelType = params.value;

    this.parentComponentRef = params.context.componentParent;
    this.params = params;
    this.node = params.node;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  isDisabled(): boolean {
    return (
      !this.parentComponentRef.selectedTab.subTabs[0].isEdit || this.params.data.status != 'Enabled'
    );
  }

  onChange(): void {
    // let status = null;
    // if(this.channelType.length == 0)
    //   status = 'Disabled';
    // else
    //   status = 'Enabled';
    // this.node.setDataValue('status', status);
    this.parentComponentRef.updateAlert(this.id, this.channelType);
  }
}
