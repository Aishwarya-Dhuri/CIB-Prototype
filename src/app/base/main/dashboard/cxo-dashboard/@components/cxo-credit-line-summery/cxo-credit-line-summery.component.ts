import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { CurrencyPipe } from '@angular/common';
import { UserService } from 'src/app/shared/@services/user.service';
import { CreditLineService } from 'src/app/account-services/services/credit-line-summary/@services/credit-line.service';

@Component({
  selector: 'app-cxo-credit-line-summery',
  templateUrl: './cxo-credit-line-summery.component.html',
  styleUrls: ['./cxo-credit-line-summery.component.scss'],
})
export class CxoCreditLineSummeryComponent implements OnInit {
  loading: boolean = true;
  isGroupUser: boolean;
  creditLineSummaryGroupData: any;

  selectedCorporate: any;

  currency: string = '';
  currencyList: any[] = [];

  constructor(
    private httpService: HttpService,
    private currencyService: CurrencyService,
    private creditLineService: CreditLineService,
    private currencyPipe: CurrencyPipe,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.currencyService.getCurrencyList().subscribe((currencyList: any) => {
      this.currencyList = currencyList;
    });

    this.currencyService.getCurrencyName().subscribe((currency: any) => {
      this.currency = currency;
    });

    this.currencyService.getCurrency().subscribe((currency: any) => {
      this.currency = currency;
      if (
        this.creditLineSummaryGroupData &&
        this.creditLineSummaryGroupData.fundDistributionChartOptions
      ) {
        this.applyCurrency();
      }
    });

    const data = {
      dataMap: {
        groupId: this.userService.userDetails.groupId ? this.userService.userDetails.groupId : 1,
      },
    };

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
    //  else {
    //   this.router.navigate(['./viewDetails'], { relativeTo: this.route });
    // }
  }

  currencyChange(e: any) {
    this.currency = e.displayName;
  }

  applyCurrency = () => {};

  viewCorporateDetails(corporate: any) {
    this.creditLineService.setSelectedCorporate(corporate);
    this.router.navigate(['/accountServices/services/creditLineSummary/viewDetails'], {
      relativeTo: this.route,
    });
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
}
