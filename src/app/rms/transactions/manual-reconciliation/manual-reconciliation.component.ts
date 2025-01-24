import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ManualReconciliationService } from './@services/manual-reconciliation.service';

@Component({
  selector: 'app-manual-reconciliation',
  templateUrl: './manual-reconciliation.component.html',
  styleUrls: ['./manual-reconciliation.component.scss'],
})
export class ManualReconciliationComponent implements OnInit, OnDestroy {
  @ViewChild('dynamicSearchBy') dynamicSearchBy: any;

  searchFilters: Filter[] = [];
  invoiceFilters: Filter[] = [];
  paymentFilters: Filter[] = [];
  isPaymentFilterValid: boolean = false;
  isSearchByValid: boolean = false;
  invoiceFilterValid: boolean = false;
  mode: string = '';

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private manualReconciliationService: ManualReconciliationService,
    private viewService: ViewService,
  ) {
    this.searchFilters = [
      {
        name: 'corporateClientName',
        displayName: 'Corporate Client Name',
        value: '',
        type: 'string',
      },
      {
        name: 'program',
        displayName: 'Program',
        value: '',
        type: 'string',
      },
      {
        name: 'accountNumber',
        displayName: 'Account Number',
        value: '',
        type: 'string',
      },
    ];

    this.invoiceFilters = [
      {
        name: 'invoiceNumber',
        displayName: 'Invoice Number',
        value: '',
        type: 'string',
      },
      {
        name: 'invoiceAmount',
        displayName: 'Invoice Amount',
        value: '',
        type: 'string',
      },
      {
        name: 'invoiceDate',
        displayName: 'Invoice Date',
        value: '',
        type: 'string',
      },
      {
        name: 'invoiceDueDate',
        displayName: 'Invoice Due Date',
        value: '',
        type: 'string',
      },
    ];

    this.paymentFilters = [
      {
        name: 'transactionRefNo',
        displayName: 'Transaction Ref No.',
        value: '',
        type: 'string',
      },
      {
        name: 'paymentAmount',
        displayName: 'Payment Amount',
        value: '',
        type: 'string',
      },
      {
        name: 'paymentDate',
        displayName: 'Payment Date',
        value: '',
        type: 'string',
      },
      {
        name: 'paymentMethod',
        displayName: 'Payment Method',
        value: '',
        type: 'string',
      },
    ];
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Manual Reconciliation - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Receivables' },
      { label: 'Transactions' },
      { label: 'Manual reconciliation' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.getViewData();
  }

  getViewData() {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      this.router.navigate(['./searchResults'], { relativeTo: this.route });
    }
  }

  onPaymentFilterChange(isValid: boolean): void {
    this.isPaymentFilterValid = isValid;
  }
  onInvoiceFilterChange(isValid: boolean): void {
    this.invoiceFilterValid = isValid;
  }
  onSearchByChange(isValid: boolean): void {
    this.isSearchByValid = isValid;
  }
  getSearchByResults(filters: Filter[]): void {
    this.manualReconciliationService.searchFilters = filters;
  }
  getInvoiceFilterResults(filters: Filter[]): void {
    this.manualReconciliationService.invoiceFilters = filters;
  }
  getPaymentFilterResults(filters: Filter[]): void {
    this.manualReconciliationService.paymentFilters = filters;
  }
  isSearchValid(): boolean {
    return this.isSearchByValid && this.isPaymentFilterValid && this.invoiceFilterValid;
  }
  search() {
    this.router.navigate(['./searchResults'], { relativeTo: this.route });
  }

  ngOnDestroy() {}
}
