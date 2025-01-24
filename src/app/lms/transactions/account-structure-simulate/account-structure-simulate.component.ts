import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BalanceInputRendererComponent } from './@components/balance-input-renderer/balance-input-renderer.component';
import { AccountStructureSimulate } from './@model/account-structure-simulate.model';

@Component({
  selector: 'app-account-structure-simulate',
  templateUrl: './account-structure-simulate.component.html',
  styleUrls: ['./account-structure-simulate.component.scss'],
})
export class AccountStructureSimulateComponent implements OnInit {
  @ViewChild('accountDetailsTreeGrid') accountDetailsTreeGrid: any;

  loading: boolean;
  isEditAccountStructure: boolean = false;

  isFieldsEditable: boolean = true;

  mainAccountDetails: any;

  accountStructureHierarchyTreeData: any[] = [];

  formData: AccountStructureSimulate = new AccountStructureSimulate();

  columnDefs: any[] = [
    {
      headerName: 'Account Number',
      field: 'accountNo',
      hide: true,
    },
    {
      headerName: 'Account Type',
      field: 'accType',
    },
    {
      headerName: 'Bank',
      field: 'bank',
    },
    {
      headerName: 'Type',
      field: 'type',
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: 'actionCellRenderer',
    },
  ];

  rowData: any[] = [];

  accountBalanceColumnDefs: any[] = [
    {
      headerName: 'Account Number',
      field: 'accountNo',
      hide: true,
    },
    {
      headerName: 'Account Type',
      field: 'accType',
    },
    {
      headerName: 'Balance as of Now',
      field: 'balance',
    },
    {
      headerName: 'Balance for Simulation',
      field: 'balanceForSimulation',
      cellRenderer: 'balanceInputRenderer',
    },
  ];

  accountBalanceRowData: any[] = [];

  accountFundMovementColumnDefs: any[] = [
    {
      headerName: 'Account Number',
      field: 'accountNo',
      hide: true,
    },
    {
      headerName: 'Account Type',
      field: 'accType',
    },
    {
      headerName: 'Balance for Simulation',
      field: 'balance',
    },
    {
      headerName: 'Balance after Simulation',
      field: 'balanceForSimulation',
    },
    {
      headerName: 'Interest Before Simulation',
      field: 'interestBeforeSimulation',
    },
    {
      headerName: 'Interest After Simulation',
      field: 'interestAfterSimulation',
    },
    {
      headerName: 'Net Interest (Gain/Loss)',
      field: 'netInterest',
    },
  ];

  accountFundMovementRowData: any[] = [];

  gridOptions: any;

  frameworkComponents: any = {
    balanceInputRenderer: BalanceInputRendererComponent,
  };

  stepperDetails: Stepper = {
    masterName: 'Account Structure Simulate',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: false,
    isSaveDraftApplicable: false,
    isSecondLastStepLabelAsReview: false,
    headings: ['Account Structure Details', 'Account Balance', 'Simulate Result Details'],
  };

  context = { componentParent: this };

