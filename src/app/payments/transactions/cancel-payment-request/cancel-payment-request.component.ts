import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Criteria } from 'src/app/shared/@components/dynamic-search/@models/criteria.model';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-cancel-payment-request',
  templateUrl: './cancel-payment-request.component.html',
  styleUrls: ['./cancel-payment-request.component.scss'],
})
export class CancelPaymentRequestComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  context = {
    componentParent: this,
  };

  isLoadGenericFilters = false;

  cancelBulkPaymentData: any = null;

  paymentRequests = [];
  selectedFilters = [];
  criteriaList = [];
  paymentRequest = '';
  genericFilterEntityName = '';

  searchColDefUrl = '';
  searchRowDefUrl = '';
  serviceUrl = '';

  recentPayments: [];
  unprocessedPayments: [];

  currentScreen = 'FILTERS';

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private viewService: ViewService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService, // private cancelPaymentRequestService: CancelPaymentRequestService,
    private listingService: ListingService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Cancel Payment Request',
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
      { label: 'Payments' },
      { label: 'Transactions' },
      { label: 'Cancel Payment Request' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.httpService
      .httpPost('payments/transactions/cancelPaymentRequest/private/unprocessedPayments')
      .subscribe((res: any) => {
        this.unprocessedPayments = res;
      });

    this.httpService
      .httpPost('payments/transactions/cancelPaymentRequest/private/recentPayments')
      .subscribe((res: any) => {
        this.recentPayments = res;
      });

    this.paymentRequests = [
      {
        id: 'Payment Request',
        displayName: 'Payment Request',
        enrichments: {
          genericFilterEntityName: 'CANCEL_PAYMENT_REQUEST',
          colDefUrl: 'payments/transactions/cancelPaymentRequest/private/paymentRequestColDefs',
          rowDataUrl: 'payments/transactions/cancelPaymentRequest/private/rowData/paymentRequest',
          serviceUrl: 'payments/transactions/singlePaymentRequest',
        },
      },
      {
        id: 'Statutory Payment',
        displayName: 'Statutory Payment',
        enrichments: {
          genericFilterEntityName: 'CANCEL_STATUTORY_PAYMENT',
          colDefUrl: 'payments/transactions/cancelPaymentRequest/private/statutoryPaymentColDefs',
          rowDataUrl: 'payments/transactions/cancelPaymentRequest/private/rowData/statutoryPayment',
          serviceUrl: 'payments/transactions/statutoryPayment',
        },
      },
      {
        id: 'Own Account Transfer',
        displayName: 'Own Account Transfer',
        enrichments: {
          genericFilterEntityName: 'CANCEL_OAT',
          colDefUrl: 'payments/transactions/cancelPaymentRequest/private/oatColDefs',
          rowDataUrl:
            'payments/transactions/cancelPaymentRequest/private/rowData/ownAccountTransfer',
          serviceUrl: 'payments/transactions/ownAccountTransfer',
        },
      },
      {
        id: 'WPS',
        displayName: 'WPS',
        enrichments: {
          genericFilterEntityName: 'CANCEL_WPS',
          colDefUrl: 'payments/transactions/cancelPaymentRequest/private/colDefs',
          rowDataUrl: 'payments/transactions/cancelPaymentRequest/private/rowData/wps',
          serviceUrl: 'payments/transactions/wpsPayment',
        },
      },
      {
        id: 'Bill Payment',
        displayName: 'Bill Payment',
        enrichments: {
          genericFilterEntityName: 'CANCEL_BILL_PAYMENT',
          colDefUrl: 'payments/transactions/cancelPaymentRequest/private/colDefs',
          rowDataUrl: 'payments/transactions/cancelPaymentRequest/private/rowData/billPayment',
          serviceUrl: 'payments/billPayments/billPayment',
        },
      },
    ];

    this.onPaymentRequestChanged(this.paymentRequests[0]);
  }

  onPaymentRequestChanged(paymentRequest: any): void {
    this.genericFilterEntityName = paymentRequest.enrichments.genericFilterEntityName;
    this.paymentRequest = paymentRequest.id;
    this.searchColDefUrl = paymentRequest.enrichments.colDefUrl;
    this.searchRowDefUrl = paymentRequest.enrichments.rowDataUrl;
    this.serviceUrl = paymentRequest.enrichments.serviceUrl;
    this.generateFilters();
  }

  generateFilters(): void {
    this.isLoadGenericFilters = true;
    setTimeout(() => {
      this.isLoadGenericFilters = false;
    }, 10);
  }

  onDynamicFiltersReady(): void {
    this.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }

  getCriteriaList(): void {
    this.criteriaList = [];
    const getCriteriaUrl = 'commons/searchCriteria/private/getCriterias';
    const data = {
      dataMap: { entityName: this.genericFilterEntityName, criteriaType: 'QUERYSEARCH' },
    };

    this.httpService.httpPost(getCriteriaUrl, data).subscribe((response: any) => {
      this.criteriaList = response.dataMap.SearchCriteria;
    });
  }

  getCriteriaFilterCount(criteria: Criteria): number {
    return JSON.parse(criteria.criteria).length;
  }

  applyCriteria(criteria: Criteria): void {
    this.dynamicSearch.saveCriteria.setCriteriaData(criteria);
    this.dynamicSearch.onFillCriteria(criteria);
  }

  deleteCriteria(criteria: Criteria): void {
    const url = 'commons/searchCriteria/private/delete';
    const data = { dataMap: { id: criteria.id } };
    this.httpService.httpPost(url, data).subscribe(() => {
      this.getCriteriaList();
    });
  }

  getRecords(filters: Filter[]): void {
    this.selectedFilters = filters;
    this.currentScreen = 'LISTING';
  }

  cancelBatch(
    id?: string,
    entryType?: string,
    beneficiary?: string,
    activationDate?: string,
    corporateRefNo?: string,
    batchNo?: string,
  ) {
    this.cancelBulkPaymentData = {
      id,
      entryType,
      beneficiary,
      activationDate,
      corporateRefNo,
      batchNo,
    };
  }

  onCancelBatchRequest() {
    console.log(this.cancelBulkPaymentData);
    this.cancelRequest(
      this.cancelBulkPaymentData.id,
      this.cancelBulkPaymentData.entryType,
      this.cancelBulkPaymentData.beneficiary,
      this.cancelBulkPaymentData.activationDate,
      this.cancelBulkPaymentData.corporateRefNo,
      this.cancelBulkPaymentData.batchNo,
    );

    this.cancelBulkPaymentData = null;
  }

  cancelRequest(
    id?: string,
    entryType?: string,
    beneficiary?: string,
    activationDate?: string,
    corporateRefNo?: string,
    batchNo?: string,
  ) {
    batchNo = batchNo ? batchNo : '-';

    const formData = {
      entryType,
      beneficiary,
      paymentRequest: this.paymentRequest,
      activationDate,
      corporateRefNo,
      batchNo,
    };
    let url = 'payments/transactions/cancelPaymentRequest/private/create';

    this.httpService.httpPost(url, formData).subscribe((response: any) => {
      this.goToListing();
    });
  }

  view(id: string, entityName?: string) {
    this.viewService.setId(id);
    this.viewService.setMode('VIEW');

    if (entityName == 'MULTIPLE') {
      this.router.navigate(['/payments/transactions/bulkPaymentRequest'], {
        relativeTo: this.route,
      });

      return;
    }

    const redirectUrl = '/' + this.serviceUrl + '/initiate';

    console.log(redirectUrl);

    this.router.navigate([redirectUrl], { relativeTo: this.route });
    return;
  }

  goToListing() {
    this.listingService.setSelectedListCode('PENDINGLIST');
    this.router.navigateByUrl(this.router.url + '/listing#PENDINGLIST');
  }
}
