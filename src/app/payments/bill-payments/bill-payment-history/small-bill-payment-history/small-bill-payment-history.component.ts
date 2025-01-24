import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { BillPaymentHistoryService } from '../@services/bill-payment-history.service';

@Component({
  selector: 'app-small-bill-payment-history',
  templateUrl: './small-bill-payment-history.component.html',
  styleUrls: ['./small-bill-payment-history.component.scss'],
})
export class SmallBillPaymentHistoryComponent implements OnInit {
  showHistory: boolean = true;

  colDefUrl = 'payments/billPayments/billPaymentHistory/billPaymentHistoryColDefs';
  rowDefUrl = 'payments/billPayments/billPaymentHistory/getBillPaymentHistoryData';

  isSearchModel = false;

  billerColDefUrl = 'payments/billPayments/billPaymentHistory/billerNameColDefs';
  billerRowDefUrl = 'payments/billPayments/billPaymentHistory/billerNameData';

  isPrint = false;

  printData: any;

  context = {
    componentParent: this,
  };

  gridOptions = {
    paginationPageSize: 7,
  };

  products: any[] = [];
  statuses: any[] = [];

  searchBy: any = {
    biller: 'Vodafone',
    product: '',
    status: '',
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private httpService: HttpService,
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

    this.httpService
      .httpPost('payments/billPayments/billPaymentHistory/getProduct')
      .subscribe((response: any) => {
        this.products = response.dataList;

        this.searchBy.product = this.products[0].id;
      });

    this.httpService
      .httpPost('payments/billPayments/billPaymentHistory/getStatus')
      .subscribe((response: any) => {
        this.statuses = response.dataList;
        this.searchBy.status = this.statuses[0].id;
      });
  }

  setBiller(biller: any) {
    this.searchBy.biller = biller.billerCode;
  }

  onSearch() {
    this.showHistory = false;

    setTimeout(() => {
      this.showHistory = true;
    }, 500);
  }

  onCancel() {
    this.router.navigate(['/dashboard/consolidated'], { relativeTo: this.route });
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
