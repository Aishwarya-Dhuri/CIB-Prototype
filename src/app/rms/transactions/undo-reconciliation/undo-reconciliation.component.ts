import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ManualReconciliation } from '../manual-reconciliation/@models/manual-reconciliation.model';
import { LinkCellRendererComponent } from './@components/link-cell-renderer/link-cell-renderer.component';

@Component({
  selector: 'app-undo-reconciliation',
  templateUrl: './undo-reconciliation.component.html',
  styleUrls: ['./undo-reconciliation.component.scss'],
})
export class UndoReconciliationComponent implements OnInit {
  @ViewChild('dynamicSearchBy') dynamicSearchBy: any;

  isSearchResult: boolean = false;
  isSearchBy: boolean = true;
  isPaymentFilterValid: boolean = false;
  isSearchByValid: boolean = false;
  invoiceFilterValid: boolean = false;
  searchFilters: Filter[] = [];
  invoiceFilters: Filter[] = [];
  paymentFilters: Filter[] = [];
  selectedData: any;

  // Search Result
  viewPort: string = '';
  colDefUrl: string = 'rms/transactions/undoReconciliation/private/undoReconciliationColDefs';
  dataUrl: string = 'rms/transactions/undoReconciliation/private/getSearchData';
  rowListData: any[] = [];
  gridOptions = {
    context: { componentParent: this },
    rowModelType: 'clientSide',
    frameworkComponents: {
      linksCellRenderer: LinkCellRendererComponent,
    },
  };
  showFilters: boolean = false;
  accountList: any[] = [];
  isReview: boolean = false;

  constructor(
    private viewPortService: ViewportService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private router: Router,
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
    this.viewPortService.getViewport().subscribe((res) => {
      this.viewPort = res;
    });
    const actions: Actions = {
      heading: 'Undo Reconciliation - Initiate',
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
      { label: 'Undo Reconciliation' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList')
      .subscribe((response: any) => {
        this.accountList = response.dataList;
      });
    this.getRowData();
  }
  // getAccountNameById(accountId: string): string {
  //   let accountName: string = "";
  //   if (accountId) {
  //     accountName = this.accountList.find((res: any) => res.id === accountId).displayName;
  //   }
  //   return accountName
  // }

  getRowData() {
    this.httpService.httpPost(this.dataUrl).subscribe((response: any) => {
      this.rowListData = response.data;
    });
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
    this.searchFilters = filters;
  }
  getInvoiceFilterResults(filters: Filter[]): void {
    this.invoiceFilters = filters;
  }
  getPaymentFilterResults(filters: Filter[]): void {
    this.paymentFilters = filters;
  }

  isSearchValid(): boolean {
    return this.isSearchByValid && this.isPaymentFilterValid && this.invoiceFilterValid;
  }

  modify(): void {
    this.isSearchBy = true;
    this.isSearchResult = false;
  }

  onListClick(selectedData: any): void {
    const data = { dataMap: { id: selectedData.id } };
    this.httpService
      .httpPost('rms/transactions/manualReconciliation/private/view', data)
      .subscribe((formData: ManualReconciliation) => {
        this.selectedData = formData;
        this.isReview = true;
      });
  }

  clearAll(): void {
    this.isSearchBy = true;
    this.isSearchResult = false;
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
}
