import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ReallocationPercentageInputRendererComponent } from './@components/reallocation-percentage-input-renderer/reallocation-percentage-input-renderer.component';
import { InterestReallocation } from './@models/interest-reallocation.model';

@Component({
  selector: 'app-interest-reallocation',
  templateUrl: './interest-reallocation.component.html',
  styleUrls: ['./interest-reallocation.component.scss'],
})
export class InterestReallocationComponent implements OnInit {
  @ViewChild('accountDetailsTreeGrid') accountDetailsTreeGrid: any;

  isMaximizeAccountHierarchy: boolean = false;
  showReviewPopupMessage: boolean = false;

  subRuleData: any[] = [];

  formData: InterestReallocation = new InterestReallocation();

  loading: boolean;

  colDefs: any[] = [
    {
      headerName: 'Account Number',
      field: 'accountNo',
      hide: true,
    },
    {
      headerName: 'Account Type',
      field: 'accountType',
    },
    {
      headerName: 'Percentage',
      field: 'percentage',
      cellRenderer: 'reallocationPercentageInputRenderer',
    },
  ];

  reviewColDefs: any[] = [
    {
      headerName: 'Account Number',
      field: 'accountNo',
      hide: true,
    },
    {
      headerName: 'Account Type',
      field: 'accountType',
    },
    {
      headerName: 'Percentage',
      field: 'percentage',
    },
  ];

  rowData: any[] = [];

  frameworkComponents: any = {
    reallocationPercentageInputRenderer: ReallocationPercentageInputRendererComponent,
  };

  gridOptions: any;

  accountStructureHierarchyTreeData: any[] = [];

  stepperDetails: Stepper = {
    masterName: 'Interest Reallocation',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: false,
    isSaveDraftApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  context = { componentParent: this };

  mode: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private httpService: HttpService,
    public userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'LMS - Interest Reallocation',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.mode = this.viewService.getMode();

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'LMS' },
      { label: 'Transactions' },
      { label: 'Interest Reallocation' },
      { label: this.mode == 'VIEW' ? 'View' : 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.gridOptions = {
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
      },
    };

    if (this.mode == 'VIEW') {
      this.stepperDetails.currentStep = this.stepperDetails.headings.length;
    }

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('lms/generalMaster/interestReallocation/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.beforeRenderer(formData.accountHierarchy);
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onChangeReallocationRule(reallocationRule: any) {
    this.formData.showAccountDetailsGrid = false;

    this.formData.subRule = '';

    const data = { dataMap: { id: reallocationRule.id } };

    if (reallocationRule.enrichments.showSubRule) {
      this.httpService
        .httpPost('lms/generalMaster/interestReallocation/private/getSubRuleList', data)
        .subscribe((response: any) => {
          this.subRuleData = response.dataList;
          this.formData.showSubRule = true;
        });
    } else {
      this.subRuleData = [];
      this.formData.showSubRule = false;
    }

    setTimeout(() => {
      this.formData.showAccountDetailsGrid = reallocationRule.enrichments.showAccountDetailsGrid;
    }, 100);
  }

  onSelectStructure(structure: any) {
    this.formData.showAccountDetailsGrid = false;

    const structureId = structure.id;

    const data = { dataMap: { id: structureId } };
    this.httpService
      .httpPost('lms/corporate/accountStructure/private/view', data)
      .subscribe((response: any) => {
        this.beforeRenderer(response.accountHierarchy);
        this.formData.showAccountDetailsGrid = true;
        this.loading = false;
      });
  }

  beforeRenderer(accountHierarchy: any[]) {
    this.rowData = [];

    const uniqueData = [];

    accountHierarchy = accountHierarchy.filter((acc: any) => {
      const isDuplicate = uniqueData.includes(acc.accountNo);

      if (!isDuplicate) {
        uniqueData.push(acc.accountNo);
        return true;
      }

      return false;
    });

    accountHierarchy.forEach((account: any) => {
      if (account.accountNo) {
        account.accountNo = account.accountNo.split(',');
      }

      this.rowData.push({
        accountNo: account.accountNo ? account.accountNo : [],
        accountType: account.accType,
        percentage: account.percentage ? account.percentage : '0',
        sweepType: account.sweepType,
      });
    });

    if (this.accountDetailsTreeGrid) {
      this.accountDetailsTreeGrid.setRowData(this.rowData);
    }

    this.generateOrganizationTreeData();

    return true;
  }

  beforeSubmit() {
    if (this.formData.showAccountDetailsGrid && this.formData.totalPercentage != 100) {
      return false;
    }

    this.formData.accountHierarchy = this.rowData.map((account: any) => {
      if (account.accountNo) {
        account.accountNo = account.accountNo.join(',');
      }

      return account;
    });

    return true;
  }

  generateOrganizationTreeData() {
    var accounts: any[] = [];

    this.rowData.forEach((account: any) => {
      accounts.push(account.accountNo.join('.'));
    });

    var hierarchicalTree = [];

    accounts.forEach((s: any, i: number) => {
      const account = this.rowData[i];
      s.split('.').reduce(
        (object: any, value: any) => {
          var item = (object.children = object.children || []).find((q: any) => q.value === value);
          if (!item)
            object.children.push(
              (item = {
                value,
                label:
                  value +
                  '-' +
                  account.accountType +
                  (account.sweepType ? '-' + account.sweepType : ''),
                styleClass: 'node-content',
              }),
            );

          return item;
        },
        { children: hierarchicalTree },
      );
    });

    this.accountStructureHierarchyTreeData = this.getFinalTree(hierarchicalTree);
  }

  onChangePercentage(percentage: number, index: number) {
    let totalPercentage = 0;

    this.rowData[index].percentage = percentage;

    this.rowData.forEach((data: any) => {
      totalPercentage += +data.percentage;
    });

    this.formData.totalPercentage = totalPercentage;
  }

  onStepChange(stepNo: number) {
    if (stepNo == 2) {
      if (
        this.formData.reallocationRule == 'Percentage Distribution Model' ||
        (this.formData.reallocationRule == 'Adhoc' && this.formData.subRule == 'Percentage')
      )
        if (this.formData.totalPercentage == 100) {
          return true;
        } else {
          this.showReviewPopupMessage = true;
          this.stepperDetails.currentStep = 1;
          return false;
        }
    }

    return true;
  }

  validateForm(stepNo: number) {
    if (stepNo == 1) {
      if (this.formData.showSubRule) {
        return (
          this.formData.accountStructure && this.formData.reallocationRule && this.formData.subRule
        );
      }
      return this.formData.accountStructure && this.formData.reallocationRule;
    }
    return true;
  }

  reset() {
    this.rowData = [];
    this.accountStructureHierarchyTreeData = [];
    this.subRuleData = [];
    this.formData.totalPercentage = 0;

    if (this.accountDetailsTreeGrid) {
      this.accountDetailsTreeGrid.setRowData([]);
    }

    this.formData = new InterestReallocation();
  }

  private getFinalTree(tree: any[]) {
    return tree.map((t) => {
      const val = {
        ...t,
      };
      delete val.value;
      if (t.children) {
        val['expanded'] = true;
        val.children = this.getFinalTree(val.children);
      } else {
        val['type'] = 'leaf';
      }
      return val;
    });
  }
}
