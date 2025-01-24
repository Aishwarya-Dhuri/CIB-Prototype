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
import { ConsolidatedAccountStatementService } from './@services/consolidated-account-statement.service';
import * as moment from 'moment';

@Component({
  selector: 'app-consolidated-account-statement',
  templateUrl: './consolidated-account-statement.component.html',
  styleUrls: ['./consolidated-account-statement.component.scss']
})
export class ConsolidatedAccountStatementComponent implements OnInit {
  @ViewChild('saveCriteria') saveCriteria: any;
  @Output('onSaveCriteria') onSaveCriteria = new EventEmitter<void>();

  showCorporateList: boolean = false;
  isDownload: boolean = false;
  isEmail: boolean = false;
  isUpdateCriteria: boolean = false;
  isIncludeAdditionalFields: boolean = false;
  isShowSaveSearchCriteriaModal: boolean;
  downloadOptions: string = 'EXCEL';

  accountsList: any[] = [];
  ibanAccountList: any[] = [];
  date = new Date();
  searchFilters: Filter[];
  criteriaList: any[] = [];
  entityName: string;
  criteriaData: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private httpService: HttpService,
    private consolidatedAccountStatmentService: ConsolidatedAccountStatementService,
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Account Statement',
      subHeading: null,
      widgetsActions: false,
      refresh: true,
      widgets: false,
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
      { label: 'Consolidated Account Statement' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

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
    this.searchFilters = this.consolidatedAccountStatmentService.searchFilters;

    if (!this.searchFilters || (this.searchFilters && this.searchFilters.length == 0)) {
      this.searchFilters = this.consolidatedAccountStatmentService.getResetFilters();
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
    var URL = '/historical-account-statement.xls';
    window.open('http://localhost:3000' + URL, '_blank');
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
      ? (this.consolidatedAccountStatmentService.selectedAccount = this.searchFilters[1].value)
      : (this.consolidatedAccountStatmentService.selectedAccount = this.searchFilters[2].value);
    this.consolidatedAccountStatmentService.searchFilters = this.searchFilters;
    this.router.navigateByUrl('/accountServices/services/consolidatedAccountStatementView');
  }

  onAccountSelected(accountId: string): void {
    if (this.searchFilters[0].value == 'IBAN') {
      this.consolidatedAccountStatmentService.selectedAccountNumber = this.ibanAccountList.find(
        (res: any) => res.id === accountId,
      ).enrichments.accountNo;
    } else {
      this.consolidatedAccountStatmentService.selectedAccountNumber = this.accountsList.find(
        (res: any) => res.id === accountId,
      ).enrichments.accountNo;
    }
  }

  onSelectCorporate(corporate: any) {
    this.searchFilters[1].value = corporate.corporateCode;
    this.searchFilters[2].value = corporate.corporateName;
  }

  yearData: any[] = [
    { displayName: "2015", id: "2015" },
    { displayName: "2016", id: "2016" },
    { displayName: "2017", id: "2017" },
    { displayName: "2018", id: "2018" },
    { displayName: "2019", id: "2019" },
    { displayName: "2020", id: "2020" },
    { displayName: "2021", id: "2021" },
    { displayName: "2022", id: "2022" },
    { displayName: "2023", id: "2023" },
    { displayName: "2024", id: "2024" },
    { displayName: "2025", id: "2025" }
  ]

  monthData: any[] = [
    { displayName: "January", id: "January" },
    { displayName: "February", id: "February" },
    { displayName: "March", id: "March" },
    { displayName: "April", id: "April" },
    { displayName: "May", id: "May" },
    { displayName: "June", id: "June" },
    { displayName: "July", id: "July" },
    { displayName: "August", id: "August" },
    { displayName: "September", id: "September" },
    { displayName: "October", id: "October" },
    { displayName: "November", id: "November" },
    { displayName: "December", id: "December" }
  ]

}
