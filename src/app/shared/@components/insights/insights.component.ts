import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from '../../@services/currency.service';
import { HttpService } from '../../@services/http.service';
import { UserService } from '../../@services/user.service';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})
export class InsightsComponent implements OnInit {
  @Input('insights') insights: any[] = [];
  @Input('insightsUrl') insightsUrl: string = '';
  @Input('height') height?: number = 120;
  @Input('outerPadding') outerPadding?: string = '3'; // 0, 1, 2, 3
  @Input('isTransparentBackground') isTransparentBackground?: boolean = false;

  baseCurrency: string = '';
  corporate: string = '';

  constructor(
    private httpService: HttpService,
    private currencyService: CurrencyService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.currencyService.getCurrencyName().subscribe((currencyName: string) => {
      this.baseCurrency = currencyName;
      this.updateCurrency();
    });

    this.corporate = this.userService.userDetails.corporateName;

    if (this.insightsUrl) {
      this.httpService.httpPost(this.insightsUrl).subscribe((response: any) => {
        this.insights = response.dataList;
        this.updateCurrency();
        this.updateCorporates();
      });
    }
  }

  updateCurrency() {
    this.insights = this.insights.map((insight: any) => {
      insight.label = insight.label.replace('<<baseCurrency>>', this.baseCurrency);
      return insight;
    });
  }
  updateCorporates() {
    this.insights = this.insights.map((insight: any) => {
      insight.label = insight.label.replace('<<corporate>>', this.corporate);
      return insight;
    });
    console.log(this.corporate, this.insights);
  }
}
