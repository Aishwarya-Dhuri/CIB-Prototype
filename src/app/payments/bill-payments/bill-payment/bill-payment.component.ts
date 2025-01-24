import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { BillPaymentService } from './@services/bill-payment.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';

@Component({
  selector: 'app-bill-payment',
  templateUrl: './bill-payment.component.html',
  styleUrls: ['./bill-payment.component.scss'],
})
export class BillPaymentComponent implements OnInit {
  options: any;
  listType: string = 'card';
  viewport: string;
  billPayment: any;

  billPayments: any[] = [];

  billers = [
    {
      id: 'all',
      displayName: 'ALL',
    },
    {
      id: 'critical',
      displayName: 'Critical (22)',
    },
    {
      id: 'due',
      displayName: 'Bills Due (10)',
    },
    {
      id: 'recent',
      displayName: 'Recent Payments (90)',
    },
  ];

  biller: any;

  viewBills: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewportService: ViewportService,
    private httpService: HttpService,
    private router: Router,
    private billPaymentService: BillPaymentService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Bill Payment',
      subHeading: '',

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Services' },
      { label: 'Bill Payment' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
      if (viewport == 'mobile') {
        this.listType = 'card';
      }
    });

    this.getBillPayments(this.billers[0]);

    this.httpService
      .httpPost('payments/billPayments/registeredBillPayment/billPaymentsDashboardData')
      .subscribe((billPayment: any) => {
        this.billPayment = billPayment;

        this.options = {
          padding: { left: 10, right: 10, top: 10, bottom: 20 },
          data: billPayment.billData,
          formatter: (params: any) => {
            return `${billPayment.billData[params.itemId].bill}\t\t\t\t${
              billPayment.billData[params.itemId].amount
            }`;
          },
          labelKey: 'bill',
          angleKey: 'amount',
        };
      });
  }

  getBillPayments(biller: any) {
    this.biller = biller;

    let url = `payments/billPayments/registeredBillPayment/private/getAllBillers`;
    if (biller.id === this.billers[1].id) {
      url = `payments/billPayments/registeredBillPayment/private/getCriticalBillers`;
    } else if (biller.id === this.billers[2].id) {
      url = `payments/billPayments/registeredBillPayment/private/getOverdueDueBillers`;
    } else if (biller.id === this.billers[3].id) {
      url = `payments/billPayments/registeredBillPayment/private/getRecentPayments`;
    }

    this.httpService.httpPost(url).subscribe((response: any) => {
      this.billPayments = response.data;
    });
  }

  onListTypeChange(listType: string) {
    this.listType = listType;
  }

  goToHistory() {
    this.router.navigate(['/payments/billPayments/billPaymentHistory']);
  }
}
