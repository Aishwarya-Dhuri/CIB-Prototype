import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { GenericListingComponent } from 'src/app/shared/@components/generic-listing/generic-listing.component';
import { ListType } from 'src/app/shared/@components/generic-listing/models/list-type.model';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-invoice-payment-apply-finance-listing',
  templateUrl: './invoice-payment-apply-finance-listing.component.html',
  styleUrls: ['./invoice-payment-apply-finance-listing.component.scss'],
})
export class InvoicePaymentApplyFinanceListingComponent
  extends GenericListingComponent
  implements OnInit
{
  parentComponentRef: any = this;
  subServiceUrl: string = '/invoicePayment';

  constructor(
    protected actionsService: ActionService,
    protected breadcrumbService: BreadcrumbService,
    protected menuService: MenuService,
    protected router: Router,
    protected viewService: ViewService,
    protected httpService: HttpService,
  ) {
    super(actionsService, breadcrumbService, menuService, router, viewService, httpService);
  }

  ngOnInit(): void {}

  //overriding Urls
  updateUrls(listingTypes: ListType[]): ListType[] {
    listingTypes.forEach((listType: ListType) => {
      listType.colDefUrl = this.menuService.getSelectedServiceUrl() + '/private/getColDefs';
      listType.colDefReq = { dataMap: { listType: listType.code } };
      if (listType.displayName.startsWith('IP'))
        listType.rowDataUrl =
          this.menuService.getSelectedServiceUrl() +
          '/invoicePayment/private/' +
          listType.rowDataUrl;
      else if (listType.displayName.startsWith('AF'))
        listType.rowDataUrl =
          this.menuService.getSelectedServiceUrl() + '/applyFinance/private/' + listType.rowDataUrl;
    });

    return listingTypes;
  }

  setSelectedList(listType: ListType): void {
    this.subServiceUrl = listType.displayName.startsWith('IP')
      ? '/invoicePayment'
      : '/applyFinance';
  }

  getServiceUrl(): string {
    return this.menuService.getSelectedServiceUrl() + this.subServiceUrl;
  }

  navigateToInitiate(): void {
    this.setViewExtraData();
    this.router.navigateByUrl(this.menuService.getSelectedServiceUrl());
  }

  navigateToView(): void {
    this.setViewExtraData();
    this.router.navigateByUrl(this.menuService.getSelectedServiceUrl());
  }

  setViewExtraData(): void {
    if (this.viewService.getMode() == 'VIEW' || this.viewService.getMode() == 'EDIT') {
      this.viewService.setExtraData(this.subServiceUrl == '/invoicePayment' ? 'IP' : 'AF');
    }
  }
}
