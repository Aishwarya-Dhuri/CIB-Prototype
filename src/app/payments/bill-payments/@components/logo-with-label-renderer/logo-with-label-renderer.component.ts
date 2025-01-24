import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-logo-with-label-renderer',
  templateUrl: './logo-with-label-renderer.component.html',
  styleUrls: ['./logo-with-label-renderer.component.scss'],
})
export class LogoWithLabelRendererComponent implements OnInit {
  biller: any;

  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: any;
  @Input('context') context?: any;

  public params: ICellRendererParams | any;

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.params = {
        data: this.data,
        context: this.context,
      };

      this.biller = this.data;
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.biller = params.data;
  }

  public billerDetails() {
    this.params.context.componentParent.onBillerDetails(this.params.data);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
