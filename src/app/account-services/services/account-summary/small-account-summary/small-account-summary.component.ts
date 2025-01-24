import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ScrollService } from 'src/app/shared/@services/scroll.service';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { AccountSummaryService } from '../@services/account-summary.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { CurrencyPipe } from '@angular/common';
import { CurrencyService } from 'src/app/shared/@services/currency.service';

@Component({
  selector: 'app-small-account-summary',
  templateUrl: './small-account-summary.component.html',
  styleUrls: ['./small-account-summary.component.scss'],
})
export class SmallAccountSummaryComponent implements OnInit {
  @ViewChild('corporatesContainer', { read: ElementRef })
  public corporatesContainer: ElementRef<any>;

  @ViewChild('summaryListContainer', { read: ElementRef })
  public summaryListContainer: ElementRef<any>;

  loading: boolean;

  options: any;

  summaryList: any[] = [];
  selectedSummary: any;

  corporate: any;

  currency: any;

  summariesData: any;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private accountSummaryService: AccountSummaryService,
    private ScrollService: ScrollService,
    private currencyService: CurrencyService,
    public userService: UserService,
    public httpService: HttpService,
    public currencyPipe: CurrencyPipe,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Account Summary',
      subHeading: '',
      subHeadingLink: '',

      refresh: true,

      download: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [{ icon: 'fa-home' }, { label: 'Account Summary' }];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    const countries = [];

    const currencies = [];

    const accountSummeryCountries: any[] =
      this.userService.userDetails.loginPreferenceDetails.bankType == 'Islamic'
        ? this.userService.islamicCountries
        : this.userService.countries;

    [...accountSummeryCountries].forEach((country: any) => {
      countries.push({
        ...country.enrichments,
      });

      currencies.push({
        flag: country.enrichments.flag,
        currency: country.enrichments.currency,
      });
    });

    this.accountSummaryService.setCountry(countries[0]);

    this.accountSummaryService.setCurrencies(currencies);

    this.currency = currencies[0];

    this.accountSummaryService.setSelectedCurrency(currencies[0]);

    this.getCorporateData(this.userService.userDetails.corporateId);
  }

  getCorporateData(corporateId: any) {
    const data = { dataMap: { corporateId } };

    this.httpService
      .httpPost('accountServices/services/accountSummary/private/getSMECorporateSummaryData', data)
      .subscribe((response: any) => {
        this.corporate = response.data;

        const creditDebitAmount = this.getCreditDebitBalance(response.data.summaries);

        this.summariesData = {
          name: response.data.name,
          image: response.data.image,
          totalAccounts: response.data.totalAccounts,
          overallBalance: response.data.overallBalance,
          overallLimit: response.data.overallLimit,
          creditBalance: creditDebitAmount.creditAmount,
          debitBalance: creditDebitAmount.debitAmount,
        };

        this.accountSummaryService.name = response.data.name;
        this.accountSummaryService.image = response.data.image;

        this.options = {
          data: response.data.chartData,
          labelKey: 'summary',
          angleKey: 'accounts',
          formatter: (params: any) => {
            return `${response.data.chartData[params.itemId].summary}\t\t\t\t${
              response.data.chartData[params.itemId].accounts
            } Accounts\t\t\t\t${this.currencyPipe.transform(
              response.data.chartData[params.itemId].amount,
              this.currency.currency + ' ',
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

        this.summaryList = response.data.summaries;
        this.selectedSummary = this.summaryList[0];

        this.loading = false;
      });
  }

  getCreditDebitBalance(summaryList: any[]) {
    let creditAmount = 0;
    let debitAmount = 0;

    summaryList.forEach((summary: any) => {
      creditAmount += summary.creditAmount;
      debitAmount += summary.debitAmount;
    });

    return {
      creditAmount,
      debitAmount,
    };
  }

  changeSummary(summary: any) {
    this.selectedSummary = summary;
  }

  public summaryListScrollRight(): void {
    this.ScrollService.scrollLeft(this.summaryListContainer, 150);
  }

  public summaryListScrollLeft(): void {
    this.ScrollService.scrollRight(this.summaryListContainer, 150);
  }
}
