import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Criteria } from 'src/app/shared/@components/dynamic-search/@models/criteria.model';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { StopPaymentRequest } from '../../mandate-management/stop-payment-request/@model/stop-payment-request.model';

@Component({
  selector: 'app-mandate-enquiry',
  templateUrl: './mandate-enquiry.component.html',
  styleUrls: ['./mandate-enquiry.component.scss'],
})
export class MandateEnquiryComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  loading: boolean;

  formData: StopPaymentRequest = new StopPaymentRequest();

  currentScreen: string = 'FILTERS';

  selectedFilters: Filter[] = [];

  criteriaList: any[] = [];

  entityName: string = 'DIRECT_DEBIT_MANDATE_ENQUIRY';

  colDefUrl: string = 'directDebit/enquiry/mandateEnquiry/private/enquiryColDefs';
  rowData: any[] = [];
  context: any = { componentParent: this };
  frameworkComponents: any = {};

  gridOptions: any = {
    rowModelType: 'clientSide',
  };

  mandateHistoryData: any[] = [];
  transactionHistoryData: any[] = [];
  showMandateHistory: boolean = false;
  showTransactionHistory: boolean = false;

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Mandate Enquiry',
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
      { label: 'Enquiry' },
      { label: 'Mandate Enquiry' },
      { label: 'Enquiry' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getCriteriaList();

    this.loading = false;
  }

  close() {
    this.currentScreen = 'SEARCH_RESULTS';
  }

  getCriteriaFilterCount(criteria: Criteria): number {
    return JSON.parse(criteria.criteria).length;
  }

  applyCriteria(criteria: Criteria): void {
    this.selectedFilters = [];
    this.selectedFilters = JSON.parse(criteria.criteria);
  }

  getCriteriaList(): void {
    const getCriteriaUrl = 'commons/searchCriteria/private/getCriterias';
    const data = { dataMap: { entityName: this.entityName, criteriaType: 'QUERYSEARCH' } };

    this.httpService.httpPost(getCriteriaUrl, data).subscribe((response: any) => {
      this.criteriaList = response.dataMap.SearchCriteria;
    });
  }

  deleteCriteria(criteria: Criteria): void {
    const url = 'commons/searchCriteria/private/delete';
    const data = { dataMap: { id: criteria.id } };
    this.httpService.httpPost(url, data).subscribe(() => {
      this.getCriteriaList();
    });
  }

  getRecords(filters: Filter[]) {
    this.selectedFilters = filters;

    this.httpService
      .httpPost('directDebit/enquiry/mandateEnquiry/private/getMandateEnquiryList', {
        dataMap: filters,
      })
      .subscribe((data: any) => {
        this.rowData = data.dataList;
        this.currentScreen = 'SEARCH_RESULTS';
      });
  }

  onView(id: string) {
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('directDebit/mandateManagement/registration/private/view', data)
      .subscribe((formData: any) => {
        this.formData = { ...formData, mandateReferenceNumber: formData.id };
        this.currentScreen = 'VIEW';
      });
  }

  onMandateHistory(id: string) {
    this.httpService
      .httpPost('directDebit/enquiry/mandateEnquiry/private/mandateHistoryData')
      .subscribe((response: any) => {
        this.mandateHistoryData = response.data;
        this.showMandateHistory = true;
      });
  }

  onTransactionHistory(id: string) {
    this.httpService
      .httpPost('directDebit/enquiry/mandateEnquiry/private/transactionHistoryData')
      .subscribe((response: any) => {
        this.transactionHistoryData = response.data;
        this.showTransactionHistory = true;
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
