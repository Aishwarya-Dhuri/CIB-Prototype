import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Criteria } from 'src/app/shared/@components/dynamic-search/@models/criteria.model';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { VirtualAccountStatusManagement } from './@model/virtual-account-status-management.model';

@Component({
  selector: 'app-virtual-account-status-management',
  templateUrl: './virtual-account-status-management.component.html',
  styleUrls: ['./virtual-account-status-management.component.scss'],
})
export class VirtualAccountStatusManagementComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;
  loading: boolean = true;
  formData: VirtualAccountStatusManagement = new VirtualAccountStatusManagement();

  showSuspendModel: boolean = false;
  showCloseModel: boolean = false;
  showActivateModel: boolean = false;
  showAccountDetailsModel: boolean = false;

  selectedFilters: Filter[] = [];

  options: any;

  criteriaList: any[] = [];

  entityName: string = 'VIRTUAL_ACCOUNT_STATUS_MANAGEMENT';

  rowData: any[] = [];
  context: any = { componentParent: this };
  frameworkComponents: any = {};

  gridOptions: any = {
    rowModelType: 'serverSide',
    pagination: true,
  };

  widgetData: any = {
    corporateId: '',
    corporateName: '',
    totalVirtualAccountUsed: 6,
    totalVirtualAccount: 98,
  };
  isGroupUser: boolean = false;
  currentScreen = 'FILTERS';

  listingTypes: any[] = [];
  activeListing: any;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Virtual Account Status Management',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { icon: 'pi pi-home' },
      { label: 'VAM' },
      { label: 'Process' },
      { label: 'Virtual Account Status Management' },
      { label: 'Enquiry' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.getCorporateWiseRecords({
      id: this.userService.userDetails.corporateId,
      displayName: this.userService.userDetails.corporateName,
    });

    this.listingTypes = [];

    // this.activeListing = this.listingTypes[0];

    this.getCriteriaList();
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
      .httpPost('vam/process/virtualAccountStatusManagement/private/getListingTabs', {
        dataMap: filters,
      })
      .subscribe((response: any) => {
        this.listingTypes = response.data;
        this.activeListing = response.data[0];
        this.currentScreen = 'SEARCH_RESULTS';
      });
  }

  getCorporateWiseRecords(corporate: Select) {
    this.widgetData.corporateId = corporate.id;
    this.widgetData.corporateName = corporate.displayName;

    this.httpService
      .httpPost('vam/process/virtualAccountStatusManagement/private/getDashboardData', {
        dataMap: { corporate: corporate.id },
      })
      .subscribe((response: any) => {
        this.listingTypes = response.listingTypes;
        this.activeListing = response.listingTypes[0];
        this.widgetData.totalVirtualAccountUsed = response.totalVirtualAccountUsed;
        this.widgetData.totalVirtualAccount = response.totalVirtualAccount;
        this.prepareChartOptions(response.chartData);

        this.loading = false;
      });
  }

  prepareChartOptions(data: any[]) {
    this.options = {
      data: data,
      labelKey: 'label',
      angleKey: 'count',
      formatter: (params: any) => {
        return `${data[params.itemId].label}\t\t\t\t\t${data[params.itemId].count}`;
      },
    };
  }

  onDynamicFiltersReady() {
    this.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }

  onInitiateVirtualAccountIssuance() {
    this.router.navigate(['/vam/vamSetup/virtualAccountIssuance']);
  }

  suspend(
    virtualAccountId: string,
    corporateCode: string,
    corporateClientCode: string,
    corporateStructureName: string,
    virtualAccount: string,
    vaAliceName: string,
    status: string,
  ) {
    this.formData = {
      ...this.formData,
      virtualAccountId,
      corporateCode,
      corporateClientCode,
      corporateStructureName,
      virtualAccount,
      vaAliceName,
      status: 'suspend',
    };
    this.showSuspendModel = true;
  }

  view(
    virtualAccountId: string,
    corporateCode: string,
    corporateClientCode: string,
    corporateStructureName: string,
    virtualAccount: string,
    vaAliceName: string,
    status: string,
  ) {
    this.formData = {
      ...this.formData,
      virtualAccountId,
      corporateCode,
      corporateClientCode,
      corporateStructureName,
      virtualAccount,
      vaAliceName,
      status: status,
    };
    this.showAccountDetailsModel = true;
  }

  activate(
    virtualAccountId: string,
    corporateCode: string,
    corporateClientCode: string,
    corporateStructureName: string,
    virtualAccount: string,
    vaAliceName: string,
    status: string,
  ) {
    this.formData = {
      ...this.formData,
      virtualAccountId,
      corporateCode,
      corporateClientCode,
      corporateStructureName,
      virtualAccount,
      vaAliceName,
      status: 'activate',
    };
    this.showActivateModel = true;
  }

  close(
    virtualAccountId: string,
    corporateCode: string,
    corporateClientCode: string,
    corporateStructureName: string,
    virtualAccount: string,
    vaAliceName: string,
    status: string,
  ) {
    this.formData = {
      ...this.formData,
      virtualAccountId,
      corporateCode,
      corporateClientCode,
      corporateStructureName,
      virtualAccount,
      vaAliceName,
      status: 'close',
    };
    this.showCloseModel = true;
  }

  onSubmitRequest() {
    this.httpService
      .httpPost('vam/process/virtualAccountStatusManagement/private/create', this.formData)
      .subscribe((response: any) => {
        this.onCloseModal();
        this.getCorporateWiseRecords({
          id: this.widgetData.corporateId,
          displayName: this.widgetData.corporateName,
        });
      });
  }

  onCloseModal() {
    this.showActivateModel = false;
    this.showSuspendModel = false;
    this.showCloseModel = false;
    this.showAccountDetailsModel = false;
    this.formData = new VirtualAccountStatusManagement();
  }
}
