import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { HttpService } from '../../@services/http.service';
import { UserService } from '../../@services/user.service';
import { ViewService } from '../../services/view-service/view-service';
import { ListingService } from './services/listing.service';

@Component({
  selector: 'app-generic-listing',
  templateUrl: './generic-listing.component.html',
  styleUrls: ['./generic-listing.component.scss'],
})
export class GenericListingComponent implements OnInit {
  parentComponentRef: any = this;

  rejectReason: string = '';
  errorMessage: string = '';
  errors: string[] = [];

  @ViewChild('listing') listing: any;

  constructor(
    protected actionsService: ActionService,
    protected breadcrumbService: BreadcrumbService,
    protected menuService: MenuService,
    protected router: Router,
    protected viewService: ViewService,
    protected httpService: HttpService,
    protected listingService?: ListingService,
  ) {}

  ngOnInit(): void {
    /* Remove start */
    const actions: Actions = {
      heading: 'Generic Listing',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
      backBtn: this.listingService?.getBackButton(),
    };
    this.actionsService.setActions(actions);
    this.listingService.setBackButton(false);

    const breadcrumbs: Breadcrumb[] = [{ icon: 'fa-home' }];

    if (this.menuService.getSelectedServiceUrl()) {
      this.menuService
        .getSelectedServiceUrl()
        .split('/')
        .forEach((menu: string) => {
          breadcrumbs.push({
            label: menu
              .split('')
              .map((char: string, i: number) => {
                if (i == 0) {
                  char = char.toUpperCase();
                }
                if (char == char.toUpperCase()) {
                  char = ' ' + char;
                }
                return char;
              })
              .join(''),
          });
        });
    } else {
      breadcrumbs.push({ label: 'Listing' });
    }

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* Remove end */
  }

  onRejectReasonClick(rejectReason: string) {
    this.rejectReason = rejectReason;
  }

  navigateToInitiate(): void {
    if (this.menuService.getIsDynamicFormBuilderMenu()) {
      this.router.navigateByUrl(this.getServiceUrl() + '/dynamic');
    } else {
      this.router.navigateByUrl(this.getServiceUrl());
    }
  }

  view(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('VIEW');
    this.viewService.setExtraData(this.listing.selectedList);
    this.navigateToView();
  }

  error(id: string, error: string, noOfErrors: number): void {
    this.errorMessage = error;

    const noOfTransactionsForError: number = noOfErrors ? +noOfErrors : 1;

    this.errors = [];

    for (let i = 0; i < noOfTransactionsForError; i++) {
      this.errors.push(error);
    }

    if (this.errors.length == 0) {
      this.errors.push(this.errorMessage);
    }
  }

  navigateToView(): void {
    if (this.menuService.getIsDynamicFormBuilderMenu()) {
      this.router.navigateByUrl(this.getServiceUrl() + '/dynamic');
    } else {
      this.router.navigateByUrl(this.getServiceUrl());
    }
  }

  edit(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('EDIT');
    this.viewService.setExtraData(this.listing.selectedList);
    this.navigateToInitiate();
  }

  authorize(id: any): void {
    const ids = [id];
    this.authorizeAll(ids).subscribe((responseStatus: number) => {
      if (responseStatus == 0) {
        this.listing.refresh();
      }
    });
  }

  swiftGpiDataFlow(id: string) {
    this.viewService.setId(id);
    this.router.navigateByUrl(this.getServiceUrl() + '/dataflow');
  }

  authorizeAll(ids: string[]): Observable<number> {
    let response = new Subject<number>();
    let data = { dataMap: { ids: ids } };
    this.httpService
      .httpPost(this.getServiceUrl() + '/private/authorize', data)
      .subscribe((res) => {
        response.next(res.responseStatus.status);
        response.complete();
      });
    return response.asObservable();
  }

  reject(id: string): void {
    this.listing.showRejectReasonModal(true, [id]);
  }

  rejectAll(ids: string[], rejectReason: string): Observable<number> {
    let response = new Subject<number>();
    let data = { dataMap: { ids: ids, rejectReason: rejectReason } };
    this.httpService.httpPost(this.getServiceUrl() + '/private/reject', data).subscribe((res) => {
      response.next(res.responseStatus.status);
      response.complete();
    });
    return response.asObservable();
  }

  delete(id: string): void {
    this.listing
      .showConfirmModal('Are you sure you want to delete it?', 'DELETE')
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          this.deleteAll([id]);
        }
      });
  }

  deleteAll(ids: string[]) {
    let data = { dataMap: { ids } };
    this.httpService.httpPost(this.getServiceUrl() + '/private/delete', data).subscribe((res) => {
      this.listing.refresh();
    });
  }

  resubmit(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('EDIT');
    this.viewService.setExtraData(this.listing.selectedList);
    this.navigateToInitiate();
  }

  acceptReject(id: string) {
    this.acceptRejectAll([id]);
  }

  acceptRejectAll(ids: string[]): void {
    let data = { dataMap: { ids: ids } };
    this.httpService
      .httpPost(this.getServiceUrl() + '/private/acceptReject', data)
      .subscribe((res) => {
        this.listing.refresh();
      });
  }

  disable(id: string): void {
    this.listing
      .showConfirmModal('Are you sure you want to disable it?', 'DISABLE')
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          let data = { dataMap: { id: id } };
          this.httpService
            .httpPost(this.getServiceUrl() + '/private/disable', data)
            .subscribe((res) => {
              this.listing.refresh();
            });
        }
      });
  }

  enable(id: string): void {
    this.listing
      .showConfirmModal('Are you sure you want to enable it?', 'ENABLE')
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          let data = { dataMap: { id: id } };
          this.httpService
            .httpPost(this.getServiceUrl() + '/private/enable', data)
            .subscribe((res) => {
              this.listing.refresh();
            });
        }
      });
  }

  billPaymentDownload(id: string): void {
    this.httpService.httpDownload('billPayments/Airtel Payment.pdf');
  }
  statutoryPaymentDownload(id: string, institutionType: string): void {
    if (institutionType == 'GST') {
      this.httpService.httpDownload('statutoryPayment/GST Advice.pdf');
    } else if (institutionType == 'Direct Tax') {
      this.httpService.httpDownload('statutoryPayment/Tax Payment Advice.pdf');
    }
  }

  getServiceUrl(): string {
    return this.menuService.getSelectedServiceUrl();
  }
}
