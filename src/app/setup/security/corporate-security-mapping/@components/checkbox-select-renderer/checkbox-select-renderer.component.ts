import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-checkbox-select-renderer',
  templateUrl: './checkbox-select-renderer.component.html',
  styleUrls: ['./checkbox-select-renderer.component.scss'],
})
export class CheckboxSelectRendererComponent implements OnInit {
  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: any;
  @Input('context') context?: any;
  public params: ICellRendererParams | any;

  id: string;
  isCheck: boolean = false;
  accessName: string = '';

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.id = this.data.id;
      this.isCheck = this.data[this.field];
      this.accessName = this.field;

      this.params = {
        data: this.data,
        context: this.context,
      };
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.id = params.data.id;
    this.isCheck = params.value ? params.value : false;
    this.data = params.node.data;
    this.context = params.context;
    this.accessName = params.colDef.field;
    if (this.params.node) {
      this.params.node.setDataValue(this.accessName, this.isCheck);
    }
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  onChange() {
    if (this.params.node) {
      this.params.node.setDataValue(this.accessName, this.isCheck);

      if (!this.isCheck) {
        this.params.node.setDataValue('authorizationLimit', '0.00');
      }
    }
  }
}
