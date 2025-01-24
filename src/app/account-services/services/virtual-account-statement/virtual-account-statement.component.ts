import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { Criteria } from 'src/app/shared/@components/dynamic-search/@models/criteria.model';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { VirtualAccountStatementService } from './@services/virtual-account-statement.service';
import * as moment from 'moment';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-virtual-account-statement',
  templateUrl: './virtual-account-statement.component.html',
  styleUrls: ['./virtual-account-statement.component.scss'],
})
export class VirtualAccountStatementComponent implements OnInit {
  @ViewChild('saveCriteria') saveCriteria: any;
  @Output('onSaveCriteria') onSaveCriteria = new EventEmitter<void>();

  loading: boolean;

  isTransactionTypeDelete: boolean = false;
  isTransactionAmountDelete: boolean = false;
  isReferenceNumberDelete: boolean = false;
  isDownload: boolean = false;
  isEmail: boolean = false;
  isAdvanceSearch: boolean = false;
  isIncludeAdditionalFields: boolean = false;
  downloadOptions: string = 'EXCEL';
  selectedOptions: string[] = [];
  viewPort: string;

  criteriaList: any[] = [];
  searchFilters: Filter[];
  entityName: string;
  criteriaData: string;
  isUpdateCriteria: boolean = false;
  isShowSaveSearchCriteriaModal: boolean;

  accountsList: any[] = [];
  virtualAccountsList: any[] = [];
  dateRangeOptions: any[] = [
    // { id: 'This Week', displayName: 'This Week' },
    // { id: 'This Month', displayName: 'This Month' },
    // { id: 'Previous Month', displayName: 'Previous Month' },
    // { id: 'Custom', displayName: 'Custom' },
  ];
  selectedAccountPeriodOptions: any;
  accountPeriod: any;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private virtualAccountStatementService: VirtualAccountStatementService,
    private viewPortService: ViewportService,
    private viewService: ViewService,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const actions: Actions = {
      heading: 'Virtual Account Statement',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
      favourite: true,
      help: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Services' },
      { label: 'Service' },
      { label: 'Virtual Account Statement' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getDropdownData();
    this.resetFilters();

    this.entityName = this.menuService.getSelectedEntityName();

    if (!this.entityName) {
      this.router.navigate(['/dashboard', 'consolidated'], { relativeTo: this.route });
      return;
    }

    if (this.viewService.getMode() == 'PREFILLED') {
      const data = this.viewService.getExtraData();
      this.searchFilters[0].value = data.id;
      this.viewService.clearAll();
    }

    this.viewPortService.getViewport().subscribe((viewPort: string) => {
      this.viewPort = viewPort;
    });

    this.getAccountListByCorporate();

    this.getCriteriaList();

    this.loading = false;
  }

  getDropdownData(): void {
    this.httpService
      .httpPost('accountServices/services/accountStatement/private/dropdown/dateRangeOptionsList')
      .subscribe((response) => {
        this.dateRangeOptions = response.dataList;
        this.selectedAccountPeriodOptions = this.dateRangeOptions[0].id;
        this.onChangedateRangeOption(this.selectedAccountPeriodOptions, '');
      });
  }

  showSaveSearchCriteriaModal(): void {
    this.isShowSaveSearchCriteriaModal = true;
    this.criteriaData = JSON.stringify(this.searchFilters);
  }

  getCriteriaList(): void {
    const getCriteriaUrl = 'commons/searchCriteria/private/getCriterias';
    const data = { dataMap: { entityName: this.entityName, criteriaType: 'QUERYSEARCH' } };

    this.httpService.httpPost(getCriteriaUrl, data).subscribe((response: any) => {
      this.criteriaList = response.dataMap.SearchCriteria;
    });
  }

  getCriteriaFilterCount(criteria: Criteria): number {
    if (criteria) {
      return JSON.parse(criteria.criteria).length;
    }
    return 0;
  }

  onChangedateRangeOption(fp: string, accountCalender: any) {
    this.selectedAccountPeriodOptions = fp;
    this.virtualAccountStatementService.selectedAccountPeriodOption = fp;

    if (fp == this.dateRangeOptions[0].id) {
      const startCurrentDay = moment().format('DD-MMM-YYYY');
      const endCurrentDay = moment().format('DD-MMM-YYYY');
      this.accountPeriod = [startCurrentDay, endCurrentDay];
    } else if (fp == this.dateRangeOptions[1].id) {
      const startPreviousDay = moment().subtract(1, 'days').format('DD-MMM-YYYY');
      const endPreviousDay = moment().subtract(1, 'days').format('DD-MMM-YYYY');
      this.accountPeriod = [startPreviousDay, endPreviousDay];
    } else if (fp == this.dateRangeOptions[2].id) {
      const startPreviousMonth = moment()
        .subtract(1, 'months')
        .startOf('month')
        .format('DD-MMM-YYYY');
      const endPreviousMonth = moment().subtract(1, 'months').endOf('month').format('DD-MMM-YYYY');
      this.accountPeriod = [startPreviousMonth, endPreviousMonth];
    } else if (fp == this.dateRangeOptions[3].id) {
      const startCurrentDateToDate = moment().clone().startOf('month').format('DD-MMM-YYYY');
      const endCurrentDateToDate = moment().format('DD-MMM-YYYY');
      this.accountPeriod = [startCurrentDateToDate, endCurrentDateToDate];
    } else {
      const startSpecifyDate = moment().subtract(2, 'months').format('DD-MMM-YYYY');
      const endSpecifyDate = moment().format('DD-MMM-YYYY');
      this.accountPeriod = [startSpecifyDate, endSpecifyDate];
      accountCalender ? accountCalender.showCalender() : '';
    }
    this.onChangeAccountPeriod();
    this.searchFilters[4].value = this.accountPeriod;
  }

  onChangeAccountPeriod() {
    if (this.accountPeriod[0] && this.accountPeriod[1]) {
      const accountPeriod: any = this.accountPeriod;
      this.accountPeriod = accountPeriod.join(' - ');
      this.virtualAccountStatementService.accountPeriod = accountPeriod.join(' - ');
    }
  }

  applyCriteria(criteria: Criteria): void {
    this.searchFilters = [];
    this.searchFilters = JSON.parse(criteria.criteria);
    this.onAccountSelected(this.searchFilters[0].value);
    if (
      this.searchFilters[5].value ||
      this.searchFilters[6].value ||
      this.searchFilters[7].value ||
      this.searchFilters[8].value
    ) {
      this.isAdvanceSearch = true;
    }
  }

  deleteCriteria(criteria: Criteria): void {
    const url = 'commons/searchCriteria/private/delete';
    const data = { dataMap: { id: criteria.id } };
    this.httpService.httpPost(url, data).subscribe(() => {
      this.getCriteriaList();
    });
  }

  onSavedCriteria(): void {
    this.onSaveCriteria.emit();
    this.getCriteriaList();
  }

  getAccountListByCorporate(): void {
    const data = { dataMap: { corporateId: this.userService.userDetails.corporateId } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        this.accountsList = response.dataList;
      });
  }

