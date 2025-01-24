import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-reallocation-percentage-input-renderer',
  templateUrl: './reallocation-percentage-input-renderer.component.html',
  styleUrls: ['./reallocation-percentage-input-renderer.component.scss'],
})
export class ReallocationPercentageInputRendererComponent implements OnInit {
  cellValue!: any;

  constructor() {}

  ngOnInit(): void {}

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value;
  }

  public onChangePercentage() {
    this.params.context.componentParent.onChangePercentage(this.cellValue, this.params.rowIndex);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
