import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss'],
})
export class LoanDetailWidgetComponent implements OnInit {
  count: number = 0;
  total: number = 0;
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost('accountServices/services/accountSummary/private/getLoanData')
      .subscribe((response: any) => {
        this.count = response.data.length;
        response.data.forEach((account: any) => {
          this.total += parseFloat(account.outstandingAmount);
        });
      });
  }
}
