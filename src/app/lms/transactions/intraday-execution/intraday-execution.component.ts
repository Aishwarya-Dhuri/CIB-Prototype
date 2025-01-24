import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Filter } from 'ag-grid-community/dist/lib/interfaces/iFilter';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { Actions } from 'src/app/base/@models/actions';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { StopPaymentRequest } from 'src/app/direct-debit/mandate-management/stop-payment-request/@model/stop-payment-request.model';
import { Criteria } from 'src/app/shared/@components/dynamic-search/@models/criteria.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';

@Component({
  selector: 'app-intraday-execution',
  templateUrl: './intraday-execution.component.html',
  styleUrls: ['./intraday-execution.component.scss']
})
export class IntradayExecutionComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;
  @ViewChild('searchResultGrid') searchResultGrid: any;

  loading: boolean;

  formData: StopPaymentRequest = new StopPaymentRequest();

  currentScreen: string = 'FILTERS';

  selectedFilters: Filter[] = [];


  criteriaList: any[] = [];

  entityName: string = 'INTRADAY_EXECUTION';

  colDefUrl: string = 'lms/transactions/intradayExecution/private/intradayExecutionColDefs';
  rowData: any[] = [];
  context: any = { componentParent: this };
  frameworkComponents: any = {};

  gridOptions: any = {
    rowModelType: 'clientSide',
  };

  gridOptionsView: any;

  colDefs: any[] = [
    {
      headerName: 'Account Number',
      field: 'accountNo',
      hide: true,
    },
    {
      headerName: 'Bank',
      field: 'bank',
    },
    {
      headerName: 'Country',
      field: 'country',
    },
    {
      headerName: 'Currency',
      field: 'currency',
    },
    {
      headerName: 'Type',
      field: 'accType',
    },
    {
      headerName: 'Type',
      field: 'type',
    },
  ];

  rowDataView: any[] = [
    {
      accountNo: ['777000003002-SAR'],
      bank: 'Demo Bank',
      country: 'India',
      currency: 'SAR',
      accType: 'CURRENT',
      type: 'Internal'
    },
    {
      accountNo: ['777000003002-SAR', '777000003002-SAR'],
      bank: 'Demo Bank',
      country: 'India',
      currency: 'SAR',
      accType: 'CURRENT',
      type: 'Internal'
    },
    {
      accountNo: ['777000003002-SAR', '777000003002-SAR', '777200000013-SAR'],
      bank: 'Demo Bank',
      country: 'India',
      currency: 'SAR',
      accType: 'SAVING',
      type: 'Internal'
    },
    {
      accountNo: ['777000003002-SAR', '777003004-SAR'],
      bank: 'Demo Bank',
      country: 'India',
      currency: 'SAR',
      accType: 'CURRENT',
      type: 'Internal'
    },
  ];

  // accountStructureHierarchyTreeData = [
  //   {
  //     label: '777000003002-SAR',
  //     value: "777000003002-SAR",
  //     styleClass: 'node-content',
  //     children: [
  //       {
  //         value: "777200000013-SAR",
  //         styleClass: "node-content",
  //         label: "777200000013-SAR"
  //       }
  //     ]
  //   }
  // ];

  accountStructureHierarchyTreeData = [
    {
      "value": "777000003002-INR",
      "label": "777000003002-INR-CURRENT",
      "styleClass": "node-content",
      "children": [
        {
          "value": "777000003002-INR",
          "label": "777000003002-INR-CURRENT",
          "styleClass": "node-content",
          "children": [
            {
              "value": "777200000013-INR",
              "label": "777200000013-INR-SAVING",
              "styleClass": "node-content"
            }
          ]
        },
        {
          "value": "777003004-INR",
          "label": "777003004-INR-CURRENT",
          "styleClass": "node-content"
        }
      ]
    }
  ]


  treeNode: any;

  treeType: string = 'tree';

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private toasterService: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Intraday Execution',
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
      { label: 'LMS' },
      { label: 'Transactions' },
      { label: 'Intraday Execution' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getCriteriaList();

    this.gridOptionsView = {
      rowModelType: 'clientSide',
      treeData: true,
      animateRows: true,
      pagination: false,
      groupDefaultExpanded: -1,
      defaultColDef: {
        flex: 1,
        resizable: true,
      },
      autoGroupColumnDef: {
        headerName: 'Account Number',
        minWidth: 400,
        cellRendererParams: {
          suppressCount: true,
        },
      },
      getDataPath: (data: any) => {
        return data.accountNo;
      },
      isGroupOpenByDefault: (params: any) => {
        return true;
      }
    }

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

  selectedTreeNode(node: any) {
    this.treeNode = node;
  }

  getRecords(filters: Filter[]) {
    this.selectedFilters = filters;

    this.httpService
      .httpPost('lms/transactions/intradayExecution/private/getIntraList', {
        dataMap: filters,
      })
      .subscribe((data: any) => {
        this.rowData = data.dataList;
        this.currentScreen = 'SEARCH_RESULTS';
      });
  }

  onView(id: string) {
    console.log("before", id);

    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('lms/transactions/intradayExecution/private/view', data)
      .subscribe((formData: any) => {
        this.formData = { ...formData, corporateCode: formData.id };
        console.log("after", id, "and", this.formData);
        this.currentScreen = 'VIEW';
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

  onExecute() {
    this.toasterService.showToaster({
      severity: 'success',
      detail: 'Executed Successfully',
    });
    this.refresh();
  };

  refresh() {
    this.searchResultGrid.refreshGridList();
  }


}
