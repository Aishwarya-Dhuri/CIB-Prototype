import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-cxo-cashflow-forecast',
  templateUrl: './cxo-cashflow-forecast.component.html',
  styleUrls: ['./cxo-cashflow-forecast.component.scss'],
})
export class CxoCashflowForecastComponent implements OnInit {
  loading: boolean = true;
  loadingGraph: boolean = true;
  groupCashflowForecastData: any;

  chartDataOptions: any = {};

  forecastPeriod: string = '01-Jan-2022 - 31-Dec-2022';

  accountData: any = [];
  filteredAccountData: any = [];

  options: any[] = [
    { id: 'quarterly', displayName: 'Quarterly' },
    { id: 'halfYearly', displayName: 'Half Yearly' },
    { id: 'yearly', displayName: 'Yearly' },
  ];
  selectedOption = this.options[2];

  constructor(private httpService: HttpService, private userService: UserService) {}

  ngOnInit(): void {
    this.getGroupSummery();
  }

  getGroupSummery() {
    this.httpService
      .httpPost('accountServices/services/cashflowForecast/private/getGroupCashflowData', {
        dataMap: {
          groupId: this.userService.userDetails.groupId,

          forecastPeriod: this.forecastPeriod,
        },
      })
      .subscribe((response: any) => {
        this.groupCashflowForecastData = response;

        let accountData: any[] = [];

        let yKeys: string[] = [];
        let yLabels: string[] = [];

        const corporateAccounts: any[] = [];

        response.corporates.forEach((corporate: any) => {
          corporateAccounts.push(...corporate.accounts);
        });

        console.log(corporateAccounts);

        corporateAccounts.forEach((account: any, i: number) => {
          account.cashflowChartData.forEach((cashflowData: any, j: number) => {
            const cashflowAccountIndex = accountData.findIndex(
              (acc: any) => acc.xLabel == cashflowData.month,
            );

            if (cashflowAccountIndex >= 0) {
              accountData[cashflowAccountIndex]['yLabel' + i] = cashflowData.netCashFlow;
            } else {
              const data = {
                xLabel: cashflowData.month,
                ['yLabel' + i]: cashflowData.netCashFlow,
              };

              accountData.push(data);
            }
          });
        });

        corporateAccounts.forEach((account: any, i: number) => {
          accountData = accountData.map((accData: any) => {
            if (!accData['yLabel' + i]) {
              accData['yLabel' + i] = 0;
            }
            return accData;
          });

          yKeys.push('yLabel' + i);
          yLabels.push(account.accountNumber);
        });

        accountData = accountData.sort((a, b) => {
          const d1 = new Date('15-' + a.xLabel).getTime();
          const d2 = new Date('15-' + b.xLabel).getTime();
          return d1 > d2 ? 1 : d2 > d1 ? -1 : 0;
        });

        this.accountData = accountData;

        this.changePeriodType(this.selectedOption);

        this.chartDataOptions = {
          data: this.filteredAccountData,
          xKey: 'xLabel',
          xLabel: 'Account',
          yKeys,
          yLabels,
          chartType: 'line',
          chartShadow: false,
          categoryAxesPosition: 'bottom',
          categoryAxesTitle: '',
          categoryAxesRotationAngle: '',
          numberAxesPosition: ['left'],
          numberAxesTitle: [''],
          numberAxesRotationAngle: [''],
          legendPosition: 'bottom',
          legendItemMarkerShape: 'circle',
          legendItemMarkerSize: 8,
          legendItemLabelSize: 12,
          legendItemLabelFormatterMethodname: '',
        };

        this.loadingGraph = false;
        this.loading = false;
      });
  }

  changePeriodType(selectedOption: any) {
    this.loadingGraph = true;

    if (selectedOption.id == this.options[0].id) {
      this.filteredAccountData = this.accountData.slice(0, 4);
    } else if (selectedOption.id == this.options[1].id) {
      this.filteredAccountData = this.accountData.slice(0, 6);
    } else {
      this.filteredAccountData = this.accountData.slice(0, 12);
    }

    this.chartDataOptions.data = this.filteredAccountData;

    setTimeout(() => {
      this.loadingGraph = false;
    }, 100);
  }
}
