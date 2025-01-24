import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';
import { FetchBillsActionRendererComponent } from '../../../@components/fetch-bills-action-renderer/fetch-bills-action-renderer.component';
import { LogoWithLabelRendererComponent } from '../../../@components/logo-with-label-renderer/logo-with-label-renderer.component';
import { BillPaymentService } from '../../@services/bill-payment.service';

@Component({
  selector: 'app-bill-payment-details',
  templateUrl: './bill-payment-details.component.html',
  styleUrls: ['./bill-payment-details.component.scss'],
})
export class BillPaymentDetailsComponent implements OnInit {
  @ViewChild('billPaymentGrid') billPaymentGrid: any;

  @Input('billPayment') billPayment!: any;
  @Input('listType') listType!: string;

  @Output() viewAll = new EventEmitter<string>();
  @Output() viewLess = new EventEmitter<void>();

  colDefUrl = 'payments/billPayments/registeredBillPayment/billPaymentColDef';

  private lessBillers: any[] = [];

  billersRowData: any[] = [];

  isViewAll = false;

  frameworkComponents = {
    fetchBillsActionRenderer: FetchBillsActionRendererComponent,
    logoWithLabelRenderer: LogoWithLabelRendererComponent,
  };

  constructor(
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private billPaymentService: BillPaymentService,
  ) {}

  ngOnInit(): void {
    if (this.billPayment.billers.length > 4) {
      for (let i = 0; i < 4; i++) {
        this.lessBillers.push(this.billPayment.billers[i]);
      }
    } else {
      this.lessBillers = this.billPayment.billers;
    }

    this.billersRowData = this.lessBillers;
    this.setGridRowData();
  }

  onViewAll() {
    this.billersRowData = this.billPayment.billers;
    this.viewAll.emit(this.billPayment.category);
    this.isViewAll = true;
    this.setGridRowData();
  }

  onViewLess() {
    this.billersRowData = this.lessBillers;
    this.viewLess.emit();
    this.isViewAll = false;
    this.setGridRowData();
  }

  onBillerDetails(biller: any) {
    this.billPaymentService.activeBiller = biller;
    this.router.navigate(['./biller'], { relativeTo: this.route });
  }

  private setGridRowData() {
    if (this.billPaymentGrid && this.listType === 'grid') {
      this.billPaymentGrid.setRowData(this.billersRowData);
    }
  }

  fetchBills(rowIndex: number, rowData: any) {
    const data = { dataMap: { id: rowData.id } };

    this.httpService
      .httpPost('payments/billPayments/registeredBillPayment/private/view', data)
      .subscribe((billDetails: any) => {
        this.billPaymentGrid.updateRowDataByIndex(rowIndex, billDetails);
      });
  }
}
