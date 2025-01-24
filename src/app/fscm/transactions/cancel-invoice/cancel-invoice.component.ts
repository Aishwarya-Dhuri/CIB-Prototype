import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';
import { InvoiceEntry } from '../invoice-entry/@model/invoice-entry.model';

@Component({
  selector: 'app-cancel-invoice',
  templateUrl: './cancel-invoice.component.html',
  styleUrls: ['./cancel-invoice.component.scss'],
})
export class CancelInvoiceComponent implements OnInit {
  @ViewChild('listing') listing: AgGridListingComponent;

  loading: boolean;
  loadingGrid: boolean;
  mode: string = '';

  searchFilters: any[] = [];

  dataForAction: any[] = [];
  singleDataForAction: any[] = [];

  remarkInput: string = '';

  isShowSearch: boolean = false;
  isShowInputRemark: boolean = false;
  context: any = { componentParent: this };

  viewInvoiceData: InvoiceEntry = new InvoiceEntry();
  isViewInvoice: boolean = false;

  rowData: any[] = [];
  tabs: any[] = [
    {
      label: 'This Week',
      colDefsUrl: 'fscm/transactions/cancelInvoice/private/colDefs',
      rowDefsUrl: 'fscm/transactions/cancelInvoice/private/getThisWeekInvoices',
      count: null,
    },
    {
      label: 'This Month',
      colDefsUrl: 'fscm/transactions/cancelInvoice/private/colDefs',
      rowDefsUrl: 'fscm/transactions/cancelInvoice/private/getThisMonthInvoices',
      count: null,
    },
    {
      label: 'This Year',
      colDefsUrl: 'fscm/transactions/cancelInvoice/private/colDefs',
      rowDefsUrl: 'fscm/transactions/cancelInvoice/private/getThisYearInvoices',
      count: null,
    },
  ];

  activeTab: any;

  gridOptions: any = {
    rowSelection: 'multiple',
    rowModelType: 'clientSide',
  };

  entityName: string = 'CANCEL_INVOICE';

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Cancel Invoice - Initiate',
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
      { label: 'FSCM' },
      { label: 'Transactions' },
      { label: ' Cancel Invoice' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.fetchTabCounts(); // Fetch counts for tabs

    this.getData(this.tabs[0]);

    this.loadingGrid = false;
  }

  fetchTabCounts(): void {
    this.tabs.forEach((tab, index) => {
      const data = { dataMap: { filters: [] } };

      this.httpService.httpPost(tab.rowDefsUrl, data).subscribe(
        (response: any) => {
          // Update the count dynamically for the tab
          this.tabs[index].count = response.count || '0';
        },
        (error) => {
          console.error(`Error fetching count for tab: ${tab.label}`, error);
        }
      );
    });
  }

  getRecords(filters: any) {
    this.searchFilters = filters;
    this.getSearchResults();
  }

  clearSearch() {
    this.searchFilters = [];
    this.getData(this.tabs[0]);
  }

  onDynamicFiltersReady() { }

  getCriteriaList() { }

  getSearchResults() {
    this.loadingGrid = true;
    this.activeTab = {
      label: 'Search Results',
      colDefsUrl: 'fscm/transactions/cancelInvoice/private/colDefs',
      rowDefsUrl: 'fscm/transactions/cancelInvoice/private/getSearchedInvoices',
      count: '0',
    };

    const data = { dataMap: { filters: this.searchFilters } };

    this.httpService.httpPost(this.activeTab.rowDefsUrl, data).subscribe((response: any) => {
      this.rowData = response.data;

      this.loadingGrid = false;
    });
  }

  getData(activeTab: any) {
    this.loadingGrid = true;

    this.activeTab = activeTab;
    const data = { dataMap: { filters: [] } };
    this.httpService.httpPost(activeTab.rowDefsUrl, data).subscribe((response: any) => {
      this.rowData = response.data;

      this.loadingGrid = false;
      this.loading = false;
    });
  }

  onRowSelected(rowData: any) {
    if (rowData.node.selected) {
      this.dataForAction.push(rowData.data);
    } else {
      const index = this.dataForAction.findIndex((data: any) => data.id === rowData.data.id);

      if (index >= 0) {
        this.dataForAction.splice(index, 1);
      }
    }
  }

  onCancel() {
    this.httpService
      .httpPost('fscm/transactions/cancelInvoice/private/cancelInvoices', {
        dataMap: {
          data: this.singleDataForAction.length > 0 ? this.singleDataForAction : this.dataForAction,
          remark: this.remarkInput,
        },
      })
      .subscribe((response: any) => {
        this.dataForAction = [];
        this.singleDataForAction = [];
        this.remarkInput = '';
        this.isShowInputRemark = false;

        this.getData(this.activeTab);
      });
  }

  onView(id: string) {
    this.httpService
      .httpPost('fscm/transactions/cancelInvoice/private/getAuthorizedAcceptedInvoice', {
        dataMap: { id },
      })
      .subscribe((data: any) => {
        this.viewInvoiceData = data;
        this.isViewInvoice = true;
      });
  }

  resetViewInvoice() {
    this.viewInvoiceData = new InvoiceEntry();
    this.isViewInvoice = false;
  }

  onCancelInvoice(id: string) {
    const data = this.rowData.find((d: any) => d.id == id);
    if (data) {
      this.singleDataForAction.push(data);
      this.isShowInputRemark = true;
    }
  }
}
