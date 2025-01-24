import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-letter-of-credit-status-renderer',
  templateUrl: './letter-of-credit-status-renderer.component.html',
  styleUrls: ['./letter-of-credit-status-renderer.component.scss'],
})
export class LetterOfCreditStatusRendererComponent implements OnInit {
  cellValue!: any;

  constructor() {}

  ngOnInit(): void {}

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value;
  }

  public invokeParentMethod(link: any) {
    this.params.context.componentParent.onLinkClick(link);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
