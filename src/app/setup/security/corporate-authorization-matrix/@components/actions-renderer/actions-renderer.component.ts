import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-actions-renderer',
  templateUrl: './actions-renderer.component.html',
  styleUrls: ['./actions-renderer.component.scss'],
})
export class ActionsRendererComponent implements OnInit {
  index: number;

  params: ICellRendererParams;

  constructor() {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.index = params.rowIndex;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