  mode: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private httpService: HttpService,
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'LMS - Account Structure Simulate',
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
      { label: 'LMS' },
      { label: 'Transactions' },
      { label: 'Account Structure Simulate' },
      { label: 'Execute' },
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

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('lms/transactions/accountStructureSimulate/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.beforeRenderer(formData.accountHierarchy);

          if (this.mode == 'VIEW') {
            this.calculateAccountFundMovementRowData();
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onChangeAccountStructure(structure: any) {
    const structureId = structure.id;

    this.formData.sweepType = structure.enrichments.sweepType;
    this.formData.executionSequence = structure.enrichments.executionSequence;

    const data = { dataMap: { id: structureId } };
    this.httpService
      .httpPost('lms/corporate/newAccountStructure/private/view', data)
      .subscribe((response: any) => {
        this.beforeRenderer(response.accountHierarchy);

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

      if (account.accountNo && account.accountNo.length == 1) {
        this.mainAccountDetails = {
          accountNo: account.accountNo && account.accountNo.length > 0 ? account.accountNo[0] : '',
          accType: account.accType,
          bank: account.bank,
          balance: account.balance,
          type: account.type,
          country: account.country,
          currency: account.currency,
        };
      }

      this.rowData.push({
        id: account.id,
        accountNo: account.accountNo ? account.accountNo : [],
        accType: account.accType,
        bank: account.bank,
        type: account.type,
        balance: account.balance,
        country: account.country,
        currency: account.currency,
        actions: [
          {
            index: 0,
            paramList: 'accountNo,bank,country,currency,accType,type',
            methodName: 'onAddChildAccount',
            type: 'ICON',
            displayName: 'Add',
            icon: 'fa-plus',
          },
          {
            index: 1,
            paramList: 'id',
            methodName: 'editAccountDetail',
            type: 'ICON',
            displayName: 'Edit',
            icon: 'fa-pencil',
          },
          {
            index: 2,
            paramList: 'id',
            methodName: 'viewAccountDetail',
            type: 'ICON',
            displayName: 'View',
            icon: 'fa-eye',
          },
          {
            index: 4,
            paramList: 'id',
            methodName: 'deleteAccountDetail',
            type: 'ICON',
            displayName: 'Delete',
            icon: 'fa-trash-alt',
          },
        ],
      });

      this.accountBalanceRowData.push({
        id: account.id,
        accountNo: account.accountNo ? account.accountNo : [],
        accType: account.accType,
        balance: account.balance,
        balanceForSimulation: account.balance,
      });
    });

    if (this.accountDetailsTreeGrid) {
      this.accountDetailsTreeGrid.setRowData(this.rowData);
    }

    this.generateOrganizationTreeData();

    return true;
  }

  onStepChange(stepNo: number) {
    if (stepNo == 3) {
      this.calculateAccountFundMovementRowData();
    }
  }

  calculateAccountFundMovementRowData() {
    const positiveRate = 0.05;
    const overdraftRate = 0.06;
    this.accountBalanceRowData.forEach((account: any) => {
      this.accountFundMovementRowData.push({
        accountNo: account.accountNo,
        accType: account.accType,
        balance: account.balance,
        balanceForSimulation: account.balanceForSimulation,
        interestBeforeSimulation: ((account.balance * overdraftRate) / 365).toFixed(2),
        interestAfterSimulation: ((account.balanceForSimulation * positiveRate) / 365).toFixed(2),
        netInterest: (
          (account.balance * overdraftRate) / 365 -
          (account.balanceForSimulation * positiveRate) / 365
        ).toFixed(2),
      });
    });
  }

  beforeSubmit() {
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

    accounts.forEach((s: any) =>
      s.split('.').reduce(
        (object: any, value: any) => {
          var item = (object.children = object.children || []).find((q: any) => q.value === value);
          if (!item)
            object.children.push(
              (item = {
                value,
                label: value,
                styleClass: 'node-content',
              }),
            );

          return item;
        },
        { children: hierarchicalTree },
      ),
    );

    this.accountStructureHierarchyTreeData = this.getFinalTree(hierarchicalTree);
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

  onChangeBalance(balance: number, index: number) {
    this.accountBalanceRowData[index].balanceForSimulation = balance;
  }

  onChangeChildAccount(e: any) { }

  onAddChildAccount(
    accountNo: string,
    bank: string,
    country: string,
    currency: string,
    accType: string,
    type: string,
  ) { }

  addChildAccount() { }

  editAccountDetail(id: number) { }

  viewAccountDetail(id: number) { }

  deleteAccountDetail(id: number) { }

  onFundMovementReportForSimulation() {
    const fileUrl = `/assets/FundMovement_Simulation.xlsx` // Update with the actual file path
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'FundMovementReport.xlsx'; // The name of the file after downloading
    link.click();
  };

  submitEditAccount() { }
}
