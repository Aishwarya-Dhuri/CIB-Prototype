import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { StopPaymentRevoke } from './@model/stop-payment-revoke.model';

@Component({
  selector: 'app-stop-payment-revoke',
  templateUrl: './stop-payment-revoke.component.html',
  styleUrls: ['./stop-payment-revoke.component.scss'],
})
export class StopPaymentRevokeComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  loading: boolean;
  mode: string;

  isShowStopPaymentConfirm: boolean = false;
  viewMode: boolean = false;

  formData: StopPaymentRevoke = new StopPaymentRevoke();

  currentScreen: string = 'FILTERS';

  selectedFilters: Filter[] = [];

  colDefUrl: string = 'directDebit/mandateManagement/StopPaymentRevoke/private/mandateColDefs';
  rowData: any[] = [];
  context: any = { componentParent: this };
  frameworkComponents: any = {};
  gridOptions: any = {
    rowModelType: 'clientSide',
  };

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private viewService: ViewService,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Mandate Cancellation - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Direct Debit' },
      { label: 'Mandate Management' },
      { label: 'Stop Payment Revoke' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      if (this.mode == 'VIEW') {
        this.currentScreen = 'VIEW';
      }

      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('directDebit/mandateManagement/stopPaymentRevoke/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onView(id: string) {
    this.viewMode = true;
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('directDebit/mandateManagement/stopPaymentRequest/private/view', data)
      .subscribe((formData: any) => {
        this.formData = { ...this.formData, ...formData, mandateReferenceNumber: formData.id };
        this.currentScreen = 'VIEW';
      });
  }

  onStopPaymentRevoke(id: string) {
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('directDebit/mandateManagement/stopPaymentRequest/private/view', data)
      .subscribe((formData: any) => {
        this.formData = { ...this.formData, ...formData, mandateReferenceNumber: formData.id };
        // this.isShowStopPaymentConfirm = true;
        // this.currentScreen = 'VIEW';
        this.currentScreen = 'STOPPAYMENTREVOKE';
      });
  }

  close() {
    this.currentScreen = 'SEARCH_RESULTS';
    this.viewMode = false;
  }

  closeStopPaymentRevoke() {
    this.currentScreen = 'SEARCH_RESULTS';
  }

  back() {
    this.router.navigate(['./', 'listing'], { relativeTo: this.route });
  }

  StopPaymentRevoke() {
    const data = this.formData;
    // data.stopPayRevokeDate = new Date().toLocaleDateString();

    this.httpService
      .httpPost('directDebit/mandateManagement/StopPaymentRevoke/private/create', data)
      .subscribe((response: any) => {
        this.formData = new StopPaymentRevoke();
        this.back();
      });
  }

  getRecords(filters: Filter[]) {
    this.selectedFilters = filters;

    this.httpService
      .httpPost(
        'directDebit/mandateManagement/StopPaymentRevoke/private/getStopPaymentRevokeList',
        {
          dataMap: filters,
        },
      )
      .subscribe((data: any) => {
        this.rowData = data.dataList;
        this.currentScreen = 'SEARCH_RESULTS';
      });
  }

  ValidateFormData() {
    return !(this.formData.releaseRemarks);
  }

  onDynamicFiltersReady() {
    this.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }
}
