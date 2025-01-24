import { Component, OnInit } from '@angular/core';
import { duration } from 'moment';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { WealthManagementService } from '../@services/wealth-management.service';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.scss'],
})
export class InvestmentComponent implements OnInit {
  loading: boolean;
  areaOptions: any;
  viewport: string = 'web';
  showTransactions: boolean = false;
  showPortfolioDetails: boolean = false;
  showPortfolioComparison: boolean = false;

  investmentOverview: string = 'Performance';
  assetsOverview: string = 'Asset Allocation';

  duration: string[] = ['Weekly', 'Monthly', 'Quarterly'];
  selectedDuration = this.duration[1];

  assetsOverviewOptions: any;
  assetsMarketCapExpoOptions: any;
  assetsSectorsOptions: any;
  options: any;

  holdingData: any;
  performanceData: any;

  portfolioDetails: any;
  currency: string;

  holdings: any[] = [];

  selectedHolding: string;

  rowData: any[] = [];

  isMoreOptions: boolean = false;

  customModalStyle: any;

  portfolio: any[] = [];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewportService: ViewportService,
    private wealthManagementService: WealthManagementService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Wealth Management',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
      backBtn: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Services' },
      { label: 'Wealth Management' },
      { label: 'Investment Details' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.currency = this.wealthManagementService.selectedCurrencyCode
      ? this.wealthManagementService.selectedCurrencyCode + ' '
      : '';

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });

    this.holdingData = this.wealthManagementService.investmentData.data;
    this.performanceData = this.wealthManagementService.investmentData;

    this.holdings = this.wealthManagementService
      .getWealthManagementData()
      .holdings.map((record: any) => {
        return {
          id: record.id,
          displayName: record.holdingTitle,
        };
      });

    this.prepareData();
  }

  onChangeHolding(holdingId: any) {
    console.log(holdingId);
    this.holdingData = this.wealthManagementService
      .getWealthManagementData()
      .holdings.find((record: any) => record.id == holdingId);

    this.prepareData();
  }

  prepareData() {
    this.loading = true;

    this.selectedHolding = this.holdingData.id;

    this.portfolio = this.holdingData.investmentOverview.map((record: any) => {
      return {
        logo: record.investmentCompanyLogo,
        displayName: record.investmentCompany,
        invested: record.invested,
        currentValue: record.currentValue,
        profitAndLoss: record.profitAndLossPercentage,
        profitAndLossPercentage: record.profitAndLossAmount,
        xirr: record.xirr,
        status: record.status,
        type: record.type,
        transactions: record.transactions,
      };
    });

    const instrumentsDistributionData = this.holdingData.investmentOverview.map((record: any) => {
      return {
        avenue: record.investmentCompany,
        amount: record.invested,
      };
    });

    this.options = {
      data: instrumentsDistributionData,
      formatter: (params: any) => {
        return `${instrumentsDistributionData[params.itemId].avenue}\t\t\t\t${this.currency} ${
          instrumentsDistributionData[params.itemId].amount
        }`;
      },
      labelKey: 'avenue',
      angleKey: 'amount',
    };

    const assetsOverviewOptionsData = [
      {
        asset: 'Equity',
        amount: this.holdingData.assetsOverview[0]?.equity,
      },
      {
        asset: 'Debt',
        amount: this.holdingData.assetsOverview[0]?.debt,
      },
      {
        asset: 'Cash',
        amount: this.holdingData.assetsOverview[0]?.cash,
      },
    ];

    this.assetsOverviewOptions = {
      data: assetsOverviewOptionsData,
      formatter: (params: any) => {
        return `${assetsOverviewOptionsData[params.itemId].asset}\t\t\t\t${this.currency} ${
          assetsOverviewOptionsData[params.itemId].amount
        }`;
      },
      labelKey: 'asset',
      angleKey: 'amount',
    };

    const assetsMarketCapExpoOptionsData = [
      {
        asset: 'Large Cap',
        amount: this.holdingData.assetsOverview[0]?.largeCap,
      },
      {
        asset: 'Mid Cap',
        amount: this.holdingData.assetsOverview[0]?.midCap,
      },
      {
        asset: 'Small Cap',
        amount: this.holdingData.assetsOverview[0]?.smallCap,
      },
    ];

    this.assetsMarketCapExpoOptions = {
      data: assetsMarketCapExpoOptionsData,
      formatter: (params: any) => {
        return `${assetsMarketCapExpoOptionsData[params.itemId].asset}\t\t\t\t${this.currency} ${
          assetsMarketCapExpoOptionsData[params.itemId].amount
        }`;
      },
      labelKey: 'asset',
      angleKey: 'amount',
    };

    const assetsSectorsOptionsData = [
      {
        asset: 'Technology',
        amount: this.holdingData.assetsOverview[0]?.technology,
      },
      {
        asset: 'Finance',
        amount: this.holdingData.assetsOverview[0]?.finance,
      },
      {
        asset: 'Automobile',
        amount: this.holdingData.assetsOverview[0]?.automobile,
      },
      {
        asset: 'Hospital',
        amount: this.holdingData.assetsOverview[0]?.hospital,
      },
      {
        asset: 'Other',
        amount: this.holdingData.assetsOverview[0]?.other,
      },
    ];

    this.assetsSectorsOptions = {
      data: assetsSectorsOptionsData,
      formatter: (params: any) => {
        return `${assetsSectorsOptionsData[params.itemId].asset}\t\t\t\t${this.currency} ${
          assetsSectorsOptionsData[params.itemId].amount
        }`;
      },
      labelKey: 'asset',
      angleKey: 'amount',
    };

    this.generateAreaData('Mid Cap');

    this.loading = false;
  }

  generateAreaData(benchMark: any) {
    let mulVal = 1;
    if (benchMark == 'Large Cap') {
      mulVal = 3;
    } else if (benchMark == 'Mid Cap') {
      mulVal = 2;
    } else if (benchMark == 'Small Cap') {
      mulVal = 1;
    } else if (benchMark == 'Multi Cap') {
      mulVal = 4;
    } else if (benchMark == 'Debit Hybrid Fund') {
      mulVal = 3.5;
    }

    let duration = 1;

    if (this.selectedDuration == this.duration[0]) {
      duration = 1;
    } else if (this.selectedDuration == this.duration[1]) {
      duration = 2;
    } else if (this.selectedDuration == this.duration[2]) {
      duration = 3;
    }

    const areaData = this.holdingData.portfolioComparison.map((record: any) => {
      return {
        month: record.month,
        yourPortfolio: Math.round(record.yourProfit * mulVal),
        market: Math.round(record.marketProfit * mulVal),
      };
    });

    this.areaOptions = {
      data: areaData,
      theme: {
        palette: {
          fills: ['#6DCBC7', '#333333'],
          strokes: ['#6DCBC7', '#333333'],
        },
      },
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
          type: 'area',
          xKey: 'month',
          yKeys: ['yourPortfolio'],
          yNames: ['Your Portfolio'],
          marker: { enabled: true },
        },
        {
          type: 'line',
          xKey: 'month',
          yKey: 'market',
          yName: 'Market',
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
        {
          type: 'number',
          position: 'right',
          keys: ['market'],
          tick: {
            count: 10,
          },
          label: {
            fontSize: 8,
          },
        },
      ],
    };
  }

  showMoreOptions(e: MouseEvent, portfolioDetails: any): void {
    this.portfolioDetails = portfolioDetails;
    this.rowData = portfolioDetails.transactions;

    this.isMoreOptions = true;
    let transform = 'translate(-' + e.offsetX + 'px, ' + (36 + -Math.abs(e.offsetY)) + 'px)';
    this.customModalStyle = {
      position: 'absolute',
      top: e.pageY + 'px',
      left: e.pageX + 'px',
      transform: transform,
      width: 'auto',
      'z-index': '1',
      padding: '0.5rem 1rem',
    };
  }

  onShowTransactions() {
    this.showTransactions = false;
  }
}
