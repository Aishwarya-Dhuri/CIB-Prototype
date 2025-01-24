import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ScrollService } from 'src/app/shared/@services/scroll.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { CashflowForecastMonthLinkRendererComponent } from './@components/cashflow-forecast-month-link-renderer/cashflow-forecast-month-link-renderer.component';
import { CashflowForecastService } from './@services/cashflow-forecast.service';
import * as moment from 'moment';

@Component({
  selector: 'app-cashflow-forecast',
  templateUrl: './cashflow-forecast.component.html',
  styleUrls: ['./cashflow-forecast.component.scss'],
})
export class CashflowForecastComponent implements OnInit {
  @ViewChild('corporatesContainer', { read: ElementRef })
  public corporatesContainer: ElementRef<any>;

  searchValue: string = '';

  loading: boolean = true;

  isGroupUser = false;

  cashInflowDistributionOptions: any;
  cashOutflowDistributionOptions: any;

  groupCashflowForecastData: any;
  corporateCashflowForecastData: any;

  expandedAccount: any;

  cashFlowOptions: any;

  insights: any[] = [];

  showMonthlyCashflowGrid: boolean = false;
  monthlyCashflowGridData: any[] = [];

  currency: any = '';

  colDefsUrl: string =
    'accountServices/services/cashFlowForcast/private/cashflowForecastOverviewColDefs';

  frameworkComponents: any = {
    cashflowForecastMonthLinkRenderer: CashflowForecastMonthLinkRendererComponent,
  };

  forecastPeriodOptions: any[] = [
    { id: 'This Week', displayName: 'This Week' },
    { id: 'This Month', displayName: 'This Month' },
    { id: 'Custom', displayName: 'Custom' },
  ];
  selectedForecastPeriodOptions: string = this.forecastPeriodOptions[2].id;

  forecastPeriod: any = '01-Jan-2022 - 30-Jun-2022';

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private cashflowForecastService: CashflowForecastService,
    private currencyPipe: CurrencyPipe,
    private scrollService: ScrollService,
    private currencyService: CurrencyService,
    private httpService: HttpService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Cashflow Forecast - Summary',
      subHeading: null,

      refresh: true,

      download: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Cashflow Forecast' },
      { label: 'Summary' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.currency = this.cashflowForecastService.selectedCurrency;

    this.forecastPeriod = this.cashflowForecastService.forecastPeriod;

    this.selectedForecastPeriodOptions = this.cashflowForecastService.selectedForecastPeriodOption;

    if (!this.currency) {
      this.currencyService.getCurrencyName().subscribe((currency: string) => {
        this.currency = currency;
      });
    }

    this.insights = this.cashflowForecastService.insights;

    if (this.isGroupUser) {
      this.getGroupSummery(this.userService.userDetails.groupId);
    } else {
      this.getCorporateSummery(this.userService.userDetails.corporateId);
    }
  }

