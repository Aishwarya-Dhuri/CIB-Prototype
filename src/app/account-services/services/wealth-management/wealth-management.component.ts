import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { WealthManagementService } from './@services/wealth-management.service';

@Component({
  selector: 'app-wealth-management',
  templateUrl: './wealth-management.component.html',
  styleUrls: ['./wealth-management.component.scss'],
})
export class WealthManagementComponent implements OnInit {
  loading: boolean;

  areaOptions: any;

  currency: any;

  options: any;

  corporate: any;

  corporates: any[] = [];

  isGroupUser: boolean = false;

  showInvestmentsOverview: boolean = false;
  expandInvestmentsOverview: boolean = false;
  showInvestmentsDistribution: boolean = false;
  expandInvestmentsDistribution: boolean = false;

  corporateWealthManagementData: any;

  investmentsOverviewDuration: any[] = ['Weekly', 'Monthly', 'Yearly'];
  selectedInvestmentsOverviewDuration = this.investmentsOverviewDuration[1];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private currencyService: CurrencyService,
    private wealthManagementService: WealthManagementService,
    private userService: UserService,
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
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Services' },
      { label: 'Wealth Management' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.currencyService.getCurrencyName().subscribe((currency: string) => {
      this.currency = currency;

      this.wealthManagementService.selectedCurrencyCode = currency;
    });

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    if (this.isGroupUser) {
      this.httpService
        .httpPost('setup/corporateOnboarding/corporateMain/private/getGroupCorporates', {
          dataMap: { groupId: this.userService.userDetails.groupId },
        })
        .subscribe((response: any) => {
          this.corporates = response.dataList.map((data: any) => {
            return {
              id: data.id,
              displayName: data.name,
              enrichments: {
                ...data,
              },
            };
          });

          this.corporate = this.corporates[0];

          this.getCorporateWealthData(this.corporate.id);
        });
    } else {
      this.corporate = {
        id: this.userService.userDetails.corporateId,
        displayName: this.userService.userDetails.corporateName,
      };
      this.getCorporateWealthData(this.corporate.id);
    }
  }

  getCorporateWealthData(corporateId: string) {
    this.loading = true;

    this.httpService
      .httpPost(
        'accountServices/services/wealthManagement/private/getCorporateWealthManagementData',
        {
          dataMap: {
            corporateId,
          },
        },
      )
      .subscribe((response: any) => {
        console.log(response);
        this.corporateWealthManagementData = response;

        this.wealthManagementService.setWealthManagementData(response);

        this.options = {
          data: response.instrumentsDistributionData,
          formatter: (params: any) => {
            return `${response.instrumentsDistributionData[params.itemId].avenue}\t(${
              response.instrumentsDistributionData[params.itemId].value
            })\t\t\t${this.currency} ${response.instrumentsDistributionData[params.itemId].amount}`;
          },
          labelKey: 'avenue',
          angleKey: 'value',
        };

        this.areaOptions = {
          data: response.overallInvestmentOverview,
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
                fontSize: 4,
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
            },
            {
              type: 'number',
              position: 'left',
              tick: {
                count: 10,
              },
            },
          ],
        };

        this.loading = false;
      });
  }

  onChangeCurrency(currency: string) {
    this.currency = currency;
    this.wealthManagementService.selectedCurrencyCode = currency;
  }
}
