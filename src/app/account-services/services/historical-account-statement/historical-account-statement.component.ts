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
import { HistoricalAccountStatementService } from './@services/historical-account-statement.service';
import * as moment from 'moment';

@Component({
  selector: 'app-historical-account-statement',
  templateUrl: './historical-account-statement.component.html',
  styleUrls: ['./historical-account-statement.component.scss'],
})
export class HistoricalAccountStatementComponent implements OnInit {
  @ViewChild('saveCriteria') saveCriteria: any;
  @Output('onSaveCriteria') onSaveCriteria = new EventEmitter<void>();

  isDownload: boolean = false;
  isEmail: boolean = false;
  isUpdateCriteria: boolean = false;
  isIncludeAdditionalFields: boolean = false;
  isShowSaveSearchCriteriaModal: boolean;
  downloadOptions: string = 'EXCEL';

  accountsList: any[] = [];
  ibanAccountList: any[] = [];
  date = new Date();
  dateRangeOptions: any[] = [
    {
      id: 'one',
      displayName: moment(new Date(this.date.getFullYear(), this.date.getMonth() - 6, 1)).format(
        'MMMM YYYY',
      ),
    },
    {
      id: 'two',
      displayName: moment(new Date(this.date.getFullYear(), this.date.getMonth() - 7, 1)).format(
        'MMMM YYYY',
      ),
    },
    {
      id: 'three',
      displayName: moment(new Date(this.date.getFullYear(), this.date.getMonth() - 8, 1)).format(
        'MMMM YYYY',
      ),
    },
    { id: 'Previous Fiscal Year', displayName: 'Previous Fiscal Year' },
    { id: 'Custom', displayName: 'Custom' },
  ];
  selectedHistoricalPeriodOptions: string = this.dateRangeOptions[4].id;

  historicalPeriod: any = '01-Jan-2022 - 30-Jun-2022';

  searchFilters: Filter[];
  criteriaList: any[] = [];
  entityName: string;
  criteriaData: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private httpService: HttpService,
    private historicalAccountStatmentService: HistoricalAccountStatementService,
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Account Statement',
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
      { label: 'Account Services' },
      { label: 'Service' },
      { label: 'Historical Account Statement' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.selectedHistoricalPeriodOptions =
      this.historicalAccountStatmentService.selectedHistoricalPeriodOption;

    this.resetFilters();

    this.entityName = this.menuService.getSelectedEntityName();

    if (!this.entityName) {
      this.router.navigate(['/dashboard', 'consolidated'], { relativeTo: this.route });
      return;
    }

    this.getAccountListByCorporate();

    this.getCriteriaList();
  }

  showSaveSearchCriteriaModal(): void {
    this.isShowSaveSearchCriteriaModal = true;
    this.criteriaData = JSON.stringify(this.searchFilters);
  }

  onChangedateRangeOption(fp: string, historicalCalender: any) {
    this.selectedHistoricalPeriodOptions = fp;
    this.historicalAccountStatmentService.selectedHistoricalPeriodOption = fp;
    const date = new Date();

    if (fp == this.dateRangeOptions[0].id) {
      const firstDay = moment(new Date(date.getFullYear(), date.getMonth() - 6, 1)).format(
        'DD-MMM-YYYY',
      );
      const lastDay = moment(new Date(date.getFullYear(), date.getMonth() - 5, 0)).format(
        'DD-MMM-YYYY',
      );
      this.historicalPeriod = [firstDay, lastDay];
      this.onChangeHistoricalPeriod();
    } else if (fp == this.dateRangeOptions[1].id) {
      const firstDay = moment(new Date(date.getFullYear(), date.getMonth() - 7, 1)).format(
        'DD-MMM-YYYY',
      );
      const lastDay = moment(new Date(date.getFullYear(), date.getMonth() - 6, 0)).format(
        'DD-MMM-YYYY',
      );
      this.historicalPeriod = [firstDay, lastDay];
      this.onChangeHistoricalPeriod();
    } else if (fp == this.dateRangeOptions[2].id) {
      const firstDay = moment(new Date(date.getFullYear(), date.getMonth() - 8, 1)).format(
        'DD-MMM-YYYY',
      );
      const lastDay = moment(new Date(date.getFullYear(), date.getMonth() - 7, 0)).format(
        'DD-MMM-YYYY',
      );
      this.historicalPeriod = [firstDay, lastDay];
      this.onChangeHistoricalPeriod();
    } else if (fp == this.dateRangeOptions[3].id) {
      const lastDay = moment(new Date(date.setFullYear(date.getFullYear(), 2, 31))).format(
        'DD-MMM-YYYY',
      );

      const firstDay = moment(new Date(date.setFullYear(date.getFullYear() - 1, 3, 1))).format(
        'DD-MMM-YYYY',
      );
      console.log(date);
      console.log(date.getFullYear() - 1 + '' + date.getMonth);

      this.historicalPeriod = [firstDay, lastDay];
      this.onChangeHistoricalPeriod();
    } else {
      this.historicalPeriod = '';
      historicalCalender.showCalender();
    }
  }

