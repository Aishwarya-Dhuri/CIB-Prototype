import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { BillPaymentHistoryService } from '../../@services/bill-payment-history.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @ViewChild('searchResultsGrid') searchResultsGrid: any;

  colDefUrl = 'payments/billPayments/billPaymentHistory/billPaymentHistoryColDefs';
  rowDefUrl = 'payments/billPayments/billPaymentHistory/getBillPaymentHistoryData';

  isPrint = false;

  printData: any;

  context = {
    componentParent: this,
  };

  gridOptions = {
    paginationPageSize: 7,
  };

  filters: any[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private billPaymentHistoryService: BillPaymentHistoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Bill Payment History - View',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Service' },
      { label: 'Bill Payment History' },
      { label: 'View' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.filters = this.billPaymentHistoryService.selectedFilters;
  }

  onClearSearchClick() {
    this.billPaymentHistoryService.selectedFilters = [];
    this.router.navigate(['/payments/billPayments/billPaymentHistory']);
  }

  onPrint(
    id: string,
    cardNumber: string,
    billerName: string,
    product: string,
    consumerName: string,
    totalPayableAmount: string,
    modifiedSysOn: string,
    channel: string,
  ) {
    this.printData = {
      transactionRefNo: id,
      accountNumber: cardNumber,
      billerName: billerName,
      productName: product,
      erwr: 4001,
      consumerName: consumerName,
      billAmount: totalPayableAmount,
      paymentAmount: totalPayableAmount,
      paymentDate: modifiedSysOn,
      channel: channel,
    };

    this.isPrint = true;
  }
}
