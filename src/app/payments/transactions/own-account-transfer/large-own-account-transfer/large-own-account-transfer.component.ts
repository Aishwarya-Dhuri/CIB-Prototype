import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Select } from 'src/app/shared/@models/select.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { OatQuickPay } from '../@model/oat-quick-pay.model';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { ChartComponent } from 'src/app/shared/@components/chart/chart.component';
import { ToasterService } from 'src/app/shared/@services/toaster.service';

@Component({
  selector: 'app-large-own-account-transfer',
  templateUrl: './large-own-account-transfer.component.html',
  styleUrls: ['./large-own-account-transfer.component.scss'],
})
export class LargeOwnAccountTransferComponent implements OnInit {
  @ViewChild('topFiveHighestOatDebitCorporateChart')
  topFiveHighestOatDebitCorporateChart!: ChartComponent;

  @ViewChild('listing') listing!: AgGridListingComponent;

  loading!: boolean;
  isShowQuickPaySuccess: boolean = false;
  showCorporateAccounts: boolean = false;
  showAnalytics: boolean = false;

  transactionsListTypes: any[] = [];
  searchText: string = '';
  listType = 'grid';
  timeDuration: string = 'week';

  corporateAccountsData: any[] = [];

  quickPaySuccessData!: any;
  currencyName!: string;
  selectedList!: any;
  quickPay!: OatQuickPay;
  viewport!: string;

  listingContext: any = { componentParent: this };

  allCardListData: any = [];
  cardListData: any = [];
  currentCardPage: number = 1;

  isGroupUser: boolean = false;

  timeDurationOptions: Select[] = [
    { id: 'week', displayName: 'This Week', enrichments: [] },
    { id: 'month', displayName: 'This Month', enrichments: [] },
    { id: 'today', displayName: 'Today', enrichments: [] },
  ];

  widgetOptions: any = {
    topFiveHighestOatDebitCorporates: {
      timeDuration: 'week',
      currency: '',
      options: {
        data: [],
        xKey: 'xLabel',
        xLabel: 'Corporates',
        yKeys: ['yLabel0'],
        yLabels: ['Debit Amount'],
        chartType: 'column',
        chartShadow: false,
        categoryAxesPosition: 'bottom',
        categoryAxesTitle: '',
        categoryAxesRotationAngle: '',
        numberAxesPosition: ['left'],
        numberAxesTitle: [''],
        numberAxesRotationAngle: [''],
        showLegend: false,
      },
    },
    corporateToCorporateTotalOat: {
      timeDuration: 'week',
      currency: '',
      fromCorporate: '',
      toCorporate: '',
      totalTransactionValue: 0,
    },
    transactionStatus: {
      timeDuration: 'week',
      timeDurationDisplayName: 'This Week',
      totalTransactionValue: 0,
      totalTransactions: 0,
      completed: 0,
      pending: 0,
      rejected: 0,
    },
  };

  groupData!: any;

  corporateAccountGridOptions: any = {
    rowModelType: 'clientSide',
    treeData: true,
    autoGroupColumnDef: {
      headerName: 'Corporate Name',
      cellRendererParams: { suppressCount: true },
    },
    getDataPath: function (data: any) {
      return data.corporateName;
    },
  };

