import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-link-cell-renderer',
  templateUrl: './link-cell-renderer.component.html',
  styleUrls: ['./link-cell-renderer.component.scss'],
})
export class LinkCellRendererComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  onListClick() {
    this.params.context.componentParent.onListClick(this.params.data);
  }
}
