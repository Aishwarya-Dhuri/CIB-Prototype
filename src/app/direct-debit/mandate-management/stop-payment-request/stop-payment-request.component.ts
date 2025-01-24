import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { StopPaymentRequest } from './@model/stop-payment-request.model';

@Component({
  selector: 'app-stop-payment-request',
  templateUrl: './stop-payment-request.component.html',
  styleUrls: ['./stop-payment-request.component.scss'],
})
export class StopPaymentRequestComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  loading: boolean;
  mode: string;

  viewMode: boolean = false;

  formData: StopPaymentRequest = new StopPaymentRequest();

  showStopPaymentDetails: boolean = false;

  currentScreen: string = 'FILTERS';

  selectedFilters: Filter[] = [];

  colDefUrl: string = 'directDebit/mandateManagement/stopPaymentRequest/private/mandateColDefs';
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
      { label: 'Stop Payment Request' },
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
        .httpPost('directDebit/mandateManagement/stopPaymentRequest/private/view', data)
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
      .httpPost('directDebit/mandateManagement/registration/private/view', data)
      .subscribe((formData: any) => {
        this.formData = { ...this.formData, ...formData, mandateReferenceNumber: formData.id };
        this.currentScreen = 'VIEW';
      });
  }

  onStopPaymentRequest(id: string) {
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('directDebit/mandateManagement/registration/private/view', data)
      .subscribe((formData: any) => {
        this.formData = { ...this.formData, ...formData, mandateReferenceNumber: formData.id };
        // this.showStopPaymentDetails = true;
        // this.currentScreen = 'VIEW';
        this.currentScreen = 'VIEWSTOPPAYMENT';
      });
  }

  closeStopPayment() {
    this.currentScreen = 'SEARCH_RESULTS';
  }

  back() {
    this.router.navigate(['./', 'listing'], { relativeTo: this.route });
  }

  stopPaymentRequest() {
    const data = this.formData;

    this.httpService
      .httpPost('directDebit/mandateManagement/stopPaymentRequest/private/create', data)
      .subscribe((response: any) => {
        this.formData = new StopPaymentRequest();
        this.back();
      });
  }

  getRecords(filters: Filter[]) {
    this.selectedFilters = filters;

    this.httpService
      .httpPost(
        'directDebit/mandateManagement/stopPaymentRequest/private/getStopPaymentRequestList',
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
    return !(this.formData.reason && this.formData.startDate && this.formData.endDate);
  }

  onDynamicFiltersReady() {
    this.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }
}
