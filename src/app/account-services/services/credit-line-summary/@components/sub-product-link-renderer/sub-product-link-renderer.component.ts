import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-sub-product-link-renderer',
  templateUrl: './sub-product-link-renderer.component.html',
  styleUrls: ['./sub-product-link-renderer.component.scss'],
})
export class SubProductLinkRendererComponent implements OnInit, AgRendererComponent {
  cellValue!: any;
  level: number = 0;

  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: string;
  @Input('context') context?: any;
  public params: ICellRendererParams | any;

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.params = {
        data: this.data,
        context: this.context,
      };

      this.level = this.params.data.level;
      this.cellValue =
        this.params.data[this.field][this.params.data[this.field].length - 1] +
        (this.params.data.records ? ` (${this.params.data.records})` : '');
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.level = params.data.level;
    this.cellValue =
      params.value[params.value.length - 1] +
      (this.params.data.records ? ` (${this.params.data.records})` : '');
  }

  public invokeParentMethod() {
    this.params.context.componentParent.onLinkClick(this.params.data);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
