import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-current-account-detail',
  templateUrl: './current-account-detail.component.html',
  styleUrls: ['./current-account-detail.component.scss'],
})
export class CurrentAccountDetailWidgetComponent implements OnInit {
  count: number = 0;
  total: number = 0;
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    const data = { dataMap: { accountType: 'CURRENT' } };
    this.httpService
      .httpPost('accountServices/services/accountSummary/private/getCasaData', data)
      .subscribe((response: any) => {
        this.count = response.data.length;
        response.data.forEach((account: any) => {
          this.total += parseFloat(account.availableBalance);
        });
      });
  }
}
