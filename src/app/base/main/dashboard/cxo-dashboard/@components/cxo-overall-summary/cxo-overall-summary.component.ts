import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { CxoDashboardService } from '../../@services/cxo-dashboard.service';

interface Country {
  flag: string;
  country: string;
  balance: number;
  corporates: string;
  accounts: string;
  amount: string;
  currency: string;
  top: string;
  left: string;
}

@Component({
  selector: 'app-cxo-overall-summary',
  templateUrl: './cxo-overall-summary.component.html',
  styleUrls: ['./cxo-overall-summary.component.scss'],
})
export class CxoOverallSummaryComponent implements OnInit {
  loading: boolean;

  countries: Country[];
  activeCountry: Country;

  constructor(private httpService: HttpService, private cxoDashboardService: CxoDashboardService) {}

  ngOnInit(): void {
    this.loading = true;

    this.httpService
      .httpPost('accountServices/services/accountSummary/private/getCountries')
      .subscribe((response: any) => {
        const cxoDashboardData = {
          totalAccounts: response.data.totalAccounts,
          netBalance: response.data.netBalance,
          assets: response.data.assets,
          accountBalance: +response.data.assets * 0.6,
          investments: +response.data.assets * 0.4,
          liabilities: response.data.liabilities,
          sanctioned: +response.data.liabilities * 0.65,
          outstanding: +response.data.liabilities * 0.35,
        };

        this.cxoDashboardService.setCxoDashboardData(cxoDashboardData);

        this.countries = response.data.countries;

        this.activeCountry = this.countries[0];

        const currenciesData: any[] = [];

        [...this.countries].forEach((country: Country) => {
          currenciesData.push({
            currency: country.currency,
            amount: cxoDashboardData.netBalance,
          });
        });

        this.loading = false;
      });
  }

  changeCountry(country: Country) {
    this.activeCountry = country;
  }
}
