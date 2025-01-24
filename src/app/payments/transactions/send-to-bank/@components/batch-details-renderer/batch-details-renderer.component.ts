import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-batch-details-renderer',
  templateUrl: './batch-details-renderer.component.html',
  styleUrls: ['./batch-details-renderer.component.scss'],
})
export class BatchDetailsRendererComponent implements OnInit, ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }

  constructor() {}

  ngOnInit(): void {}

  onViewClick() {
    this.params.context.componentParent.view(this.params.data.id, this.params.data.recordType);
  }
}
