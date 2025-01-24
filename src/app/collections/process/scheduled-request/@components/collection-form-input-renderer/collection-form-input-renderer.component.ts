import { Component, OnInit, Input } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-collection-form-input-renderer',
  templateUrl: './collection-form-input-renderer.component.html',
  styleUrls: ['./collection-form-input-renderer.component.scss']
})
export class CollectionFormInputRendererComponent implements OnInit {
  cellValue!: any;
  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: any;
  @Input('context') context?: any;

  public params: ICellRendererParams | any;

  constructor() { }

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.cellValue = this.data[this.field];

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
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
