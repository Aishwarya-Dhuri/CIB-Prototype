import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-bulk-payment-request',
  templateUrl: './bulk-payment-request.component.html',
  styleUrls: ['./bulk-payment-request.component.scss'],
})
export class BulkPaymentRequestComponent implements OnInit {
  @ViewChild('bulkPaymentGridListing') gridListing!: AgGridListingComponent;

  loading: boolean = false;
  loadingList: boolean = false;

  duration: string = 'thisMonth';

  fileUploadStatus: any = {
    pending: 0,
    rejected: 0,
    authorized: 0,
  };

  listingTabs: any[] = [
    {
      header: 'Recent Payment',
      count: 0,
      colDefsUrl: 'payments/transactions/bulkPaymentRequest/private/recentPaymentsColDefs',
      rowDefUrl: 'payments/transactions/bulkPaymentRequest/private/getRecentPaymentsList',
    },
    {
      header: 'Recent Uploads',
      count: 0,
      colDefsUrl: 'payments/transactions/bulkPaymentRequest/private/recentUploadColDefs',
      rowDefUrl: 'payments/transactions/bulkPaymentRequest/private/getRecentUploadList',
    },
    {
      header: 'Drafts',
      count: 0,
      colDefsUrl: 'payments/transactions/bulkPaymentRequest/private/draftColDefs',
      rowDefUrl: 'payments/transactions/bulkPaymentRequest/private/getDraftList',
    },
  ];

  selectedTab: any = this.listingTabs[0];

  constructor(
    private router: Router,
    private httpService: HttpService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const mode: string = this.viewService.getMode();

    if (mode == 'VIEW' || mode == 'EDIT') {
      this.onInitiate('');
      return;
    }

    this.httpService
      .httpPost('payments/transactions/bulkPaymentRequest/private/getDashboardData')
      .subscribe((response: any) => {
        this.fileUploadStatus = response.fileUploadStatus;
        this.listingTabs = response.listingTabs;
        this.changeActiveTab(this.listingTabs[0]);
        this.loading = false;
      });
  }

  onInitiate(initiateType: string) {
    this.router.navigateByUrl(this.router.url + '/initiate', {
      state: { initiateType },
    });
  }

  changeActiveTab(tab: any) {
    this.loadingList = true;

    this.selectedTab = tab;

    setTimeout(() => {
      this.loadingList = false;
    }, 100);
  }
}
