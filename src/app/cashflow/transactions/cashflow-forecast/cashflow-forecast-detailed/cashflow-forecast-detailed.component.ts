import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { CashflowForecastActionRendererComponent } from '../@components/cashflow-forecast-action-renderer/cashflow-forecast-action-renderer.component';
import { CashflowForecastMonthLinkRendererComponent } from '../@components/cashflow-forecast-month-link-renderer/cashflow-forecast-month-link-renderer.component';
import { CashflowForecastService } from '../@services/@services/cashflow-forecast.service';
import * as moment from 'moment';
import { Select } from 'src/app/shared/@models/select.model';
import { ScrollService } from 'src/app/shared/@services/scroll.service';

@Component({
  selector: 'app-cashflow-forecast-detailed',
  templateUrl: './cashflow-forecast-detailed.component.html',
  styleUrls: ['./cashflow-forecast-detailed.component.scss']
})
export class CashflowForecastDetailedComponent implements OnInit {
  @ViewChild('transactionsGrid') transactionsGrid: AgGridListingComponent;
  @ViewChild('summaryListContainer', { read: ElementRef })
  public summaryListContainer: ElementRef<any>;

  loading: boolean = true;
  loadingGrid: boolean = false;
  isDeleteConfirm: boolean = false;

  cashInflowDistributionOptions: any;
  cashOutflowDistributionOptions: any;

  forecastPeriod: any;

  isShowCashFlowForecastOverview: boolean = false;
  isShowMoreOptions: boolean = false;
  isShowEditOccurrence: boolean = false;
  selectedList: string = 'transactions';

  moreActionsStyle: any = {};

  moreActionsRowData: any;

  cashflowColumnDefs: any[] = [];

  frameworkComponents = {
    moreActionsRenderer: CashflowForecastActionRendererComponent,
    cashflowForecastMonthLinkRenderer: CashflowForecastMonthLinkRendererComponent,
  };

  cashflowTransactionsColDefs: string =
    'cashflow/transactions/cashflowForecastSummary/private/cashflowTransactionsColDefs';

  cashflowTransactionsRowData: any[] = [];
  cashflowIgnoredTransactionsRowData: any[] = [];
  rowData: any[] = [];

  gridOptions: any = {
    rowModelType: 'clientSide',
    treeData: true,
    autoGroupColumnDef: {
      headerName: 'Source',
      width: 250,
      cellRendererParams: { suppressCount: true },
    },
    getDataPath: function (data) {
      return data.source;
    },
  };

  showMonthlyCashflowGrid: boolean = false;
  monthlyCashflowGridData: any[] = [];

  insights: any[] = [];

  cashFlowForecastOverviewColDefUrl: string =
    'accountServices/services/cashFlowForcast/private/cashflowForecastOverviewColDefs';

  accountData: any;

  accountsDataList: any[] = [];
  // summaryListData = []
  selectedAccount: any;

  currency: string = '';

  forecastPeriodOptions: any[] = [
    { id: 'This Week', displayName: 'This Week' },
    { id: 'This Month', displayName: 'This Month' },
    { id: 'Custom', displayName: 'Custom' },
  ];
  selectedForecastPeriodOptions: string = this.forecastPeriodOptions[1].id;

  viewport: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private cashflowForecastService: CashflowForecastService,
    private currencyPipe: CurrencyPipe,
    private viewportService: ViewportService,
    private currencyService: CurrencyService,
    private scrollService: ScrollService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Cashflow Forecast - Detailed',
      subHeading: null,

      refresh: true,

      download: true,
      print: true,
      relationshipManager: true,
      quickLinks: true
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Cashflow Forecast' },
      { label: 'Summary' }
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.forecastPeriod = this.cashflowForecastService.forecastPeriod;