  constructor(
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private router: Router,
    private menuService: MenuService,
    private viewportService: ViewportService,
    private userService: UserService,
    private currencyService: CurrencyService,
    private toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    /* remove below : starts */
    const actions: Actions = {
      heading: 'Own Account Transfer',
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
      { label: 'Own Account Transfer' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.httpService
      .httpPost('payments/transactions/ownAccountTransfer/private/getGroupCorporateAccounts')
      .subscribe((response: any) => {
        this.corporateAccountsData = response.data;
      });

    this.getTransactionStatus();

    if (this.isGroupUser) {
      this.getTopFiveHighestOatDebitCorporates();
    }

    this.httpService
      .httpPost('payments/transactions/ownAccountTransfer/private/getTransactionListTypes')
      .subscribe((response: any) => {
        this.transactionsListTypes = response.data;
        this.selectedList = this.transactionsListTypes[0];

        this.loading = false;
      });

    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
    });

    this.resetQuickPayForm();

    this.currencyService.getCurrency().subscribe((currency: Select) => {
      if (currency) {
        this.quickPay.currencyId = currency.id;
        this.quickPay.currencyName = currency.displayName;
        this.currencyName = currency.displayName + ' ';
      }
    });

    this.onListTypeChange(this.listType);

    if (this.isGroupUser) {
      this.httpService
        .httpPost('payments/transactions/ownAccountTransfer/private/getGroupDashboardData')
        .subscribe((response: any) => {
          this.groupData = response.data;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onTransactionStatusTimeDuration(value: Select) {
    this.widgetOptions.transactionStatus.timeDurationDisplayName = value.displayName;
    this.getTransactionStatus();
  }

  getTransactionStatus() {
    this.httpService
      .httpPost('payments/transactions/ownAccountTransfer/private/getTransactionStatus', {
        dataMap: { timeDuration: this.widgetOptions.transactionStatus.timeDuration },
      })
      .subscribe((response: any) => {
        this.widgetOptions.transactionStatus = {
          ...this.widgetOptions.transactionStatus,
          ...response.data,
        };
      });
  }

  onCorporateToCorporateTotalOatTimeDuration(value: Select) {}

  getCorporateToCorporateTotalOat() {
    const fromCorporate = this.widgetOptions.corporateToCorporateTotalOat.fromCorporate;
    const toCorporate = this.widgetOptions.corporateToCorporateTotalOat.toCorporate;

    if (fromCorporate && toCorporate) {
      this.httpService
        .httpPost(
          'payments/transactions/ownAccountTransfer/private/getCorporateToCorporateTotalOat',
          {
            dataMap: {
              fromCorporate,
              toCorporate,
            },
          },
        )
        .subscribe((response: any) => {
          this.widgetOptions.corporateToCorporateTotalOat.totalTransactionValue =
            response.data.totalTransactionValue;
        });
    }
  }

  swipeCorporateToCorporateTotalOat() {
    const tempCorporate = this.widgetOptions.corporateToCorporateTotalOat.fromCorporate;
    this.widgetOptions.corporateToCorporateTotalOat.fromCorporate =
      this.widgetOptions.corporateToCorporateTotalOat.toCorporate;
    this.widgetOptions.corporateToCorporateTotalOat.toCorporate = tempCorporate;
    this.getCorporateToCorporateTotalOat();
  }

  onTopFiveHighestOatDebitCorporatesTimeDuration(value: Select) {
    this.getTopFiveHighestOatDebitCorporates();
  }

  getTopFiveHighestOatDebitCorporates() {
    this.httpService
      .httpPost(
        'payments/transactions/ownAccountTransfer/private/getTopFiveHighestOATDebitCorporates',
        {
          dataMap: {
            timeDuration: this.widgetOptions.topFiveHighestOatDebitCorporates.timeDuration,
          },
        },
      )
      .subscribe((response: any) => {
        this.widgetOptions.topFiveHighestOatDebitCorporates.options.data = response.data;
        this.topFiveHighestOatDebitCorporateChart?.refreshChart();
      });
  }

  resetQuickPayForm(): void {
    this.quickPay = new OatQuickPay();
    this.quickPay.valueDate = this.userService.getApplicationDate();
  }

  onQuickPaySubmit() {
    // API call for Quick Pay then below
    this.isShowQuickPaySuccess = true;
  }

  onDebitAccountChange(selectedAccount: Select): void {
    this.quickPay.debitAccountName = selectedAccount.displayName;
  }

  onCreditAccountChange(selectedAccount: Select): void {
    this.quickPay.creditAccountName = selectedAccount.displayName;
  }

  onPaymentMethodChange(selectedPaymentMethod: Select): void {
    this.quickPay.paymentMethodName = selectedPaymentMethod.displayName;
  }

  onPaymentMethodWiseClick() {
    this.router.navigateByUrl(this.router.url + '/initiate', {
      state: { initiateMode: 'PAYMENTMETHODWISE' },
    });
  }

  onCreditAccountSelectionClick() {
    this.router.navigateByUrl(this.router.url + '/initiate', {
      state: { initiateMode: 'CREDITACCOUNTWISE' },
    });
  }

  selectListing(list: any) {
    this.selectedList = list;
    this.onListTypeChange(this.listType);
  }

  onListTypeChange(listType: string) {
    this.listType = listType;
    this.currentCardPage = 1;
    this.showAnalytics = false;
    if (this.listType === 'card') {
      this.cardListData = [];
      this.httpService.httpPost(this.selectedList.cardDataUrl).subscribe((response) => {
        this.allCardListData = response.data;
        if (response.totalRecords > 0) {
          this.cardListData = this.allCardListData.slice(0, 8);
        } else {
          this.cardListData = this.allCardListData;
        }
      });
    } else if (this.listing) {
      this.listing.refreshGridList();
    }
  }

  changeCardPage(pageNumber: number) {
    const start = (pageNumber - 1) * 8;
    if (pageNumber < 1 || start > this.allCardListData.length) return;
    const last =
      pageNumber * 8 > this.allCardListData.length ? this.allCardListData.length : pageNumber * 8;
    this.cardListData = this.allCardListData.slice(start, last);
    this.currentCardPage = pageNumber;
  }

  performGridOperation(actionName: string, id: string) {
    alert('Performing ' + actionName + ' with id : ' + id);
  }

  navigateToInitiate(): void {
    if (this.userService.userDetails.corporateType == 'L')
      this.router.navigateByUrl(this.menuService.getSelectedServiceUrl() + '/initiate');
    else this.router.navigateByUrl(this.menuService.getSelectedServiceUrl());
  }

  useDraft(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('DRAFT');
    this.navigateToInitiate();
  }

  delete(id: string): void {
    const req = { dataMap: { ids: id } };
    this.httpService
      .httpPost('payments/transactions/ownAccountTransfer/private/delete', req)
      .subscribe((response) => {
        this.toasterService.showToaster({
          severity: 'success',
          detail: 'Delete Successfully',
        });
      });
  }
}
