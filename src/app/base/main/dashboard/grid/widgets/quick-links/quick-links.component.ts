import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.scss'],
})
export class QuickLinksWidgetComponent implements OnInit {
  quickLinkCards: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.quickLinkCards = [
      {
        displayName: 'ACCOUNT SUMMARY',
        icon: 'fa-solar-system',
        routeUrl: 'accountServices/services/accountSummary',
      },
      {
        displayName: 'FUND TRANSFER',
        icon: 'fa-dollar-sign',
        routeUrl: 'payments/transactions/singlePaymentRequest',
      },
      {
        displayName: 'CREATE FIXED DEPOSIT',
        icon: 'fa-money-bill-wave',
        routeUrl: 'accountServices/fixedDeposit/fdInitiation',
      },
      {
        displayName: 'ACCOUNT STATEMENT',
        icon: 'fa-sack-dollar',
        routeUrl: 'accountServices/services/accountStatement',
      },
      {
        displayName: 'STATUTORY PAYMENT',
        icon: 'fa-search-dollar',
        routeUrl: 'payments/transactions/statutoryPayment',
      },
      {
        displayName: 'CHEQUE STATUS INQUIRY',
        icon: 'fa-badge-dollar',
        routeUrl: 'accountServices/services/chequeStatusEnquiry',
      },
      /* {
        displayName: 'TRANSACTION INQUIRY',
        icon: 'fa-search-dollar',
        routeUrl: 'common/process/transactionEnquiry',
      },
      {
        displayName: 'CHEQUE COLLECTION',
        icon: 'fa-money-check-alt',
        routeUrl: 'collection/transaction/chequeCollection',
      }, */
    ];
  }

  routeTo(routeUrl: string): void {
    if (routeUrl) this.router.navigateByUrl(routeUrl);
  }
}
