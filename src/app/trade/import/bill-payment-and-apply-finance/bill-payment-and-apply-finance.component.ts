import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BillStatusRendererComponent } from './@components/bill-status-renderer';
import { BillPaymentAndApplyFinanceService } from './@services/bill-payment-and-apply-finance.service';

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
  selector: 'app-bill-payment-and-apply-finance',
  templateUrl: './bill-payment-and-apply-finance.component.html',
  styleUrls: ['./bill-payment-and-apply-finance.component.scss'],
})
export class BillPaymentAndApplyFinanceComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  billsCategory: string = 'Bills With LC';

  entityName: string = 'BILLS_WITH_LC_BILL_PAYMENT_AND_APPLY_FINANCE';

  loading: boolean = false;

  searchFilters: any[] = [];

  tabs: any[] = [];
  selectedTab: any;
  isShowSearch: boolean = false;

  gridOptions = {
    suppressRowClickSelection: true,
  };

  frameworkComponents: any = {
    billStatusRenderer: BillStatusRendererComponent,
  };

  billDetails: any;

  isShowView: boolean = false;

  isInitiate: boolean = false;

  mode: string = '';

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private billPaymentAndApplyFinanceService: BillPaymentAndApplyFinanceService,
    private viewService: ViewService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Bill Payment and Apply Finance',
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
      { label: 'Bill Payment and Apply Finance' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      this.isInitiate = true;
      this.loading = false;
    } else {
      this.httpService
        .httpPost('trade/importTransactions/billPaymentAndApplyFinance/private/getListingTabs')
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
      this.entityName = 'BILLS_WITH_LC_BILL_PAYMENT_AND_APPLY_FINANCE';
    } else {
      this.entityName = 'BILLS_WITHOUT_LC_BILL_PAYMENT_AND_APPLY_FINANCE';
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
          'trade/importTransactions/billPaymentAndApplyFinance/private/getBillPAymentApplyFinanceSearchResultTab',
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
      .httpPost('trade/importTransactions/billPaymentAndApplyFinance/private/getViewData', {
        dataMap: { id },
      })
      .subscribe((response: any) => {
        this.billDetails = response.data;
        this.isShowView = true;
      });
  }

  create(id: string): void {
    this.isInitiate = true;
    this.billPaymentAndApplyFinanceService.billId = id;
  }
}
