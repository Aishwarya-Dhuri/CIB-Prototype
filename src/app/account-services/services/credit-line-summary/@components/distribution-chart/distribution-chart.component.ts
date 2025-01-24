import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { AppSetting } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';

@Component({
  selector: 'app-distribution-chart',
  templateUrl: './distribution-chart.component.html',
  styleUrls: ['./distribution-chart.component.scss'],
})
export class DistributionChartComponent implements OnInit {
  @Input('distributionChartData') distributionChartData: any[] = [];
  theme: any;
  options: any;

  currency: any;

  constructor(
    private cp: CurrencyPipe,
    private currencyService: CurrencyService,
    private appSettingService: AppSettingService,
  ) {}

  ngOnInit(): void {
    this.currencyService.getCurrency().subscribe((currency: any) => {
      this.currency = currency;
      if (this.options) {
        this.applyCurrency();
      }
    });

    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      setTimeout(() => {
        const themeColors = this.appSettingService.getThemeColors();

        this.theme = {
          baseTheme: 'default',
          palette: {
            fills: themeColors,
            strokes: themeColors,
          },
        };

        if (this.options) {
          this.applyTheme();
        }
      }, 100);
    });

    this.options = {
      data: this.distributionChartData,
      series: [
        {
          type: 'pie',
          labelKey: 'displayName',
          angleKey: 'amount',
          innerRadiusOffset: 7.5,
          label: { enabled: false },
        },
      ],
      theme: this.theme,
      legend: {
        item: {
          marker: { shape: 'circle', size: 8 },
          label: {
            fontSize: 10,
            formatter: (params: any) => {
              return `${this.distributionChartData[params.itemId].displayName}\t${this.cp.transform(
                this.distributionChartData[params.itemId].amount,
                this.currency.displayName + ' ',
                'code',
              )}`;
            },
          },
        },
      },
    };
  }

  applyCurrency = () => {
    const options = cloneDeep(this.options);

    options.legend.item.label.formatter = (params: any) => {
      return `${this.distributionChartData[params.itemId].displayName}\t${this.cp.transform(
        this.distributionChartData[params.itemId].amount,
        this.currency.displayName + ' ',
        'code',
      )}`;
    };

    this.options = options;
  };

  applyTheme = () => {
    const options = cloneDeep(this.options);

    options.theme = this.theme;

    this.options = options;
  };
}
