import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';
import { LinkActionRendererComponent } from './@components/link-action-renderer/link-action-renderer.component';

@Component({
  selector: 'app-positive-pay',
  templateUrl: './positive-pay.component.html',
  styleUrls: ['./positive-pay.component.scss'],
})
export class PositivePayComponent implements OnInit {
  @ViewChild('listing') listing: AgGridListingComponent;

  loading: boolean;
  loadingGrid: boolean;
  mode: string = '';

  searchFilters: any[] = [];

  dataForAction: any[] = [];
  singleDataForAction: any[] = [];

  remarkInput: string = '';

  isShowSearch: boolean = false;
  isShowEnrichment: boolean = false;
  isShowCheque: boolean = false;
  isShowInputRemark: boolean = false;
  isApprove: boolean = false;

  isViewCheque: boolean = false;
  viewCheque: any;

  context: any = { componentParent: this };

  rowData: any[] = [];

  tabs: any[] = [
    {
      id: 'recentCheques',
      label: 'Recent Cheques',
      colDefsUrl: 'positivePay/transactions/positivePay/private/positivePayRecentDataColDefs',
      rowDefsUrl: 'positivePay/transactions/positivePay/private/getRecentCheques',
      count: '0',
    },
    {
      id: 'approvedCheques',
      label: 'Approved Cheques',
      colDefsUrl: 'positivePay/transactions/positivePay/private/positivePayColDefs',
      rowDefsUrl: 'positivePay/transactions/positivePay/private/getApprovedCheques',
      count: '0',
    },
    {
      id: 'disapprovedCheques',
      label: 'Disapproved Cheques',
      colDefsUrl: 'positivePay/transactions/positivePay/private/positivePayColDefs',
      rowDefsUrl: 'positivePay/transactions/positivePay/private/getDisapprovedCheques',
      count: '0',
    },
  ];

  activeTab: any;

  frameworkComponents: any = {
    linkActionRenderer: LinkActionRendererComponent,
  };

  gridOptions: any = {
    rowSelection: 'multiple',
    rowModelType: 'clientSide',
  };

  entityName: string = 'POSITIVE_PAY';

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Positive Pay - Initiate',
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
      { label: 'Positive Pay' },
      { label: 'Transactions' },
      { label: ' Positive Pay' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.httpService
      .httpPost('positivePay/transactions/positivePay/private/getPositivePayTabs')
      .subscribe((res: any) => {
        this.tabs = res.data;

        this.getData(this.tabs[0]);

        this.loading = false;
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

  onDynamicFiltersReady() {}

  getCriteriaList() {}

  getSearchResults() {
    this.loadingGrid = true;
    this.activeTab = {
      label: 'Search Results',
      colDefsUrl: 'positivePay/transactions/positivePay/private/positivePayRecentDataColDefs',
      rowDefsUrl: 'positivePay/transactions/positivePay/private/getSearchedCheques',
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
      if (activeTab.id == this.tabs[0].id) {
        this.gridOptions.rowSelection = 'multiple';
      } else {
        this.gridOptions.rowSelection = 'none';
      }

      this.dataForAction = [];

      this.rowData = response.data;

      this.loadingGrid = false;
      this.loading = false;
    });
  }

  onRowSelected(rowData: any) {
    if (this.activeTab.label != this.tabs[0].label) {
      return;
    }

    if (rowData.node.selected) {
      this.dataForAction.push(rowData.data);
    } else {
      const index = this.dataForAction.findIndex((data: any) => data.id === rowData.data.id);

      if (index >= 0) {
        this.dataForAction.splice(index, 1);
      }
    }
  }

  onApproved() {
    this.httpService
      .httpPost('positivePay/transactions/positivePay/private/approveCheques', {
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

  onDisapproved() {
    this.httpService
      .httpPost('positivePay/transactions/positivePay/private/disapproveCheques', {
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
      .httpPost('positivePay/transactions/positivePay/private/getChequeData', {
        dataMap: { id, activeTab: this.activeTab.id },
      })
      .subscribe((res: any) => {
        this.viewCheque = res.data;

        this.isViewCheque = true;
      });
  }

  onCancelViewCheque() {
    this.isViewCheque = false;
    this.viewCheque = null;
  }

  onAccept(id: string) {
    const data = this.rowData.find((d: any) => d.id == id);
    if (data) {
      this.singleDataForAction.push(data);
      this.isApprove = true;
      this.isShowInputRemark = true;
    }
  }

  onReject(id: string) {
    const data = this.rowData.find((d: any) => d.id == id);
    if (data) {
      this.singleDataForAction.push(data);
      this.isApprove = false;
      this.isShowInputRemark = true;
    }
  }

  onShowCheque(id: string) {
    this.isShowCheque = true;
  }

  onEnrichments(id: string) {
    this.isShowEnrichment = true;
  }
}
