import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';
import { PoEntry } from '../po-entry/@model/po-entry.model';

@Component({
  selector: 'app-po-acceptance',
  templateUrl: './po-acceptance.component.html',
  styleUrls: ['./po-acceptance.component.scss']
})
export class PoAcceptanceComponent implements OnInit {
  @ViewChild('listing') listing: AgGridListingComponent;

  loading: boolean;
  loadingGrid: boolean;
  mode: string = '';

  searchFilters: any[] = [];

  dataForAction: any[] = [];
  singleDataForAction: any[] = [];

  remarkInput: string = '';

  viewInvoiceData: PoEntry = new PoEntry();
  isViewInvoice: boolean = false;

  isShowSearch: boolean = false;
  isShowInputRemark: boolean = false;
  isAccepted: boolean = false;
  context: any = { componentParent: this };

  rowData: any[] = [];
  tabs: any[] = [
    {
      label: 'Recent Invoices',
      colDefsUrl: 'fscm/transactions/poAcceptance/private/colDefs',
      rowDefsUrl: 'fscm/transactions/poAcceptance/private/getRecentInvoices',
      count: '0',
    },
    {
      label: 'Near Dues',
      colDefsUrl: 'fscm/transactions/poAcceptance/private/colDefs',
      rowDefsUrl: 'fscm/transactions/poAcceptance/private/getNearDueInvoices',
      count: '0',
    },
  ];

  activeTab: any;

  gridOptions: any = {
    rowSelection: 'multiple',
    rowModelType: 'clientSide',
  };

  entityName: string = 'SPONSOR_INVOICE_ACCEPTANCE';

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
      heading: 'PO Acceptance - Initiate',
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
      { label: ' PO Acceptance' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getData(this.tabs[0]);

    this.loadingGrid = false;
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
      colDefsUrl: 'fscm/transactions/poAcceptance/private/colDefs',
      rowDefsUrl: 'fscm/transactions/poAcceptance/private/getSearchedInvoices',
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
      const tabToUpdate = this.tabs.find(tab => tab.label === activeTab.label);
      if (tabToUpdate) {
        tabToUpdate.count = response.data?.length || 0;
      }
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

  onAccept() {
    this.httpService
      .httpPost('fscm/transactions/poAcceptance/private/acceptInvoices', {
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

  onCloseModal() {
    this.isShowInputRemark = false;
    this.remarkInput = '';
    this.singleDataForAction = [];
  }

  onReject() {
    this.httpService
      .httpPost('fscm/transactions/poAcceptance/private/rejectInvoices', {
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
      .httpPost('fscm/transactions/poAcceptance/private/getAuthorizedInvoice', {
        dataMap: { id },
      })
      .subscribe((data: any) => {
        this.viewInvoiceData = data;
        this.isViewInvoice = true;
      });
  }

  resetViewInvoice() {
    this.viewInvoiceData = new PoEntry();
    this.isViewInvoice = false;
  }

  onAcceptInvoice(id: string) {
    const data = this.rowData.find((d: any) => d.id == id);
    if (data) {
      this.singleDataForAction.push(data);
      this.isAccepted = true;
      this.isShowInputRemark = true;
    }
  }

  onRejectInvoice(id: string) {
    const data = this.rowData.find((d: any) => d.id == id);

    if (data) {
      this.singleDataForAction.push(data);
      this.isAccepted = false;
      this.isShowInputRemark = true;
    }
  }

}
