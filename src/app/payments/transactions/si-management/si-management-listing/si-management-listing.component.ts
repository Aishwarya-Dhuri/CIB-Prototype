import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { GenericListingComponent } from 'src/app/shared/@components/generic-listing/generic-listing.component';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-si-management-listing',
  templateUrl: './si-management-listing.component.html',
  styleUrls: ['./si-management-listing.component.scss'],
})
export class SiManagementListingComponent extends GenericListingComponent implements OnInit {
  parentComponentRef: any = this;

  isLoading: boolean;
  showOngoingSiTransactions: boolean = false;
  showCorporateFailedSiTransactions: boolean = false;
  showCorporateAttentionRequiredSiTransactions: boolean = false;

  timeDurationOptions: Select[] = [
    { id: 'week', displayName: 'This Week', enrichments: {} },
    { id: 'month', displayName: 'This Month', enrichments: {} },
    { id: 'today', displayName: 'Today', enrichments: {} },
  ];

  siStatus: any = {
    timeDuration: 'week',
    corporate: 'all',
    ongoing: '0',
    expired: '0',
    attentionRequired: '0',
  };

  siTransactionStatus: any = {
    timeDuration: 'week',
    corporate: 'all',
    processing: '0',
    paid: '0',
    failed: '0',
  };

  isGroupUser: boolean = false;

  constructor(
    protected actionsService: ActionService,
    protected breadcrumbService: BreadcrumbService,
    protected menuService: MenuService,
    protected router: Router,
    protected viewService: ViewService,
    protected httpService: HttpService,
    protected listingService: ListingService,
    private userService: UserService,
  ) {
    super(actionsService, breadcrumbService, menuService, router, viewService, httpService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.httpService
      .httpPost('payments/transactions/siManagement/private/getListingDashboardData', {
        dataMap: { timeDuration: 'week' },
      })
      .subscribe((response: any) => {
        this.siStatus.ongoing = response.data.ongoingSI;
        this.siStatus.expired = response.data.expiredSI;
        this.siStatus.attentionRequired = response.data.attentionRequiredSI;

        this.siTransactionStatus.processing = response.data.processingSI;
        this.siTransactionStatus.paid = response.data.paidSI;
        this.siTransactionStatus.failed = response.data.failedSI;
      });
  }

  edit(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('EDIT');
    this.navigateToInitiate();
  }

  view(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('VIEW');
    this.navigateToInitiate();
  }

  navigateToInitiate(): void {
    if (this.userService.userDetails.corporateType == 'L')
      this.router.navigateByUrl(this.menuService.getSelectedServiceUrl() + '/initiate');
    else this.router.navigateByUrl(this.menuService.getSelectedServiceUrl());
  }

  onSiStatusTimeDuration(value: Select) {
    this.httpService
      .httpPost(
        'payments/transactions/siManagement/private/getCorporateAttentionRequiredSiTransactions',
        {
          dataMap: { timeDuration: value.id, corporateId: this.siStatus.corporate },
        },
      )
      .subscribe((response: any) => {
        this.siStatus.attentionRequired = response.data.attentionRequiredSI;
      });
  }

  onSiTransactionStatusTimeDuration(value: Select) {
    this.httpService
      .httpPost('payments/transactions/siManagement/private/getCorporateSiTransactionsStatus', {
        dataMap: { timeDuration: value.id, corporateId: this.siTransactionStatus.corporate },
      })
      .subscribe((response: any) => {
        this.siTransactionStatus.processing = response.data.processingSI;
        this.siTransactionStatus.paid = response.data.paidSI;
        this.siTransactionStatus.failed = response.data.failedSI;
      });
  }

  onSiStatusCorporate(value: Select) {
    this.httpService
      .httpPost('payments/transactions/siManagement/private/getCorporateSiStatus', {
        dataMap: { timeDuration: this.siStatus.timeDuration, corporateId: value.id },
      })
      .subscribe((response: any) => {
        this.siStatus.ongoing = response.data.ongoingSI;
        this.siStatus.expired = response.data.expiredSI;
        this.siStatus.attentionRequired = response.data.attentionRequiredSI;
      });
  }

  onSiTransactionStatusCorporate(value: Select) {
    this.httpService
      .httpPost('payments/transactions/siManagement/private/getCorporateSiTransactionsStatus', {
        dataMap: { timeDuration: this.siTransactionStatus.timeDuration, corporateId: value.id },
      })
      .subscribe((response: any) => {
        this.siTransactionStatus.processing = response.data.processingSI;
        this.siTransactionStatus.paid = response.data.paidSI;
        this.siTransactionStatus.failed = response.data.failedSI;
      });
  }
}
