import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-sme-default',
  templateUrl: './sme-default.component.html',
  styleUrls: ['./sme-default.component.scss'],
})
export class SMEDefaultComponent implements OnInit {
  quickLinkCards: any[];
  corporateAccounts: Select[] = [];
  selectedAccount: Select;
  recentTransactionType: string = 'Pending';
  recentTransactions: any;

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.quickLinkCards = [
      {
        displayName: 'ACCOUNT SUMMARY',
        icon: 'fa-solar-system',
        routeUrl: 'account-services/services/account-summary',
      },
      {
        displayName: 'FUND TRANSFER',
        icon: 'fa-dollar-sign',
        routeUrl: 'payments/transactions/singlePaymentRequest',
      },
      {
        displayName: 'FINANCE REPAYMENT',
        icon: 'fa-money-bill-wave',
        routeUrl: 'fscm/transactions/financeRepayment',
      },
      {
        displayName: 'ACCOUNT STATEMENT',
        icon: 'fa-sack-dollar',
        routeUrl: 'account-services/services/account-statement',
      },
      {
        displayName: 'CASH FORECASTING',
        icon: 'fa-chart-line',
        routeUrl: 'account-services/services/cashflow-forecast',
      },
      {
        displayName: 'CHEQUE STATUS INQUIRY',
        icon: 'fa-badge-dollar',
        routeUrl: 'account-services/services/cheque-status-enquiry',
      },
      {
        displayName: 'TRANSACTION INQUIRY',
        icon: 'fa-search-dollar',
        routeUrl: 'common/process/transactionEnquiry',
      },
      {
        displayName: 'CHEQUE COLLECTION',
        icon: 'fa-money-check-alt',
        routeUrl: 'collection/transaction/chequeCollection',
      },
    ];
    this.getAccountNoList();
    this.getRecentTransactions();
  }

  getAccountNoList(): void {
    const data = { dataMap: { corporateId: this.userService.userDetails.corporateId } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        this.corporateAccounts = response.dataList;
        this.selectedAccount = this.corporateAccounts[0] ? this.corporateAccounts[0] : null;
      });
  }

  getRecentTransactions() {
    this.recentTransactions = {
      Pending: [
        {
          description: 'Fund Transfer',
          valueDate: '23-Oct-2021',
          transactionDate: '23-Oct-2021',
          referenceNumber: '1235421',
          amount: '1000',
        },
        {
          description: 'Invoice Payment',
          valueDate: '22-Oct-2021',
          transactionDate: '22-Oct-2021',
          referenceNumber: '1235455',
          amount: '1500',
        },
      ],
      Rejected: [
        {
          description: 'Repayment',
          valueDate: '25-Oct-2021',
          transactionDate: '25-Oct-2021',
          referenceNumber: '1235423',
          amount: '1000',
        },
        {
          description: 'Credit Transfer',
          valueDate: '24-Oct-2021',
          transactionDate: '24-Oct-2021',
          referenceNumber: '1235452',
          amount: '1500',
        },
      ],
      Failed: [
        {
          description: 'Fund Tranfer',
          valueDate: '20-Oct-2021',
          transactionDate: '20-Oct-2021',
          referenceNumber: '1235429',
          amount: '1000',
        },
        {
          description: 'Credit Transfer',
          valueDate: '22-Oct-2021',
          transactionDate: '22-Oct-2021',
          referenceNumber: '1235458',
          amount: '1500',
        },
      ],
    };
  }

  routeTo(routeUrl: string): void {
    if (routeUrl) this.router.navigateByUrl(routeUrl);
  }
}
