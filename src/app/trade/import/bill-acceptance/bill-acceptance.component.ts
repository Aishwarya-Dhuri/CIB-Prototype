import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BillAcceptance } from './@models/bill-acceptance.model';
import { BillAcceptanceService } from './@services/bill-acceptance.service';

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
  selector: 'app-bill-acceptance',
  templateUrl: './bill-acceptance.component.html',
  styleUrls: ['./bill-acceptance.component.scss'],
})
export class BillAcceptanceComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;
  @ViewChild('billAcceptanceGrid') billAcceptanceGrid: any;

  formData: BillAcceptance = new BillAcceptance();

  billsCategory: string = 'Bills With LC';

  entityName: string = 'BILLS_WITH_LC_BILL_ACCEPTANCE';

  loading: boolean = false;

  searchFilters: any[] = [];

  tabs: any[] = [];
  selectedTab: any;
  isShowSearch: boolean = false;
  isRejectReasonView: boolean = false;

  selectedRows: any = [];
  selectedRowIds: any = [];

  gridOptions = {
    suppressRowClickSelection: true,
    rowSelection: 'multiple',
  };

  billDetails: any;

  isShowView: boolean = false;
  isInitiate: boolean = false;
  isLcDetailsShow: boolean = false;

  mode: string = '';

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private billAcceptanceService: BillAcceptanceService,
    private viewService: ViewService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Bill Acceptance',
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
      { label: 'Trade' },
      { label: 'Import' },
      { label: 'Bill Acceptance' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      this.isInitiate = true;
      this.loading = false;
    } else {
      this.httpService
        .httpPost('trade/importTransactions/billAcceptance/private/getListingTabs')
        .subscribe((response: any) => {
          this.tabs = response.data;

          this.selectedTab = this.tabs[0];

          this.loading = false;
        });
    }
  }

  onBillCategorySelected(billCategory: string): void {
    this.loading = true;
    if (billCategory === 'Bills With LC') {
      this.entityName = 'BILLS_WITH_LC_BILL_ACCEPTANCE';
    } else {
      this.entityName = 'BILLS_WITHOUT_LC_BILL_ACCEPTANCE';
    }
    setTimeout(() => {
      this.loading = false;
    });
  }

  onDynamicFiltersReady(): void {
    this.searchFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }

  search(filters: any[]): void {
    this.isShowSearch = false;
    this.searchFilters = filters;
    const index: number = this.tabs.findIndex((tab: any) => tab.id == 'searchResults');

    if (filters.length > 0) {
      this.httpService
        .httpPost(
          'trade/importTransactions/billAcceptance/private/getBillAcceptanceSearchResultTab',
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

  view(id: string): void {
    this.httpService
      .httpPost('trade/importTransactions/billAcceptance/private/getViewData', {
        dataMap: { id },
      })
      .subscribe((response: any) => {
        this.billDetails = response.data;
        this.isShowView = true;
      });
  }

  refresh() {
    this.resetRowSelections();
    this.billAcceptanceGrid.refreshGridList();
  }

  rowSelected(event: any): void {
    this.resetRowSelections();
    this.selectedRows = this.billAcceptanceGrid.getSelectedRows();
    this.selectedRows.forEach((row) => {
      this.selectedRowIds.push(row.id);
    });
  }

  resetRowSelections() {
    this.selectedRows = [];
    this.selectedRowIds = [];
  }

  accept(id: string): void {
    this.billAcceptanceService.billId = id;
    this.isInitiate = true;
  }

  reject(id: string): void {
    this.isRejectReasonView = true;
  }

  onRejectAllClick(): void {
    this.isRejectReasonView = true;
  }

  onAcceptAllClick(): void {
    this.billAcceptanceService.billIds = this.selectedRowIds;
    this.isInitiate = true;
  }

  onLinkClick(lcNumber: string) {
    this.isLcDetailsShow = true;
    this.viewService.setId(lcNumber);
    this.viewService.setMode('VIEW');
  }
}
