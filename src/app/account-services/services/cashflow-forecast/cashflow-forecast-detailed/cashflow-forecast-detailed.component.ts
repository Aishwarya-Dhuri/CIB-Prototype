import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { CashflowForecastService } from '../@services/cashflow-forecast.service';
import * as moment from 'moment';

@Component({
  selector: 'app-cashflow-forecast-detailed',
  templateUrl: './cashflow-forecast-detailed.component.html',
  styleUrls: ['./cashflow-forecast-detailed.component.scss'],
})
export class CashflowForecastDetailedComponent implements OnInit {
  @ViewChild('transactionsGrid') transactionsGrid: AgGridListingComponent;

  loading: boolean = true;
  loadingGrid: boolean = false;

  cashInflowDistributionOptions: any;
  cashOutflowDistributionOptions: any;

  forecastPeriod: any = '01-Jan-2022 - 30-Jun-2022';

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
    'accountServices/services/cashFlowForcast/private/cashflowTransactionsColDefs';

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
  selectedAccount: any;

  currency: string = '';

  forecastPeriodOptions: any[] = [
    { id: 'This Week', displayName: 'This Week' },
    { id: 'This Month', displayName: 'This Month' },
    { id: 'Custom', displayName: 'Custom' },
  ];
  selectedForecastPeriodOptions: string = this.forecastPeriodOptions[2].id;

  viewport: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private cashflowForecastService: CashflowForecastService,
    private currencyPipe: CurrencyPipe,
    private viewportService: ViewportService,
    private currencyService: CurrencyService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Cashflow Forecast - Detailed',
      subHeading: null,

      refresh: true,

      download: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
      backBtn: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Cashflow Forecast' },
      { label: 'Summary' },
      { label: 'Detailed' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.forecastPeriod = this.cashflowForecastService.forecastPeriod;

    this.selectedForecastPeriodOptions = this.cashflowForecastService.selectedForecastPeriodOption;

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });

    this.currency = this.cashflowForecastService.selectedCurrency;

    if (!this.currency) {
      this.currencyService.getCurrencyName().subscribe((currency: string) => {
        this.currency = currency;
      });
    }

    this.accountData = this.cashflowForecastService.selectedAccount;

    if (!this.accountData) {
      this.router.navigate(['../'], { relativeTo: this.route });
      return;
    }

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
  }

  prepareChartData() {
    this.accountData['cashflowSmallChartOptions'] = {
      data: this.accountData.cashflowChartData,
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
    this.cashflowForecastService.selectedCurrency = currency.displayName;
    this.currency = currency.displayName;

    this.setRowDataCurrency();
  }

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
      left: left + 'px',
      width: 'auto',
      'z-index': '1',
      padding: '0.5rem',
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
      return `${
        this.cashInflowDistributionOptions.data[params.itemId].avenue
      }\t\t\t\t ${this.currencyPipe.transform(
        this.cashInflowDistributionOptions.data[params.itemId].amount,
        (this.currency ? this.currency : 'INR') + ' ',
        'code',
      )}`;
    };

    this.cashOutflowDistributionOptions.formatter = (params: any) => {
      return `${
        this.cashOutflowDistributionOptions.data[params.itemId].avenue
      }\t\t\t\t ${this.currencyPipe.transform(
        this.cashOutflowDistributionOptions.data[params.itemId].amount,
        (this.currency ? this.currency : 'INR') + ' ',
        'code',
      )}`;
    };
  };
}