  getVirtualAccountListByAccount(accountNo: any): void {
    const data = { dataMap: { accountNo } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/virtualAccountList', data)
      .subscribe((response: any) => {
        this.virtualAccountsList = response.dataList;
      });
  }

  resetFilters(): void {
    this.searchFilters = this.virtualAccountStatementService.searchFilters;

    if (!this.searchFilters || (this.searchFilters && this.searchFilters.length == 0)) {
      this.searchFilters = this.virtualAccountStatementService.getResetFilters();
    }

    this.isAdvanceSearch = false;
  }

  add(): void {
    if (this.selectedOptions.includes('Transaction Amount')) {
      this.isTransactionAmountDelete = false;
    }
    if (this.selectedOptions.includes('Reference Number')) {
      this.isReferenceNumberDelete = false;
    }
    if (this.selectedOptions.includes('Transaction Type')) {
      this.isTransactionTypeDelete = false;
    }
    this.selectedOptions = [];
  }

  onDownload(): void {
    this.isDownload = false;
    if (this.downloadOptions == 'EXCEL') {
      var URL = '/account-statement.xls';
      this.httpService.httpDownload(URL);
    }
  }

  onEmail() {
    this.isEmail = false;
  }

  viewOnScreenClick(): void {
    this.virtualAccountStatementService.selectedVirtualAccount = this.searchFilters[1].value;

    this.virtualAccountStatementService.searchFilters = this.searchFilters;

    this.router.navigateByUrl('/accountServices/services/virtualAccountStatementView');
  }

  onAccountSelected(account: any): void {
    const accountNo = this.accountsList.find((res: any) => res.id === account.id)?.enrichments
      .accountNo;

    console.log(accountNo);

    this.virtualAccountStatementService.selectedAccountNumber = accountNo;

    this.searchFilters[0].value = account.id;
    this.searchFilters[0].displayValue = account.displayName;
    this.getVirtualAccountListByAccount(accountNo);
  }

  onVirtualAccountSelected(virtualAccount: any): void {
    this.virtualAccountStatementService.selectedVirtualAccountNumber =
      this.virtualAccountsList.find(
        (res: any) => res.id === virtualAccount.id,
      )?.enrichments.virtualAccountNumber;

    this.searchFilters[1].value = virtualAccount.id;
    this.searchFilters[1].displayValue = virtualAccount.displayName;
  }
}
