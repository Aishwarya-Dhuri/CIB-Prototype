import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-cheque-renderer',
  templateUrl: './cheque-renderer.component.html',
  styleUrls: ['./cheque-renderer.component.scss'],
})
export class ChequeRendererComponent implements OnInit, AgRendererComponent {
  chequeImage!: any;
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

      this.chequeImage = this.params.data[this.field];
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.chequeImage = params.value;
  }

  public invokeParentMethod(chequeDataUrl: any) {
    this.params.context.componentParent.onChequeClick(chequeDataUrl);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
