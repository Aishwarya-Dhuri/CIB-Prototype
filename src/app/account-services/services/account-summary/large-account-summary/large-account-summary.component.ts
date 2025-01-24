import { cloneDeep } from 'lodash';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ScrollService } from 'src/app/shared/@services/scroll.service';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { Country } from '../@models/country';
import { AccountSummaryService } from '../@services/account-summary.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { CurrencyPipe } from '@angular/common';
import { ApsTranslatePipe } from 'src/app/shared/@pipes/aps-translate.pipe';

@Component({
  selector: 'app-large-account-summary',
  templateUrl: './large-account-summary.component.html',
  styleUrls: ['./large-account-summary.component.scss'],
})
export class LargeAccountSummaryComponent implements OnInit {
  @ViewChild('corporatesContainer', { read: ElementRef })
  public corporatesContainer: ElementRef<any>;

  @ViewChild('summaryListContainer', { read: ElementRef })
  public summaryListContainer: ElementRef<any>;

  loading: boolean;

  isGroupUser = false;
  isMultiCountryUser = false;

  summariesData: any;

  options: any;

  countries: Country[] = [];
  country: Country;

  currencies: any[] = [];
  selectedCurrency: any;

  corporates: any;
  selectedCorporate: any;

  summaryList: any[] = [];
  selectedSummary: any;

  chartData: any[] = [];

  currencyOptions: any;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private accountSummaryService: AccountSummaryService,
    private scrollService: ScrollService,
    public userService: UserService,
    public httpService: HttpService,
    public currencyPipe: CurrencyPipe,
    private apsTranslatePipe: ApsTranslatePipe,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.isMultiCountryUser = this.userService.userDetails.isMultiCountryUser === 'Y';

    const actions: Actions = {
      heading: 'Account Summary',

      refresh: true,

      download: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
      favourite: true,
      help: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [{ icon: 'fa-home' }, { label: 'Account Summary' }];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.countries = [];

    this.currencies = [];

    const accountSummeryCountries: any[] =
      this.userService.userDetails.loginPreferenceDetails.bankType == 'Islamic'
        ? this.userService.islamicCountries
        : this.userService.countries;

    [...accountSummeryCountries].forEach((country: any) => {
      this.countries.push({
        ...country.enrichments,
      });

      this.currencies.push({
        flag: country.enrichments.flag,
        currency: country.enrichments.currency,
        fxRate: country.enrichments.fxRate,
      });
    });

    this.country = this.userService.country.enrichments;

    if (!this.country) {
      this.country = this.countries[0];
    }

    this.accountSummaryService.setCountry(this.country);

    this.accountSummaryService.setCurrencies(this.currencies);

    this.selectedCurrency = this.currencies[0];

    this.accountSummaryService.setSelectedCurrency(this.selectedCurrency);

    if (this.isGroupUser) {
      this.getGroupData(this.userService.userDetails.groupId);
    } else {
      this.getCorporateData(this.userService.userDetails.corporateId);
    }
  }

  getGroupData(groupId: any) {
    const data = { dataMap: { groupId } };

    this.httpService
      .httpPost('accountServices/services/accountSummary/private/getGroupSummaryData', data)
      .subscribe((response) => {
        this.summariesData = {
          name: response.data.name,
          image: response.data.image,
          totalAccounts: response.data.totalAccounts,
          overallBalance: response.data.overallBalance,
          overallLimit: response.data.overallLimit,
        };

        this.accountSummaryService.name = response.data.name;
        this.accountSummaryService.image = response.data.image;

        this.corporates = response.data.corporates;

        this.selectedCorporate = this.accountSummaryService.getCorporate();

        if (!this.selectedCorporate) {
          this.selectedCorporate = this.corporates[0];

          this.accountSummaryService.setCorporate(this.selectedCorporate);
        }

        this.chartData = response.data.chartData;

        this.options = {
          data: response.data.chartData,

          labelKey: 'summary',
          angleKey: 'accounts',
          formatter: (params: any) => {
            return `${this.apsTranslatePipe.transform(
              response.data.chartData[params.itemId].summary,
            )}\t\t\t\t${
              response.data.chartData[params.itemId].accounts
            } Accounts\t\t\t\t${this.currencyPipe.transform(
              response.data.chartData[params.itemId].amount,
              (this.selectedCurrency.currency ? this.selectedCurrency.currency : 'INR') + ' ',
              'code',
            )}`;
          },
          padding: {
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          },
          legend: {
            spacing: 6,
            layoutHorizontalSpacing: 0,
            layoutVerticalSpacing: 6,
          },
        };

        this.getCorporateData(this.selectedCorporate.corporateId);
      });
  }