    // this.selectedForecastPeriodOptions = this.cashflowForecastService.selectedForecastPeriodOption;

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });

    this.currency = this.cashflowForecastService.selectedCurrency;

    if (!this.currency) {
      this.currencyService.getCurrencyName().subscribe((currency: string) => {
        this.currency = currency;
      });
    }


    this.accountData = this.accounts
    this.accountData.accountDesc = 'Business Checking Account'
    this.accountData.totalCashInFlow = 200000
    this.accountData.totalCashOutFlow = 100000
    this.accountData.totalNetInFlow = 100000
    this.accountData.thistotalPayable = 600000
    this.accountData.thistotalReceivable = 950000
    this.accountData.unclearBalance = 1500
    this.accountData.openingBalance = 400000
    this.accountData.closingBalance = 600000

    this.cashflowTransactionsRowData = this.cashflowForecastService.cashflowTransactionsRowData;
    this.cashflowIgnoredTransactionsRowData =
      this.cashflowForecastService.cashflowIgnoredTransactionsRowData;
    // this.cashflowIgnoredTransactionsRowData = [];
    this.rowData = this.cashflowForecastService.cashflowTransactionsRowData;

    this.insights = this.cashflowForecastService.insights;

    this.accountsDataList = [];

    this.cashflowForecastService.accounts.forEach((account: any) => {
      this.accountsDataList.push({ id: account.accountNumber, displayName: account.accountNumber });
    });

    this.selectedAccount = this.accountsDataList[0].id;

    this.prepareChartData();

    this.setRowDataCurrency();

    this.loading = false;
    this.setCurrentMonth()
    this.updateDates();

    this.getCurrency();
    console.log("currency", this.currencyListFromApi);

  }

  currencyListFromApi: any[] = []

  getCurrency() {
    this.currencyService.getCurrencyList().subscribe((currencyList: Select[]) => {
      if (currencyList && currencyList.length > 0) {
        this.currencyListFromApi = currencyList;
      }
    });
  }


  // generateSummaryListData() {
  //   const currentDate = new Date();
  //   for (let i = 0; i < 6; i++) {
  //     const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
  //     const formattedMonth = nextMonth.toLocaleString('default', { month: 'short', year: 'numeric' });

  //     this.summaryListData.push({
  //       id: i + 1,
  //       date: formattedMonth,
  //       openingBalance: this.getRandomBalance(),
  //       closingBalance: this.getRandomBalance(),
  //     });
  //   }
  // }

  // getRandomBalance(): number {
  //   return Math.floor(Math.random() * 100000); // Example function to generate random balances
  // }


  accounts = [
    {
      accountBranch: "Down Town Branch",
      accountDesc: "Business Checking Account",
      accountNo: "777000003002",
      accountNumber: "777000003002-AED",
      accountTitle: "Business Checking Account",
      accountType: "CURRENT",
      active: "Y",
      amountApproved: 1575002,
      amountDisbursed: 152502,
      authorized: "Y",
      availableBalance: 5100000,
      balance: 15100000,
      bank: "CIMB",
      bankAccountType: "CONVENTIONAL",
      cashFlowForecastOverview: "Cash Flow",
      cashInFlowDistributionChartData: [],
      cashInFlowDistributionChartOptions: {
        data: [],
        labelKey: 'label',
        angleKey: 'value',
      },
      cashOutFlowDistributionChartData: [],
      cashOutFlowDistributionChartOptions: {
        data: [],
        labelKey: 'label',
        angleKey: 'value',
      },
      cashflowAccount: "Y",
      cashflowChartData: [],
      cashflowChartOptions: {
        data: [],
      },
      cashflowData: [],
      cashflowGridData: [],
      checkedBy: "adminchecker",
      checkedOn: 44140,
      checkedSysOn: 44525.6722800926,
      closingBalance: 57036,
      corporateAccountAlias: "Business Checking Account",
      country: "MYS",
      currencyCode: "USD",
      currencyId: 1,
      enabled: "Y",
      grantedDate: 44142,
      holdBalance: 200000,
      id: 1600,
      ladgerBalance: 850000,
      lastAction: "create Authorized",
      ledgerBalance: 5100000,
      maturityDate: 45968,
      modifiedAtOU: 11,
      modifiedBy: "adminmaker",
      modifiedOn: 44140,
      modifiedSysOn: 44525.6719791667,
      monthlyAvailableBalance: 1725000,
      mstId: 100083,
      odLimit: 700000,
      openingBalance: 54995,
      optionType: "Monthly",
      outstandingAmount: 10002,
      overdueAmount: 15002,
      product: "A",
      show: false,
      status: "Active",
      tenor: 77,
      totalCashInFlow: 222302,
      totalCashOutFlow: 239180,
      totalCreditBalance: "600000",
      totalDebitBalance: 950000,
      totalNetInFlow: 45267,
      totalPayable: 600000,
      totalReceivable: 950000,
      unclearBalance: 1500,
      version: 3
    }
  ];

  initialSummaryListData = [
    {
      id: 1,
      date: "",
      openingBalance: 400000,
      closingBalance: 600000,
    },
    {
      id: 2,
      date: "",
      openingBalance: 600000,
      closingBalance: 800000,
    },
    {
      id: 3,
      date: "",
      openingBalance: 800000,
      closingBalance: 1000000,
    },
    {
      id: 4,
      date: "",
      openingBalance: 1000000,
      closingBalance: 1200000,
    },
    {
      id: 5,
      date: "",
      openingBalance: 1200000,
      closingBalance: 1400000,
    },
    {
      id: 6,
      date: "",
      openingBalance: 1400000,
      closingBalance: 1600000,
    }
  ];

  updateDates(): void {
    const currentDate = new Date();
    this.initialSummaryListData.forEach((item, index) => {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + index, 1);
      item.date = nextMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    });
  }

  summaryListData = [...this.initialSummaryListData];

  public summaryListScrollRight(): void {
    this.scrollService.scrollLeft(this.summaryListContainer, 600);
  }

  public summaryListScrollLeft(): void {
    this.scrollService.scrollRight(this.summaryListContainer, 600);
  }


  setCurrentMonth() {
    const date = new Date(); // get current date
    const firstDay = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format(
      'DD-MMM-YYYY',
    );
    const lastDay = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format(
      'DD-MMM-YYYY',
    );
    this.forecastPeriod = [firstDay, lastDay];
  }

  onChangeForecastPeriodOption(fp: string, forecastPeriodCalender: any) {
    this.selectedForecastPeriodOptions = fp;
    this.cashflowForecastService.selectedForecastPeriodOption = fp;

    const date = new Date(); // get current date

    if (fp == this.forecastPeriodOptions[0].id) {
      const first = date.getDate() - date.getDay() + 1; // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6

      const firstDay = moment(new Date(date.setDate(first))).format('DD-MMM-YYYY');
      const lastDay = moment(new Date(date.setDate(last))).format('DD-MMM-YYYY');
      this.forecastPeriod = [firstDay, lastDay];
    } else if (fp == this.forecastPeriodOptions[1].id) {
      const firstDay = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format(
        'DD-MMM-YYYY',
      );
      const lastDay = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format(
        'DD-MMM-YYYY',
      );
      this.forecastPeriod = [firstDay, lastDay];
    } else {
      this.forecastPeriod = '';
      forecastPeriodCalender.showCalender();
    }

    this.loadingGridList();
  }

  prepareChartData() {
    this.accountData['cashflowSmallChartOptions'] = {
      data: [
        {
          month: 'Mar-2022',
          date: '15-Mar-2022',
          cashInFlow: 8111,
          cashOutFlow: 7458,
          netCashFlow: 5393,
          // Add any other properties here
        },
        {
          month: 'Apr-2022',
          date: '15-Apr-2022',
          cashInFlow: 3775,
          cashOutFlow: 7872,
          netCashFlow: 3017,
          // Add any other properties here
        },
        {
          month: 'Jun-2022',
          date: '15-Jun-2022',
          cashInFlow: 2438,
          cashOutFlow: 11518,
          netCashFlow: 2932,
          // Add any other properties here
        }
      ],
      padding: {
        top: 0,
        bottom: 0,
      },
      legend: {
        position: 'right',
        spacing: 2,
        layoutHorizontalSpacing: 16,
        layoutVerticalSpacing: 0,
        item: {
          marker: { shape: 'circle', size: 2 },
          label: {
            fontSize: 2,
          },
        },
      },
      series: [
        {
          type: 'column',
          xKey: 'month',
          yKeys: ['cashInFlow', 'cashOutFlow'],
          yNames: ['Cash Inflow', 'Cash Outflow'],
          marker: { enabled: true },
          grouped: true,
        },
        {
          type: 'line',
          xKey: 'month',
          yKey: 'netCashFlow',
          yName: 'Net Cashflow',
          lineTension: 2,
          marker: { enabled: true },
        },
        // {
        //   type: 'line',
        //   xKey: 'month',
        //   yKey: 'delta',
        //   yName: 'Delta',
        //   lineTension: 2,
        //   marker: { enabled: true },
        // },
        {
          type: 'line',
          xKey: 'month',
          yKey: 'lastYearNetCashFlow',
          yName: 'Last Year Net Cashflow',
          lineTension: 2,
          marker: { enabled: true },
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          label: {
            fontSize: 2,
          },
        },
        {
          type: 'number',
          position: 'left',
          tick: {
            count: 10,
          },
          label: {
            fontSize: 2,
          },
        },
      ],
    };
  }

  onMonthLinkClick(data: any) {
    this.monthlyCashflowGridData = data.data;
    this.showMonthlyCashflowGrid = true;
  }

  onChangeCurrency(currency: any) {
    this.summaryListData = this.initialSummaryListData.map(item => ({
      ...item
    }));
    let conversionRate = currency.enrichments.fxRateToBase || 1;
    const calculateWithConversion = (value: number) => value * conversionRate;
    this.accountData.totalCashInFlow = calculateWithConversion(200000);
    this.accountData.totalCashOutFlow = calculateWithConversion(100000);
    this.accountData.totalNetInFlow = calculateWithConversion(100000);
    this.accountData.thistotalPayable = calculateWithConversion(600000);
    this.accountData.thistotalReceivable = calculateWithConversion(950000);
    this.accountData.unclearBalance = calculateWithConversion(1500);
    this.accountData.openingBalance = calculateWithConversion(400000);
    this.accountData.closingBalance = calculateWithConversion(600000);
    this.summaryListData = this.summaryListData.map((item) => ({
      ...item,
      openingBalance: calculateWithConversion(item.openingBalance),
      closingBalance: calculateWithConversion(item.closingBalance)
    }));
    this.cashflowForecastService.selectedCurrency = currency.displayName;
    this.currency = currency.displayName;
    this.setRowDataCurrency();
  };


  setRowDataCurrency() {
    this.loadingGrid = true;

    this.cashflowTransactionsRowData = this.cashflowTransactionsRowData.map((data: any) => {
      return { ...data, currency: this.currency };
    });

    this.cashflowIgnoredTransactionsRowData = this.cashflowIgnoredTransactionsRowData.map(
      (data: any) => {
        return { ...data, currency: this.currency };
      },
    );

    this.rowData = this.rowData.map((data: any) => {
      return { ...data, currency: this.currency };
    });

    setTimeout(() => {
      this.loadingGrid = false;
    }, 100);
  }

  showMoreActions(top: number, left: number, rowData: any) {
    this.moreActionsStyle = {
      position: 'absolute',
      top: top + 'px',
      left: left - 101 + 'px',
      width: 'auto',
      'z-index': '11',
      padding: '0.5rem',
      'box-shadow': '0 0 10px #999',
    };

    this.moreActionsRowData = rowData;

    this.isShowMoreOptions = true;
  }

  addToIgnoreList() {
    this.cashflowIgnoredTransactionsRowData.push(this.moreActionsRowData);

    const i = this.cashflowTransactionsRowData.findIndex(
      (data: any) => data.id === this.moreActionsRowData.id,
    );

    if (i !== -1) {
      this.cashflowTransactionsRowData.splice(i, 1);
    }

    this.rowData = [...this.cashflowTransactionsRowData];
    this.transactionsGrid.setRowData(this.rowData);
    this.isShowMoreOptions = false;
    this.loadingGridList();
  }

  addToTransactionList() {
    this.cashflowTransactionsRowData.push(this.moreActionsRowData);

    const i = this.cashflowIgnoredTransactionsRowData.findIndex(
      (data: any) => data.id === this.moreActionsRowData.id,
    );

    if (i !== -1) {
      this.cashflowIgnoredTransactionsRowData.splice(i, 1);
    }

    this.rowData = [...this.cashflowIgnoredTransactionsRowData];
    this.transactionsGrid.setRowData(this.rowData);
    this.isShowMoreOptions = false;
    this.loadingGridList();
  }

  deletePermanently() {
    this.isDeleteConfirm = true;
    this.isShowMoreOptions = false
  }

  onConfirm() {
    const i = this.cashflowTransactionsRowData.findIndex(
      (data: any) => data.id === this.moreActionsRowData.id,
    );
    if (i !== -1) {
      this.cashflowTransactionsRowData.splice(i, 1);
    };
    this.rowData = [...this.cashflowTransactionsRowData];
    this.transactionsGrid.setRowData(this.rowData);

    this.isShowMoreOptions = false;
    this.isDeleteConfirm = false;
    this.loadingGridList();
  }

  onModifyOccurency() {
    const index = this.cashflowTransactionsRowData.findIndex(
      (data: any) => data.id === this.moreActionsRowData.id,
    );

    if (index !== -1) {
      const selectedRowData = this.cashflowTransactionsRowData[index];
      this.router.navigateByUrl('cashflow/transactions/manualForecastEntry', {
        state: { data: selectedRowData }
      });
    }
    this.isShowMoreOptions = false;
  };

  changeAccount(account: any) {
    this.loading = true;
    this.accountData = this.cashflowForecastService.getAccountInfo(account.id);

    this.prepareChartData();

    setTimeout(() => {
      this.loading = false;
    }, 100);
  }

  changeListing(list: string) {
    this.selectedList = list;
    if (list === 'transactions') {
      this.rowData = [...this.cashflowTransactionsRowData];
    } else {
      this.rowData = [...this.cashflowIgnoredTransactionsRowData];
    }

    this.transactionsGrid.setRowData(this.rowData);
    this.loadingGridList();
  }

  loadingGridList() {
    this.loadingGrid = true;

    setTimeout(() => {
      this.loadingGrid = false;
    }, 100);
  }

  applyCurrency = () => {
    this.cashInflowDistributionOptions.formatter = (params: any) => {
      return `${this.cashInflowDistributionOptions.data[params.itemId].avenue
        }\t\t\t\t ${this.currencyPipe.transform(
          this.cashInflowDistributionOptions.data[params.itemId].amount,
          (this.currency ? this.currency : 'INR') + ' ',
          'code',
        )}`;
    };

    this.cashOutflowDistributionOptions.formatter = (params: any) => {
      return `${this.cashOutflowDistributionOptions.data[params.itemId].avenue
        }\t\t\t\t ${this.currencyPipe.transform(
          this.cashOutflowDistributionOptions.data[params.itemId].amount,
          (this.currency ? this.currency : 'INR') + ' ',
          'code',
        )}`;
    };
  };

}