  onChangeHistoricalPeriod() {
    if (this.historicalPeriod[0] && this.historicalPeriod[1]) {
      const historicalPeriod: any = this.historicalPeriod;
      this.historicalPeriod = historicalPeriod.join(' - ');
    }
  }

  onSavedCriteria(): void {
    this.onSaveCriteria.emit();
    this.getCriteriaList();
  }

  getCriteriaList(): void {
    const getCriteriaUrl = 'commons/searchCriteria/private/getCriterias';
    const data = { dataMap: { entityName: this.entityName, criteriaType: 'QUERYSEARCH' } };

    this.httpService.httpPost(getCriteriaUrl, data).subscribe((response: any) => {
      this.criteriaList = response.dataMap.SearchCriteria;
    });
  }

  getCriteriaFilterCount(criteria: Criteria): number {
    return JSON.parse(criteria.criteria).length;
  }

  applyCriteria(criteria: Criteria): void {
    this.searchFilters = [];
    this.searchFilters = JSON.parse(criteria.criteria);
  }

  resetFilters(): void {
    this.searchFilters = this.historicalAccountStatmentService.searchFilters;

    if (!this.searchFilters || (this.searchFilters && this.searchFilters.length == 0)) {
      this.searchFilters = this.historicalAccountStatmentService.getResetFilters();
    }
  }

  deleteCriteria(criteria: Criteria): void {
    const url = 'commons/searchCriteria/private/delete';
    //const data = { "id": criteria.id, "type": "SearchCriteria", "version": criteria.version };
    const data = { dataMap: { id: criteria.id } };
    this.httpService.httpPost(url, data).subscribe(() => {
      this.getCriteriaList();
    });
  }

  onDownload() {
    this.isDownload = false;

    if (this.downloadOptions == 'EXCEL') {
      var URL = '/historical-account-statement.xls';
      window.open('http://localhost:3000' + URL, '_blank');
    }
  }

  onEmail() {
    this.isEmail = false;
  }

  getAccountListByCorporate() {
    const data = { dataMap: { corporateId: this.userService.userDetails.corporateId } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        this.accountsList = response.dataList;
      });
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/ibanAccountList', data)
      .subscribe((response: any) => {
        this.ibanAccountList = response.dataList;
      });
  }

  viewOnScreenClick() {
    this.searchFilters[1].value
      ? (this.historicalAccountStatmentService.selectedAccount = this.searchFilters[1].value)
      : (this.historicalAccountStatmentService.selectedAccount = this.searchFilters[2].value);

    this.historicalAccountStatmentService.searchFilters = this.searchFilters;

    this.router.navigateByUrl('/accountServices/services/historicalAccountStatementView');
  }

  onAccountSelected(accountId: string): void {
    if (this.searchFilters[0].value == 'IBAN') {
      this.historicalAccountStatmentService.selectedAccountNumber = this.ibanAccountList.find(
        (res: any) => res.id === accountId,
      ).enrichments.accountNo;
    } else {
      this.historicalAccountStatmentService.selectedAccountNumber = this.accountsList.find(
        (res: any) => res.id === accountId,
      ).enrichments.accountNo;
    }
  }
}