  getCorporateData(corporateId: any) {
    const data = {
      dataMap: {
        corporateId,
        bankType: this.userService.userDetails.loginPreferenceDetails.bankType,
      },
    };

    this.httpService
      .httpPost('accountServices/services/accountSummary/private/getCorporateSummaryData', data)
      .subscribe((response: any) => {
        if (!this.isGroupUser) {
          this.summariesData = {
            name: response.data.name,
            image: response.data.image,
            totalAccounts: response.data.totalAccounts,
            overallBalance: response.data.overallBalance,
            overallLimit: response.data.overallLimit,
          };

          this.accountSummaryService.name = response.data.name;
          this.accountSummaryService.image = response.data.image;

          this.chartData = response.data.chartData;

          this.options = {
            data: response.data.chartData,
            labelKey: 'summary',
            angleKey: 'accounts',
            formatter: (params: any) => {
              return `${response.data.chartData[params.itemId].summary}\t\t\t\t${
                response.data.chartData[params.itemId].accounts
              } Accounts\t\t\t\t${this.currencyPipe.transform(
                response.data.chartData[params.itemId].amount,
                (this.selectedCurrency.currency ? this.selectedCurrency.currency : 'INR') + ' ',
                'code',
              )}`;
            },
            padding: {
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            },
            legend: {
              spacing: 6,
              layoutHorizontalSpacing: 0,
              layoutVerticalSpacing: 6,
            },
          };
        }

        this.summaryList = response.data.summaries;
        this.selectedSummary = this.summaryList[0];

        const currenciesData = [];

        this.currencies.forEach((currency: any) => {
          currenciesData.push({
            currency: currency.currency,
            fxRate: currency.fxRate,
            amount: this.selectedSummary.totalAmount,
          });
        });

        this.currencyOptions = {
          data: currenciesData,

          labelKey: 'currency',
          angleKey: 'amount',
          formatter: (params: any) => {
            return `${this.currencyPipe.transform(
              currenciesData[params.itemId].amount * currenciesData[params.itemId].fxRate,
              currenciesData[params.itemId].currency + ' ',
              'code',
            )}`;
          },

          padding: {
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          },
          legend: {
            spacing: 6,
            layoutHorizontalSpacing: 0,
            layoutVerticalSpacing: 6,
          },
        };

        this.loading = false;
      });
  }

  changeSummary(summary: any) {
    this.selectedSummary = summary;

    const currenciesData = [];

    [...this.countries].forEach((country: Country) => {
      currenciesData.push({
        currency: country.currency,
        amount: this.selectedSummary.totalAmount,
      });
    });

    this.currencyOptions.data = currenciesData;

    this.currencyOptions = cloneDeep(this.currencyOptions);
  }

  getNoOfCorporatesVisibleOnScreen(): number {
    return this.scrollService.getNoOfItemsVisibleOnScreen(
      300,
      this.corporates ? this.corporates.length : 0,
    );
  }

  changeCorporate(corporate: any) {
    this.selectedCorporate = corporate;
    this.accountSummaryService.setCorporate(corporate);

    this.getCorporateData(corporate.corporateId);
  }

  changeCurrency(currency: any) {
    this.selectedCurrency = this.currencies.find((cur: any) => cur.currency === currency);

    if (this.selectedCurrency) {
      this.options = {
        data: this.chartData,
        labelKey: 'summary',
        angleKey: 'accounts',
        formatter: (params: any) => {
          return `${this.chartData[params.itemId].summary}\t\t\t\t${
            this.chartData[params.itemId].accounts
          } Accounts\t\t\t\t${this.currencyPipe.transform(
            this.chartData[params.itemId].amount,
            (this.selectedCurrency.currency ? this.selectedCurrency.currency : 'INR') + ' ',
            'code',
          )}`;
        },
        padding: {
          left: 12,
          right: 12,
          top: 12,
          bottom: 12,
        },
        legend: {
          spacing: 6,
          layoutHorizontalSpacing: 0,
          layoutVerticalSpacing: 6,
        },
      };
    }
  }

  public corporatesContainerScrollRight(): void {
    this.scrollService.scrollLeft(this.corporatesContainer, 150);
  }

  public corporatesContainerScrollLeft(): void {
    this.scrollService.scrollRight(this.corporatesContainer, 150);
  }

  public summaryListScrollRight(): void {
    this.scrollService.scrollLeft(this.summaryListContainer, 150);
  }

  public summaryListScrollLeft(): void {
    this.scrollService.scrollRight(this.summaryListContainer, 150);
  }
}
