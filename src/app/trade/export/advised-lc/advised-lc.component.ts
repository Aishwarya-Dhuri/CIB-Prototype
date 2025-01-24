import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

const defaultReqModel = {
  startRow: 0,
  endRow: 1,
  rowGroupCols: [],
  valueCols: [],
  pivotCols: [],
  pivotMode: false,
  groupKeys: [],
  filterModel: {},
  sortModel: [],
  entityName: '',
};

@Component({
  selector: 'app-advised-lc',
  templateUrl: './advised-lc.component.html',
  styleUrls: ['./advised-lc.component.scss'],
})
export class AdvisedLcComponent implements OnInit {
  @ViewChild('listingGrid') listingGrid: AgGridListingComponent;

  loading: boolean;
  mode: string = '';
  searchFilters: any[] = [];
  viewDetails: any[] = [];
  isShowSearch: boolean = false;
  rejectId: string

  context: any = { componentParent: this };
  frameworkComponents: any = {};
  gridOptions: any = {
    // rowModelType: 'clientSide',
  };

  getAdvisedLcList: any[] = [];
  getRejectedLcList: any[] = [];

  entityName: string = 'ADVISED_LC';

  tabs: any[] = [];
  selectedTab: any;

  isView: boolean = false;
  isReject: boolean = false;
  rejectReason: string = '';
  isSubmit: boolean = false;
  updateGrid: any;

  constructor(
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const actions: Actions = {
      heading: 'Advised LC - Initiate',
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
      { label: 'Trade' },
      { label: 'Export' },
      { label: ' Advised LC' },
      { label: 'View' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.httpService
      .httpPost(
        'trade/exportTransactions/advisedLc/private/getAdvisedLcListingTabs',
        defaultReqModel,
      )
      .subscribe((response: any) => {
        this.tabs = response.tabs;
        this.selectedTab = this.tabs[0];
        this.loading = false;
      });
  }

  getRecords(filters: any): void {
    this.isShowSearch = false;
    this.searchFilters = filters;

    const index: number = this.tabs.findIndex((tab: any) => tab.id == 'searchResults');

    if (filters.length > 0) {
      this.httpService
        .httpPost(
          'trade/exportTransactions/advisedLc/private/getAdvisedLcSearchResultTab',
          defaultReqModel,
        )
        .subscribe((response: any) => {
          if (index >= 0) {
            this.tabs[index] = response.searchResultTab;
          } else {
            this.tabs.push(response.searchResultTab);
          }

          this.selectedTab = this.tabs[2];
        });
    } else {
      if (index >= 0) {
        this.selectedTab = this.tabs[0];
        this.tabs.splice(index, 1);
      }
    }
  }

  removeSearchFilter() {
    const index: number = this.tabs.findIndex((tab: any) => tab.id == 'searchResults');

    if (index >= 0) {
      this.selectedTab = this.tabs[0];
      this.searchFilters = [];
      this.tabs.splice(index, 1);
    }
  }

  onDynamicFiltersReady() { }

  getCriteriaList() { }

  view(lcNumber: string): void {
    this.rejectId = lcNumber
    const data = { dataMap: { id: lcNumber } };
    this.httpService.httpPost('trade/importTransactions/letterOfCredit/private/view', data)
      .subscribe((response: any) => {
        this.viewDetails = response;
        this.isView = true;
      })

    this.viewService.setId(lcNumber);
    this.viewService.setMode('VIEW');
  };

  reject() {
    this.isReject = true;
  };

  onSubmit() {
    setTimeout(() => {
      this.isSubmit = true;
      this.isReject = false;
      this.rejectReason = ''
    }, 2000);
  };


  onOk() {
    this.isSubmit = false
    this.selectedTab = this.tabs[1];
  };

}
