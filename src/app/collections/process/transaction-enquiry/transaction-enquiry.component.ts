import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { Criteria } from 'src/app/shared/@components/dynamic-search/@models/criteria.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { TransactionQuery } from './@models/transaction-query.model';

@Component({
  selector: 'app-transaction-enquiry',
  templateUrl: './transaction-enquiry.component.html',
  styleUrls: ['./transaction-enquiry.component.scss']
})
export class TransactionEnquiryComponent implements OnInit {
  @ViewChild('saveCriteria') saveCriteria: any;
  @Output('onSaveCriteria') onSaveCriteria = new EventEmitter<void>();

  gridOptions = {
    rowSelection: 'multiple',
    suppressRowClickSelection: true
  };


  selectedFilters: Filter[] = [];
  criteriaList: any[] = [];
  rowData: any[] = [];
  formData: TransactionQuery = new TransactionQuery();
  showCorporateList: boolean = false;
  isUpdateCriteria: boolean = false;
  isShowSaveSearchCriteriaModal: boolean;
  criteriaData: string;
  searchFilters: Filter[];
  entityName: string;
  currentScreen: string = 'FILTERS';
  colDefUrl =
    'collections/process/transactionQuery/private/fileUploadLogListColDefs';
  dataUrl = 'collections/process/transactionQuery/private/getAllList';

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {


    const actions: Actions = {
      heading: 'Transaction Enquiry',
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
      { label: 'Forex' },
      { label: 'General Masters' },
      { label: 'Transaction Enquiry' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getCriteriaList();

    this.entityName = this.menuService.getSelectedEntityName();

    if (!this.entityName) {
      this.router.navigate(['/dashboard', 'consolidated'], { relativeTo: this.route });
      return;
    }
  }


  getSearchResults(values: any): void {
    const filters: any[] = [
      // {
      //   name: 'corporateCode',
      //   type: 'String',
      //   displayName: 'Corporate Code',
      //   displayValue: this.formData.corporateCode,
      // },
      // {
      //   name: 'corporateName',
      //   type: 'String',
      //   displayName: 'Corporate Name',
      //   displayValue: this.formData.corporateName,
      // },
      {
        name: 'product',
        type: 'String',
        displayName: 'Product',
        displayValue: this.formData.product,
      },
      {
        name: 'status',
        type: 'String',
        displayName: 'Status',
        displayValue: this.formData.status,
      },
      {
        name: 'status2',
        type: 'String',
        displayName: 'Status 2',
        displayValue: this.formData.status2,
      }
    ];
    this.selectedFilters = filters;

    this.httpService
      .httpPost('collections/process/transactionQuery/private/getStatementFile', {
        dataMap: filters,
      })
      .subscribe((data: any) => {
        this.rowData = data.dataList;
        this.currentScreen = 'SEARCH_RESULTS';
      });
  }


  onReset(): void {
    this.formData = new TransactionQuery();
  }

  onClear(): void {
    this.formData = new TransactionQuery();
    this.selectedFilters = [];
    this.currentScreen = 'FILTERS';
  }

  cancel() {
    this.router.navigateByUrl('/dashboard/consolidated');
  }

  onDownloadClick() {
    this.httpService.httpDownload('consolidatedAccountStatement/may_2022_Statement.pdf');
  }

  onClearSearchClick() {
    this.selectedFilters = [];
    this.router.navigate(['../'], { relativeTo: this.route });
  }






  getCriteriaList(): void {
    const getCriteriaUrl = 'commons/searchCriteria/private/getCriterias';
    const data = { dataMap: { entityName: this.entityName, criteriaType: 'QUERYSEARCH' } };

    this.httpService.httpPost(getCriteriaUrl, data).subscribe((response: any) => {
      this.criteriaList = response.dataMap.SearchCriteria;
    });
  }

  onSavedCriteria(): void {
    this.onSaveCriteria.emit();
    this.getCriteriaList();
  }

  showSaveSearchCriteriaModal(): void {
    this.isShowSaveSearchCriteriaModal = true;
    this.criteriaData = JSON.stringify(this.searchFilters);
  }

  deleteCriteria(criteria: Criteria): void {
    const url = 'commons/searchCriteria/private/delete';
    const data = { dataMap: { id: criteria.id } };
    this.httpService.httpPost(url, data).subscribe(() => {
      this.getCriteriaList();
    });
  }

  applyCriteria(criteria: Criteria): void {
    this.searchFilters = [];
    this.searchFilters = JSON.parse(criteria.criteria);
  }

  // getCriteriaFilterCount(criteria: Criteria): number {
  //   if (criteria) {
  //     return JSON.parse(criteria.criteria).length;
  //   }
  //   return 0;
  // }

  suggestions = [
    {
      id: 1,
      displayName: "Cash Request in Last Week",
      displayValue: "26-Dec-2022 - 31-Jan-2023"
    },
    {
      id: 2,
      displayName: "Cheque Request in Last Week",
      displayValue: "26-Dec-2022 - 31-Jan-2023"
    },
    {
      id: 3,
      displayName: "Cash Payment in Last week",
      displayValue: "5"
    },
    {
      id: 4,
      displayName: "Cheque Request raised for more than 50,000 Amount",
      displayValue: ""
    },

  ]

  isShowSuggested = false
  isShowSuggestedPaymentMethod = false

  onClickSuggestion(data) {
    if (data.id == 1) {
      this.isShowSuggested = true
    } else if (data.id == 2) {
      this.isShowSuggested = true
    } else if (data.id == 3) {
      this.isShowSuggestedPaymentMethod = true
    }
  }

}
