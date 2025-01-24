import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-default-account-renderer',
  templateUrl: './default-account-renderer.component.html',
  styleUrls: ['./default-account-renderer.component.scss'],
})
export class DefaultAccountRendererComponent implements OnInit {
  cellValue!: any;

  constructor() {}

  ngOnInit(): void {}

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
