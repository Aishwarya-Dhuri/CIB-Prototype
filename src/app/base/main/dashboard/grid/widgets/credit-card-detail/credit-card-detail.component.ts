import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-credit-card-detail',
  templateUrl: './credit-card-detail.component.html',
  styleUrls: ['./credit-card-detail.component.scss'],
})
export class CreditCardDetailWidgetComponent implements OnInit {
  count: number = 0;
  total: number = 0;
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost('accountServices/services/accountSummary/private/getCreditCardData')
      .subscribe((response: any) => {
        this.count = response.data.length;
        response.data.forEach((account: any) => {
          this.total += parseFloat(account.totalOutstandingAmount);
        });
      });
  }
}
