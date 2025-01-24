import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-render-account-no',
  templateUrl: './render-account-no.component.html',
  styleUrls: ['./render-account-no.component.scss'],
})
export class RenderAccountNoComponent implements OnInit, AgRendererComponent {
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
    this.cellValue = this.getValueToDisplay(params);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  onClick() {
    this.params.context.componentParent.onLinkClick(this.params.data);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}
