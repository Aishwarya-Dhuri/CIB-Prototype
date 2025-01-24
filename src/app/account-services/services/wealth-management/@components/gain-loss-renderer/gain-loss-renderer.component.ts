import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { WealthManagementService } from '../../@services/wealth-management.service';

@Component({
  selector: 'app-gain-loss-renderer',
  templateUrl: './gain-loss-renderer.component.html',
  styleUrls: ['./gain-loss-renderer.component.scss'],
})
export class GainLossRendererComponent implements OnInit {
  cellValue!: any;

  currency: any;

  constructor(private wealthManagementService: WealthManagementService) {}

  ngOnInit(): void {
    this.currency = this.wealthManagementService.selectedCurrencyCode
      ? this.wealthManagementService.selectedCurrencyCode + ' '
      : '';
  }

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
