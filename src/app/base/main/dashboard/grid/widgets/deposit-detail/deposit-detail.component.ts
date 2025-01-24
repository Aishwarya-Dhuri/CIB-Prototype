import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-deposit-detail',
  templateUrl: './deposit-detail.component.html',
  styleUrls: ['./deposit-detail.component.scss'],
})
export class DepositDetailWidgetComponent implements OnInit {
  count: number = 0;
  total: number = 0;
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost('accountServices/services/accountSummary/private/getFdData')
      .subscribe((response: any) => {
        this.count = response.data.length;
        response.data.forEach((account: any) => {
          this.total += parseFloat(account.depositAmount);
        });
      });
  }
}
