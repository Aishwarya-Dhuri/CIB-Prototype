import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-beneficiary-advice-dispatch-mode-renderer',
  templateUrl: './beneficiary-advice-dispatch-mode-renderer.component.html',
  styleUrls: ['./beneficiary-advice-dispatch-mode-renderer.component.scss'],
})
export class BeneficiaryAdviceDispatchModeRendererComponent implements OnInit {
  cellValue!: any;

  constructor() {}

  ngOnInit(): void {}

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value.join(', ');
  }

  public invokeParentMethod(link: any) {
    this.params.context.componentParent.onLinkClick(link);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
