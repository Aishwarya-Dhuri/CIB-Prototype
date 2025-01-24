import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-request-status-renderer',
  templateUrl: './request-status-renderer.component.html',
  styleUrls: ['./request-status-renderer.component.scss'],
})
export class RequestStatusRendererComponent implements OnInit {
  cellValue: any;

  constructor() {}

  ngOnInit(): void {}

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
