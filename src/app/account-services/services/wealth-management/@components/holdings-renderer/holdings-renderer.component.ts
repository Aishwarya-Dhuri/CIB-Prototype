import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-holdings-renderer',
  templateUrl: './holdings-renderer.component.html',
  styleUrls: ['./holdings-renderer.component.scss'],
})
export class HoldingsRendererComponent implements OnInit {
  cellValue!: any;

  constructor() {}

  ngOnInit(): void {}

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value;
  }

  public invokeParentMethod() {
    this.params.context.componentParent.onHoldingClick();
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
