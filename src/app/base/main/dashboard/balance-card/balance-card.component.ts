import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { BalanceDetails } from '../../@models/balance-details.model';
import * as moment from 'moment';
import { CurrencyService } from 'src/app/shared/@services/currency.service';

@Component({
  selector: 'app-balance-card',
  templateUrl: './balance-card.component.html',
  styleUrls: ['./balance-card.component.scss'],
})
export class BalanceCardComponent implements OnInit {
  balanceDetails: any = {
    totalBalance: 0,
    totalLimit: 0,
    totalPayables: 0,
    totalReceivables: 0,
  };

  currency: string = 'INR';

  dateTime: any = '10:00 AM | 21 May 2022';

  loginType: string;

  group: any;

  groups: any[] = [];

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private currencyService: CurrencyService,
  ) {}

  ngOnInit(): void {
    this.dateTime = '10:00 AM | ' + moment(this.userService.applicationDate).format('DD MMM YYYY');
    this.loginType = this.userService.loginPreferenceDetails.loginType;

    this.currencyService.getCurrencyName().subscribe((currency: string) => {
      this.currency = currency;
    });

    if (this.loginType == 'group') {
      this.groups = this.userService.userGroups;

      this.group = this.userService.group;

      this.getGroupBalance(this.group.id);
    } else {
      this.getCorporateBalance(this.userService.userDetails.corporateId);
    }
  }

  onCurrencyChanged(currency: any) {
    this.currency = currency.displayName;
  }

  changeGroup(event: any) {
    this.userService.group = event.value;

    console.log(this.group.id);

    this.getGroupBalance(this.group.id);
  }

  getGroupBalance(groupId: any) {
    const data = { dataMap: { groupId } };

    this.httpService
      .httpPost('dashboard/private/getGroupBalance', data)
      .subscribe((response: any) => {
        this.balanceDetails = response.data;
      });
  }

  getCorporateBalance(corporateId: any) {
    const data = { dataMap: { corporateId } };

    this.httpService
      .httpPost('dashboard/private/getCorporateBalance', data)
      .subscribe((response: any) => {
        this.balanceDetails = response.data;
      });
  }
}
