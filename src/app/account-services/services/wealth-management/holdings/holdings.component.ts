import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { GainLossRendererComponent } from '../@components/gain-loss-renderer/gain-loss-renderer.component';
import { HoldingsRendererComponent } from '../@components/holdings-renderer/holdings-renderer.component';
import { WealthManagementService } from '../@services/wealth-management.service';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.scss'],
})
export class HoldingsComponent implements OnInit {
  loading: boolean;

  listType: string = 'card';

  currency: string;

  context: any = {
    componentParent: this,
  };

  frameworkComponents: any = {
    holdingsRenderer: HoldingsRendererComponent,
    gainLossRenderer: GainLossRendererComponent,
  };

  // holdingsData: any[] = [
  //   {
  //     holdings: {
  //       displayName: 'Mutual Funds',
  //       count: '5',
  //     },
  //     investmentValue: '9910000',
  //     marketValue: '11700000',
  //     unrealizedGainLoss: {
  //       gainLoss: 'gain',
  //       value: '728000',
  //     },
  //     todaysGainLoss: {
  //       gainLoss: 'gain',
  //       value: '728000',
  //     },
  //     realizedProfitLoss: {
  //       gainLoss: 'gain',
  //       value: '728000',
  //     },
  //     dividendInterest: '10881',
  //     totalsGainLoss: {
  //       gainLoss: 'gain',
  //       value: '749821',
  //     },
  //   },
  //   {
  //     holdings: {
  //       displayName: 'Stocks',
  //       count: '10',
  //     },
  //     investmentValue: '9910000',
  //     marketValue: '11700000',
  //     unrealizedGainLoss: {
  //       gainLoss: 'gain',
  //       value: '10940',
  //     },
  //     todaysGainLoss: {
  //       gainLoss: 'gain',
  //       value: '10940',
  //     },
  //     realizedProfitLoss: {
  //       gainLoss: 'gain',
  //       value: '10940',
  //     },
  //     dividendInterest: '10956',
  //     totalsGainLoss: {
  //       gainLoss: 'loss',
  //       value: '21880',
  //     },
  //   },
  //   {
  //     holdings: {
  //       displayName: 'Loans',
  //       count: '5',
  //     },
  //     investmentValue: '9910000',
  //     marketValue: '11700000',
  //     unrealizedGainLoss: {
  //       gainLoss: 'gain',
  //       value: '728000',
  //     },
  //     todaysGainLoss: {
  //       gainLoss: 'gain',
  //       value: '728000',
  //     },
  //     realizedProfitLoss: {
  //       gainLoss: 'gain',
  //       value: '728000',
  //     },
  //     dividendInterest: '10881',
  //     totalsGainLoss: {
  //       gainLoss: 'gain',
  //       value: '749821',
  //     },
  //   },
  //   {
  //     holdings: {
  //       displayName: 'Equity',
  //       count: '5',
  //     },
  //     investmentValue: '9910000',
  //     marketValue: '11700000',
  //     unrealizedGainLoss: {
  //       gainLoss: 'gain',
  //       value: '10940',
  //     },
  //     todaysGainLoss: {
  //       gainLoss: 'gain',
  //       value: '10940',
  //     },
  //     realizedProfitLoss: {
  //       gainLoss: 'gain',
  //       value: '10940',
  //     },
  //     dividendInterest: '10956',
  //     totalsGainLoss: {
  //       gainLoss: 'loss',
  //       value: '21880',
  //     },
  //   },
  //   {
  //     holdings: {
  //       displayName: 'Currency Trading',
  //       count: '5',
  //     },
  //     investmentValue: '9910000',
  //     marketValue: '11700000',
  //     unrealizedGainLoss: {
  //       gainLoss: 'gain',
  //       value: '728000',
  //     },
  //     todaysGainLoss: {
  //       gainLoss: 'gain',
  //       value: '728000',
  //     },
  //     realizedProfitLoss: {
  //       gainLoss: 'gain',
  //       value: '728000',
  //     },
  //     dividendInterest: '10881',
  //     totalsGainLoss: {
  //       gainLoss: 'gain',
  //       value: '749821',
  //     },
  //   },
  //   {
  //     holdings: {
  //       displayName: 'SME Exchange',
  //       count: '10',
  //     },
  //     investmentValue: '9910000',
  //     marketValue: '11700000',
  //     unrealizedGainLoss: {
  //       gainLoss: 'gain',
  //       value: '10940',
  //     },
  //     todaysGainLoss: {
  //       gainLoss: 'gain',
  //       value: '10940',
  //     },
  //     realizedProfitLoss: {
  //       gainLoss: 'gain',
  //       value: '10940',
  //     },
  //     dividendInterest: '10956',
  //     totalsGainLoss: {
  //       gainLoss: 'loss',
  //       value: '21880',
  //     },
  //   },
  // ];

