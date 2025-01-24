import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-authorization-limit-renderer',
  templateUrl: './authorization-limit-renderer.component.html',
  styleUrls: ['./authorization-limit-renderer.component.scss'],
})
export class AuthorizationLimitRendererComponent implements OnInit {
  cellValue!: any;
  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: any;
  @Input('context') context?: any;

  public params: ICellRendererParams | any;

  id: string;
  accessName: string = '';

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.id = this.data.id;
      this.cellValue = this.data[this.field];
      this.accessName = this.field;

      this.params = {
        data: this.data,
        context: this.context,
      };
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.data = params.node.data;
    this.cellValue = params.value ? params.value.toString() : '';
    this.params = params;
    this.context = params.context;
    this.id = params.data.id;
    this.accessName = params.colDef.field;
    if (this.params.node) {
      this.params.node.setDataValue(this.accessName, this.cellValue);
    }
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  onChange() {
    if (this.params.node) {
      this.params.node.setDataValue(this.accessName, this.cellValue);
    }
  }
}
