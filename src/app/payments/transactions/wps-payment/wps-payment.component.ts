import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { WpsPaymentService } from './@services/wps-payment.service';

@Component({
  selector: 'app-wps-payment',
  templateUrl: './wps-payment.component.html',
  styleUrls: ['./wps-payment.component.scss'],
})
export class WpsPaymentComponent implements OnInit {
  @ViewChild('wpsGridListing') gridListing: AgGridListingComponent;

  loading: boolean = true;
  loadingList: boolean = true;

  landingPageData: any;

  listingType: string = 'grid';

  durationList: any[] = [
    { id: 'today', displayName: 'Today' },
    { id: 'thisWeek', displayName: 'This Week' },
    { id: 'thisMonth', displayName: 'This Month' },
  ];

  fileUploadStatusDuration: string = 'thisMonth';
  authorizedTransactionStatusDuration: string = 'thisMonth';

  gridOptions: any = {
    rowModelType: 'serverSide',
  };

  selectedTab: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private wpsPaymentService: WpsPaymentService,
    private httpService: HttpService,
    private actionsService: ActionService,
    private viewService: ViewService,
    private viewportService: ViewportService,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'WPS Payment',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Payments' },
      { label: 'Transactions' },
      { label: 'WPS Payment' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    const mode = this.viewService.getMode();

    if (mode == 'EDIT' || mode == 'VIEW' || mode == 'RESUBMIT') {
      this.router.navigate(['./initiate'], { relativeTo: this.route });
      return;
    }

    this.viewportService.getViewport().subscribe((viewport: string) => {
      if (viewport == 'mobile') {
        this.listingType = 'grid';
      }
    });

    this.httpService
      .httpPost('payments/transactions/wpsPayment/private/getLandingPageData', {
        dataMap: { loginType: this.userService.loginPreferenceDetails.loginType },
      })
      .subscribe((response) => {
        this.landingPageData = response.data;

        this.changeActiveTab(response.data.listingTabs[0]);

        this.loading = false;
      });
  }

  onChangeFileUploadStatusDuration(event: any) {
    this.httpService
      .httpPost('payments/transactions/wpsPayment/private/getFileUploadStatus', {
        dataMap: { duration: event.id },
      })
      .subscribe((response) => {
        this.landingPageData.fileUploadStatus = response.data;
      });
  }

  view(id: string) {
    this.viewService.setId(id);
    this.viewService.setMode('VIEW');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  onChangeAuthorizedTransactionStatusDuration(event: any) {
    this.httpService
      .httpPost('payments/transactions/wpsPayment/private/getAuthorizedTransactionStatus', {
        dataMap: { duration: event.id },
      })
      .subscribe((response) => {
        this.landingPageData.authorizedTransactionStatus = response.data;
      });
  }

  changeActiveTab(tab: any) {
    this.loadingList = true;

    this.selectedTab = tab;

    setTimeout(() => {
      this.loadingList = false;
    }, 100);
  }

  useDraft(id: string) {
    this.viewService.setId(id);
    this.viewService.setMode('DRAFT');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  delete(id: string) {}

  initiateWpsPayment(initiateType: string) {
    this.wpsPaymentService.initiateType = initiateType;
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }
}
