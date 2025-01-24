import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-status-with-star-renderer',
  templateUrl: './status-with-star-renderer.component.html',
  styleUrls: ['./status-with-star-renderer.component.scss'],
})
export class StatusWithStarRendererComponent implements OnInit, AgRendererComponent {
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

  onClick() {
    this.params.context.componentParent.onFavouriteClick(this.params.data);
  }
}
