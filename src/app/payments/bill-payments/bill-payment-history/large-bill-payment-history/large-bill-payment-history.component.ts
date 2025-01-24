import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Criteria } from 'src/app/shared/@components/dynamic-search/@models/criteria.model';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { BillPaymentHistoryService } from '../@services/bill-payment-history.service';

@Component({
  selector: 'app-large-bill-payment-history',
  templateUrl: './large-bill-payment-history.component.html',
  styleUrls: ['./large-bill-payment-history.component.scss'],
})
export class LargeBillPaymentHistoryComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  searchByEntityName: string = 'BILL_PAYMENT_HISTORY';
  selectedFilters: Filter[] = [];
  criteriaList: any[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    public billPaymentHistoryService: BillPaymentHistoryService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Bill Payment - History',
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
      { label: 'Account Service' },
      { label: 'Bill Payment History' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getCriteriaList();
  }

  getRecords(filters: Filter[]): void {
    this.billPaymentHistoryService.selectedFilters = filters;
    this.router.navigate(['./searchResult'], { relativeTo: this.route });
  }

  onDynamicFiltersReady() {
    this.billPaymentHistoryService.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }

  getCriteriaList(): void {
    this.criteriaList = [];
    const getCriteriaUrl = 'commons/searchCriteria/private/getCriterias';
    const data = {
      dataMap: { entityName: this.searchByEntityName, criteriaType: 'QUERYSEARCH' },
    };

    this.httpService.httpPost(getCriteriaUrl, data).subscribe((response: any) => {
      this.criteriaList = response.dataMap.SearchCriteria;
    });
  }

  getCriteriaFilterCount(criteria: Criteria): number {
    return JSON.parse(criteria.criteria).length;
  }

  applyCriteria(criteria: Criteria): void {
    this.dynamicSearch.saveCriteria.setCriteriaData(criteria);
    this.dynamicSearch.onFillCriteria(criteria);
  }

  deleteCriteria(criteria: Criteria): void {
    const url = 'commons/searchCriteria/private/delete';
    //const data = { "id": criteria.id, "type": "SearchCriteria", "version": criteria.version };
    const data = { dataMap: { id: criteria.id } };
    this.httpService.httpPost(url, data).subscribe(() => {
      this.getCriteriaList();
    });
  }
}
