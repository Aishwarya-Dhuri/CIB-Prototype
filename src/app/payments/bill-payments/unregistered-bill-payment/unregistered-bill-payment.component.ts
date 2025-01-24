import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { UnregisteredBillPaymentService } from './@services/unregistered-bill-payment.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-unregistered-bill-payment',
  templateUrl: './unregistered-bill-payment.component.html',
  styleUrls: ['./unregistered-bill-payment.component.scss'],
})
export class UnregisteredBillPaymentComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  searchBy: any;
  biller: any[];
  products: any[];
  searchByEntityName: string = 'UNREGISTERED_BILL_PAYMENTS';
  selectedFilters: Filter[] = [];

  recentPayments: any[] = [];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    public unregisteredBillPaymentService: UnregisteredBillPaymentService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Bill Payment',
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
      { label: 'Account Services' },
      { label: 'Bill Payment' },
      { label: 'Unregistered Bill Payment' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.httpService
      .httpPost('payments/billPayments/unregisteredBillPayment/private/getRecentPayments')
      .subscribe((response: any) => {
        this.recentPayments = response.data;
      });
  }

  getRecords(filters: Filter[]): void {
    this.unregisteredBillPaymentService.filters = filters;

    this.router.navigate(['./billPaymentDetails'], { relativeTo: this.route });
  }

  onDynamicFiltersReady() {
    this.unregisteredBillPaymentService.filters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }

  initiate(payment: any) {
    const filters: any[] = [
      { name: 'biller', displayName: 'Biller', value: payment.billerName },
      { name: 'product', displayName: 'Product', value: payment.product },
      { name: 'consumerNo', displayName: 'Consumer No', value: payment.consumer },
    ];

    this.getRecords(filters);
  }

  goToHistory() {
    this.router.navigate(['/payments/billPayments/billPaymentHistory']);
  }
}
