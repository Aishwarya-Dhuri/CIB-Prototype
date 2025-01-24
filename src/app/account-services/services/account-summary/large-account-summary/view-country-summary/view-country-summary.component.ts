import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Country } from '../../@models/country';
import { UserService } from 'src/app/shared/@services/user.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { CurrencyPipe } from '@angular/common';
import { AccountSummaryService } from '../../@services/account-summary.service';

@Component({
  selector: 'app-view-country-summary',
  templateUrl: './view-country-summary.component.html',
  styleUrls: ['./view-country-summary.component.scss'],
})
export class ViewCountrySummaryComponent implements OnInit {
  loading: boolean;
  options: any;

  countriesData: any;

  countries: Country[];
  activeCountry: Country;

  currencies: any[];
  selectedCurrency: any;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    public accountSummaryService: AccountSummaryService,
    private httpService: HttpService,
    public userService: UserService,
    public currencyPipe: CurrencyPipe,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Account Summary',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [{ icon: 'fa-home' }, { label: 'Account Summary' }];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.httpService
      .httpPost('accountServices/services/accountSummary/private/getCountries')
      .subscribe((response: any) => {
        this.countriesData = {
          totalAccounts: response.data.totalAccounts,
          netBalance: response.data.netBalance,
          assets: response.data.assets,
          liabilities: response.data.liabilities,
        };

        this.countries = response.data.countries;

        this.activeCountry = this.countries[0];

        this.currencies = [];

        const currenciesData: any[] = [];

        [...this.countries].forEach((country: Country) => {
          this.currencies.push({
            flag: country.flag,
            currency: country.currency,
          });

          currenciesData.push({
            currency: country.currency,
            amount: this.countriesData.netBalance,
          });
        });

        this.selectedCurrency = this.currencies[0];

        this.options = {
          data: currenciesData,
          labelKey: 'currency',
          angleKey: 'amount',
          formatter: (params: any) => {
            return `${this.currencyPipe.transform(
              currenciesData[params.itemId].amount,
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

  changeCountry(country: Country) {
    this.activeCountry = country;
    this.changeCurrency(country.currency);
  }

  changeCurrency(currency: string) {
    this.selectedCurrency = this.currencies.find((cur: any) => cur.currency === currency);
  }
}