  onExpandAccount(account: any) {
    this.expandedAccount = { ...account };
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
      this.onChangeForecastPeriod();
    } else if (fp == this.forecastPeriodOptions[1].id) {
      const firstDay = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format(
        'DD-MMM-YYYY',
      );
      const lastDay = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format(
        'DD-MMM-YYYY',
      );
      this.forecastPeriod = [firstDay, lastDay];
      this.onChangeForecastPeriod();
    } else {
      this.forecastPeriod = '';
      forecastPeriodCalender.showCalender();
    }
  }

  onChangeForecastPeriod() {
    if (this.forecastPeriod[0] && this.forecastPeriod[1]) {
      const forecastPeriod: any = this.forecastPeriod;
      this.forecastPeriod = forecastPeriod.join(' - ');
      this.cashflowForecastService.forecastPeriod = forecastPeriod.join(' - ');

      this.loading = true;
      if (this.isGroupUser) {
        this.getGroupSummery(this.userService.userDetails.groupId);
      } else {
        this.getCorporateSummery(this.userService.userDetails.corporateId);
      }
    }
  }

  isShowAccount(account: any) {
    if (this.searchValue) {
      return (
        account.accountTitle.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
        account.accountNumber.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
        account.openingBalance.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
        account.closingBalance.toString().toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
    return true;
  }

  onChangeCurrency(currency: any) {
    this.cashflowForecastService.selectedCurrency = currency.displayName;
    this.currency = currency.displayName;

    this.corporateCashflowForecastData.accounts = this.corporateCashflowForecastData.accounts.map(
      (account: any) => {
        account.cashflowGridData = account.cashflowGridData.map((record: any) => {
          return {
            ...record,
            currency: this.currency,
          };
        });

        account['cashInFlowDistributionChartOptions'] = {
          data: account.cashInFlowDistributionChartData,
          labelKey: 'label',
          angleKey: 'value',
          formatter: (params: any) => {
            return `${
              account.cashInFlowDistributionChartData[params.itemId].label
            }\t\t${this.currencyPipe.transform(
              account.cashInFlowDistributionChartData[params.itemId].value,
              this.currency + ' ',
              'code',
            )}`;
          },
        };

        account['cashOutFlowDistributionChartOptions'] = {
          data: account.cashOutFlowDistributionChartData,
          labelKey: 'label',
          angleKey: 'value',
          formatter: (params: any) => {
            return `${
              account.cashOutFlowDistributionChartData[params.itemId].label
            }\t\t${this.currencyPipe.transform(
              this.corporateCashflowForecastData.cashOutFlowDistributionChartData[params.itemId]
                .value,
              this.currency + ' ',
              'code',
            )}`;
          },
        };

        return account;
      },
    );
  }

  getNoOfCorporatesVisibleOnScreen(): number {
    return this.scrollService.getNoOfItemsVisibleOnScreen(
      300,
      this.groupCashflowForecastData && this.groupCashflowForecastData.corporates
        ? this.groupCashflowForecastData.corporates.length
        : 0,
    );
  }

  public corporatesContainerScrollRight(): void {
    this.scrollService.scrollLeft(this.corporatesContainer, 150);
  }

  public corporatesContainerScrollLeft(): void {
    this.scrollService.scrollRight(this.corporatesContainer, 150);
  }

  getGroupSummery(groupId: string) {
    this.httpService
      .httpPost('accountServices/services/cashflowForecast/private/getGroupCashflowData', {
        dataMap: {
          groupId,
          forecastPeriod: this.forecastPeriod,
        },
      })
      .subscribe((response: any) => {
        this.groupCashflowForecastData = response;
        this.corporateCashflowForecastData = this.prepareCorporateCashflowData(
          this.groupCashflowForecastData.corporates[0],
        );

        this.loading = false;
      });
  }

  getCorporateSummery(corporateId: string) {
    this.httpService
      .httpPost('accountServices/services/cashflowForecast/private/getCorporateCashflowData', {
        dataMap: {
          corporateId,
          forecastPeriod: this.forecastPeriod,
        },
      })
      .subscribe((response: any) => {
        this.corporateCashflowForecastData = this.prepareCorporateCashflowData(response);

        this.loading = false;
      });
  }

  changeCorporate(corporate: any) {
    this.corporateCashflowForecastData = this.prepareCorporateCashflowData(corporate);
  }

  prepareCorporateCashflowData(cashflowData: any) {
    cashflowData['cashInFlowDistributionChartOptions'] = {
      data: cashflowData.cashInFlowDistributionChartData,
      labelKey: 'label',
      angleKey: 'value',
      formatter: (params: any) => {
        return `${cashflowData.cashInFlowDistributionChartData[params.itemId].label}`;
        // \t\t${this.currencyPipe.transform(
        //   cashflowData.cashInFlowDistributionChartData[params.itemId].value,
        //   this.currency + ' ',
        //   'code',
        // )}
      },
    };

    cashflowData['cashOutFlowDistributionChartOptions'] = {
      data: cashflowData.cashOutFlowDistributionChartData,
      labelKey: 'label',
      angleKey: 'value',
      formatter: (params: any) => {
        return `${cashflowData.cashOutFlowDistributionChartData[params.itemId].label}`;
      },
    };

    cashflowData.accounts = cashflowData.accounts.map((account: any) => {
      account.cashflowGridData = account.cashflowGridData.map((record: any) => {
        return {
          ...record,
          currency: this.currency,
        };
      });

      account['optionType'] = 'Monthly';

      account['cashInFlowDistributionChartOptions'] = {
        data: account.cashInFlowDistributionChartData,
        labelKey: 'label',
        angleKey: 'value',
        formatter: (params: any) => {
          return `${
            account.cashInFlowDistributionChartData[params.itemId].label
          }\t\t${this.currencyPipe.transform(
            account.cashInFlowDistributionChartData[params.itemId].value,
            this.currency + ' ',
            'code',
          )}`;
        },
      };

      account['cashOutFlowDistributionChartOptions'] = {
        data: account.cashOutFlowDistributionChartData,
        labelKey: 'label',
        angleKey: 'value',
        formatter: (params: any) => {
          return `${
            account.cashOutFlowDistributionChartData[params.itemId].label
          }\t\t${this.currencyPipe.transform(
            cashflowData.cashOutFlowDistributionChartData[params.itemId].value,
            this.currency + ' ',
            'code',
          )}`;
        },
      };

      account['cashflowChartOptions'] = {
        data: account.cashflowChartData,
        legend: {
          position: 'bottom',
          item: {
            marker: { shape: 'circle', size: 8 },
            label: {
              fontSize: 8,
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
              fontSize: 8,
            },
          },
          {
            type: 'number',
            position: 'left',
            tick: {
              count: 10,
            },
            label: {
              fontSize: 8,
            },
          },
        ],
      };

      return account;
    });

    return cashflowData;
  }

  onMonthLinkClick(data: any) {
    this.monthlyCashflowGridData = data.data;
    // const date = new Date('15-' + data.month);

    // const firstDay = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('DD-MMM-YYYY');
    // const lastDay = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format(
    //   'DD-MMM-YYYY',
    // );
    // const forecastPeriod = [firstDay, lastDay];
    // // this.forecastPeriod = forecastPeriod.join(' - ');
    // this.cashflowForecastService.forecastPeriod = forecastPeriod.join(' - ');

    // this.cashflowForecastService.accounts = this.corporateCashflowForecastData.accounts;
    // this.cashflowForecastService.selectedAccount = data;
    // this.router.navigate(['./detailed'], { relativeTo: this.route });

    this.showMonthlyCashflowGrid = true;
  }

  viewDetails(account: any) {
    this.cashflowForecastService.accounts = this.corporateCashflowForecastData.accounts;
    this.cashflowForecastService.selectedAccount = account;
    this.router.navigate(['./detailed'], { relativeTo: this.route });
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
