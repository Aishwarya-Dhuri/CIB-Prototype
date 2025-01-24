import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { CreditLineService } from './@services/credit-line.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { CurrencyPipe } from '@angular/common';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-credit-line-summary',
  templateUrl: './credit-line-summary.component.html',
  styleUrls: ['./credit-line-summary.component.scss'],
})
export class CreditLineSummaryComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  isGroupUser: boolean;
  creditLineSummaryGroupData: any;

  selectedCorporate: any;

  currency: string = '';
  currencyList: any[] = [];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private creditLineService: CreditLineService,
    private currencyService: CurrencyService,
    private currencyPipe: CurrencyPipe,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Credit Line Summary',
      subHeading: null,

      refresh: true,

      download: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [{ icon: 'fa-home' }, { label: 'Credit Line Summary' }];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    if (!this.isGroupUser) {
      this.router.navigate(['./viewDetails'], { relativeTo: this.route });
      return;
    }

    this.currencyService.getCurrencyList().subscribe((currencyList: any) => {
      this.currencyList = currencyList;
    });

    this.creditLineService.getCreditLineCurrency().subscribe((currency: any) => {
      if (!currency) {
        this.currencyService.getCurrencyName().subscribe((currency1: any) => {
          this.creditLineService.setCreditLineCurrency(currency1);
        });
        return;
      }
      this.currency = currency;
      // this.prepareFundDistributionChartData();
    });

    const data = { dataMap: { groupId: this.userService.userDetails.groupId } };

    this.httpService
      .httpPost(
        'accountServices/services/creditLineSummery/private/getGroupCreditLineDetails',
        data,
      )
      .subscribe((response: any) => {
        this.creditLineSummaryGroupData = response.data;

        this.creditLineSummaryGroupData['fundDistributionChartOptions'] = {
          data: response.data.fundDistributionChartData,
          labelKey: 'displayName',
          angleKey: 'amount',
          formatter: (params: any) => {
            return `${
              response.data.fundDistributionChartData[params.itemId].displayName
            }\t${this.currencyPipe.transform(
              response.data.fundDistributionChartData[params.itemId].amount,
              this.currency + ' ',
              'code',
            )}`;
          },
        };

        const corporateList = [];

        this.creditLineSummaryGroupData.corporates = this.creditLineSummaryGroupData.corporates.map(
          (corporate: any) => {
            corporateList.push({
              id: corporate.corporateId,
              displayName: corporate.corporateName,
            });

            const currencyWiseDistributionChartData = [];

            this.currencyList.forEach((currency: any) => {
              currencyWiseDistributionChartData.push({
                displayName: currency.displayName,
                amount: corporate.totalAllocatedLimit,
              });
            });

            corporate['currencyWiseDistributionChartOptions'] = {
              data: currencyWiseDistributionChartData,
              labelKey: 'displayName',
              angleKey: 'amount',
              formatter: (params: any) => {
                return `${this.currencyPipe.transform(
                  currencyWiseDistributionChartData[params.itemId].amount,
                  currencyWiseDistributionChartData[params.itemId].displayName + ' ',
                  'code',
                )}`;
              },
            };

            return corporate;
          },
        );

        this.creditLineService.setCorporateList(corporateList);

        this.loading = false;
      });
  }

  currencyChange(e: any) {
    this.currency = e.displayName;
    this.creditLineService.setCreditLineCurrency(e.displayName);
    this.prepareFundDistributionChartData();
  }

  prepareFundDistributionChartData() {
    if (
      this.creditLineSummaryGroupData &&
      this.creditLineSummaryGroupData.fundDistributionChartOptions
    ) {
      this.creditLineSummaryGroupData.fundDistributionChartOptions = {
        data: this.creditLineSummaryGroupData.fundDistributionChartOptions.data,
        labelKey: 'displayName',
        angleKey: 'amount',
        formatter: (params: any) => {
          return `${
            this.creditLineSummaryGroupData.fundDistributionChartOptions.data[params.itemId]
              .displayName
          }\t${this.currencyPipe.transform(
            this.creditLineSummaryGroupData.fundDistributionChartOptions.data[params.itemId].amount,
            this.currency + ' ',
            'code',
          )}`;
        },
      };
    }
  }

  // applyCurrency = () => {};

  viewCorporateDetails(corporate: any) {
    this.creditLineService.setSelectedCorporate(corporate);
    this.router.navigate(['./viewDetails'], { relativeTo: this.route });
  }

  toggleSelectedCorporate(corporate: any) {
    if (
      this.selectedCorporate &&
      this.selectedCorporate.corporateName === corporate.corporateName
    ) {
      this.selectedCorporate = null;
      return;
    }

    this.selectedCorporate = corporate;
  }

  ngOnDestroy() {
    // this.currencyService.resetCurrency();
  }
}