  holdingsData: any[] = [];

  currentHoldingData: any;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private wealthManagementService: WealthManagementService,
    private router: Router,
    private route: ActivatedRoute,
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
      // actions: [
      //   {
      //     actionName: 'card',
      //     icon: 'pi pi-th-large',
      //   },
      //   {
      //     actionName: 'grid',
      //     icon: 'pi pi-list',
      //   },
      // ],
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Services' },
      { label: 'Wealth Management' },
      { label: 'Holdings' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.actionsService.getAction().subscribe((action: any) => {
      this.listType = action.actionName;
    });

    this.currency = this.wealthManagementService.selectedCurrencyCode
      ? this.wealthManagementService.selectedCurrencyCode + ' '
      : '';

    this.holdingsData = this.wealthManagementService
      .getWealthManagementData()
      .holdings.map((record: any) => {
        return {
          data: record,
          holdings: {
            displayName: record.holdingTitle,
            count: record.investmentOverview.length,
          },
          investmentValue: record.investmentValue,
          marketValue: record.currentValue,
          unrealizedGainLoss: {
            gainLoss: 'gain',
            value: record.unrealizedGainLoss,
          },
          currency: this.currency,
          todaysGainLoss: {
            gainLoss: 'gain',
            value: record.todaysGainLoss,
          },
          realizedProfitLoss: {
            gainLoss: 'gain',
            value: record.realizedProfitLoss,
          },
          dividendInterest: record.dividendInterest,
          totalsGainLoss: {
            gainLoss: 'gain',
            value: record.todaysGainLoss,
          },
          yearlyGrowth: {
            gainLoss: 'gain',
            value: record.yearlyGrowth,
          },
          monthlyGrowth: {
            gainLoss: 'gain',
            value: record.monthlyGrowth,
          },
          averageGrowth: {
            gainLoss: 'gain',
            value: record.averageGrowth,
          },
          areaChartOptions: this.getAreaChartOptions(record.holdingInvestmentOverview),
        };
      });

    this.loading = false;
  }

  getAreaChartOptions(areaData: any) {
    return {
      data: areaData,
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 10,
      },
      theme: {
        palette: {
          fills: ['#6DCBC7', '#D0F3EF'],
          strokes: ['#6DCBC7', '#D0F3EF'],
        },
      },
      legend: {
        position: 'bottom',
        item: {
          marker: { shape: 'circle', size: 8 },
          label: {
            fontSize: 10,
          },
        },
      },
      series: [
        {
          type: 'area',
          xKey: 'month',
          yKeys: ['investment', 'profit'],
          yNames: ['Investment', 'Profit'],
          marker: { enabled: true },
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          label: {
            fontSize: 4,
          },
        },
        {
          type: 'number',
          position: 'left',
          tick: {
            count: 10,
          },
          label: {
            fontSize: 4,
          },
        },
      ],
    };
  }

  onHoldingClick(holdingData: any) {
    this.wealthManagementService.investmentData = holdingData;
    this.router.navigate(['../investment'], { relativeTo: this.route });
  }
}
