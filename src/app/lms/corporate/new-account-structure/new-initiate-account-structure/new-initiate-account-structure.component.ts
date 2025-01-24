import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { NewChildAccountDetails } from '../@models/newChildAccountDetails.model';
import { NewAccountDetails } from '../@models/newMainAccountDetails.model';
import { NewAccountStructureService } from '../@services/new-account-structure.service';

@Component({
  selector: 'app-new-initiate-account-structure',
  templateUrl: './new-initiate-account-structure.component.html',
  styleUrls: ['./new-initiate-account-structure.component.scss']
})
export class NewInitiateAccountStructureComponent implements OnInit {
  @ViewChild('newMainAccountDetailsComponent') newMainAccountDetailsComponent: any;
  @ViewChild('newAccountStructureHierarchyComponent') newAccountStructureHierarchyComponent: any;

  formData: any = {};

  loading: boolean;

  colDefUrl: string = 'lms/corporate-onboarding/copyStructure/copyStructureColDef';
  rowData: any[] = [];

  structureCreationType: string = 'create';

  form: NgForm;

  showMinError: string = '';
  showMaxError: string = '';

  isEdit = false;

  mainAccountDetails: NewAccountDetails = new NewAccountDetails();

  mainAccount: any;
  childAccountDetails: NewChildAccountDetails = new NewChildAccountDetails();

  stepperDetails: Stepper = {
    masterName: 'Account Structure',
    currentStep: 1,
    currentSubStep: 1,
    isSaveAsTemplateApplicable: true,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['Main Account Details', 'Structure Hierarchy', 'Review & Submit'],
  };

  treeType = 'grid';

  accountStructureHierarchy: any;

  isAdvancedChildAccountDetails: boolean = false;

  treeNode: any;

  parentAccount: any;

  accountStructureHierarchyTreeData: any[] = [];

  isAddChildAccount = false;
  isSuspendAccount = false;

  context = { componentParent: this };

  mode: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private newAccountStructureService: NewAccountStructureService,
    private viewService: ViewService,
    private httpService: HttpService,
    public userService: UserService,

  ) { }

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'LMS - Copy from a structure',
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
      { label: 'Corporate' },
      { label: 'New Account Structure' },
      { label: 'Initiate' },
      { label: 'Create New' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mainAccountDetails.corporateName = this.userService.userDetails.corporateName;

    this.structureCreationType = this.newAccountStructureService.structureCreationType;

    this.accountStructureHierarchy = [];

    this.mode = this.viewService.getMode();

    if (this.mode == 'VIEW') {
      this.stepperDetails.currentStep = this.stepperDetails.headings.length;
    }

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('lms/corporate/newAccountStructure/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.beforeRenderer();
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  selectStructure(structureId: string) {
    const data = { dataMap: { id: structureId } };
    this.httpService
      .httpPost('lms/corporate/newAccountStructure/private/view', data)
      .subscribe((formData: any) => {
        this.formData = formData;
        this.beforeRenderer();
        this.newAccountStructureService.structureCreationType = 'create';
        this.structureCreationType = 'create';
        this.loading = false;
      });
  }

  getNoOfSubSteps(stepNo: number) {
    if (stepNo === 1) {
      return 4;
    }
    return 0;
  }

  addFrequencyPreDefinedDate() {
    this.mainAccountDetails.dates.push('');
  }

  onRowDragged(event: any) { }

  onChangeMainAccount(e: any) {
    this.mainAccount = {
      accountNo: [e.displayName],
      mainAccountNo: e.displayName,
      bank: e.enrichments.bank,
      balance: e.enrichments.balance,
      country: e.enrichments.country,
      currencyId: e.enrichments.currencyId,
      currency: e.enrichments.currencyCode,
      accType: e.enrichments.accountType,
      type: e.enrichments.type,
    };
  }

  positiveRate: string = "";
  overdraftRate: string = "";
  applyToSubAcc: string = "";


  onChangePositiveRate(positiveRate) {
    this.positiveRate = positiveRate
    console.log(positiveRate);
  };

  onOverdraftRate(overdraftRate) {
    this.overdraftRate = overdraftRate
    console.log(overdraftRate);
  };

  onChangeApplyToSubAcc(applyToSubAcc) {
    console.log(applyToSubAcc);

    if (applyToSubAcc == 'Yes') {
      console.log("Yes", this.positiveRate, this, this.overdraftRate);

    }
    this.applyToSubAcc = applyToSubAcc
    console.log(applyToSubAcc);
  };

  onStepChange(stepNo: number, subStepNumber?: number) {
    if (stepNo == 0 || stepNo == 2) {
      if (subStepNumber == 4) {
        this.mainAccountDetails.accountNo = this.mainAccount.accountNo;
        this.mainAccountDetails.mainAccountNo = this.mainAccount.mainAccountNo;
        this.mainAccountDetails.bank = this.mainAccount.bank;
        this.mainAccountDetails.country = this.mainAccount.country;
        this.mainAccountDetails.currency = this.mainAccount.currency;
        this.mainAccountDetails.accType = this.mainAccount.accountType;
        this.mainAccountDetails.type = this.mainAccount.type;

        this.rowData.push({
          ...this.mainAccount,
          actions: this.getActions(),
        });
      }
    }
  }

  onChangeChildAccount(e: any) {
    this.childAccountDetails.accountNo = [...this.parentAccount.accountNo, e.displayName];
    this.childAccountDetails.bank = e.enrichments.bank;
    this.childAccountDetails.balance = e.enrichments.balance;
    this.childAccountDetails.country = e.enrichments.country;
    this.childAccountDetails.currency = e.enrichments.currency;
    this.childAccountDetails.accType = e.enrichments.accountType;
    this.childAccountDetails.type = e.enrichments.type;
  }

  onChangeAccountType(accountType: any) {
    if (accountType === 'ZBA') {
      this.childAccountDetails.minBal = '0';
      this.childAccountDetails.maxBal = '0';
    } else if (accountType === 'TBA') {
      this.onMinBalChange(); // Ensure maxBal updates when minBal changes
    } else if (accountType === 'RBA') {
      this.onMaxBalChange(); // Ensure minBal updates when maxBal changes
    }
  }

  onMinBalChange() {
    if (this.childAccountDetails.accountType === 'TBA') {
      this.childAccountDetails.maxBal = this.childAccountDetails.minBal;
    } else if (this.childAccountDetails.accountType === 'RBA') {
      if (parseFloat(this.childAccountDetails.maxBal) < parseFloat(this.childAccountDetails.minBal)) {
        this.showMinError = "Min Balance should be less than Max Balance"
      }
      else {
        this.showMinError = ""
      }
    }
  }

  onMaxBalChange() {
    if (this.childAccountDetails.accountType === 'RBA') {
      if (parseFloat(this.childAccountDetails.minBal) > parseFloat(this.childAccountDetails.maxBal)) {
        this.showMaxError = "Max Balance should be greater than Min Balance"
      }
      else {
        this.showMaxError = ""
      }
    }
  }

  onAddChildAccount(
    accountNo: string,
    bank: string,
    country: string,
    currency: string,
    accType: string,
    type: string,
  ) {
    this.parentAccount = { accountNo, bank, country, currency, accType, type };
    this.isAddChildAccount = true;
  }

  addChildAccount() {
    const childAccount = this.rowData.find((account: any, i) => {
      return account.accountNo.join(',') == this.childAccountDetails.accountNo.join(',');
    });

    if (!childAccount) {
      this.rowData.push({ ...this.childAccountDetails, actions: this.getActions() });
      this.generateOrganizationTreeData();
    }

    this.childAccountDetails = new NewChildAccountDetails();

    this.isAdvancedChildAccountDetails = false;
    this.isAddChildAccount = false;

    if (this.newAccountStructureHierarchyComponent) {
      this.newAccountStructureHierarchyComponent.refreshStructureHierarchyGrid();
    }
  }

  editAccountDetails(subAccountStep: number) {
    this.stepperDetails.currentStep = 1;
    this.stepperDetails.currentSubStep = subAccountStep + 1;
    this.isEdit = true;
  }

  submitEditAccount() {
    this.stepperDetails.currentStep = 3;
    this.stepperDetails.currentSubStep = 5;
    this.isEdit = false;
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

    console.log(JSON.stringify(this.rowData));

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

  suspend() {
    this.isSuspendAccount = true;
  }

  validateForm(stepNo: number) {
    if (stepNo == 1) {
      if (this.newMainAccountDetailsComponent && this.newMainAccountDetailsComponent.form) {
        this.newMainAccountDetailsComponent.form.form.markAllAsTouched();
        return !this.newMainAccountDetailsComponent.form.invalid;
      }
    }

    return true;
  }

  beforeRenderer() {
    this.rowData = this.formData.accountHierarchy.map((account: any) => {
      if (account.dates) {
        account.dates = account.dates.split(',');
      }

      if (account.recurrenceDays) {
        account.recurrenceDays = account.recurrenceDays.split(',');
      }

      if (account.accountNo) {
        account.accountNo = account.accountNo.split(',');
      }

      return account;
    });

    const mainAccountDetails: any = { ...this.formData };

    delete this.formData.accountHierarchy;

    if (mainAccountDetails.dates) {
      mainAccountDetails.dates = mainAccountDetails.dates.split(',');
    }
    if (mainAccountDetails.recurrenceDays) {
      mainAccountDetails.recurrenceDays = mainAccountDetails.recurrenceDays.split(',');
    }
    if (mainAccountDetails.accountNo) {
      mainAccountDetails.accountNo = mainAccountDetails.accountNo.split(',');
    }

    this.mainAccountDetails = mainAccountDetails;

    this.generateOrganizationTreeData();

    return true;
  }

  beforeSubmit() {
    const accountHierarchy = this.rowData.map((account: any) => {
      if (account.dates) {
        account.dates = account.dates.join(',');
      }

      if (account.recurrenceDays) {
        account.recurrenceDays = account.recurrenceDays.join(',');
      }

      if (account.accountNo) {
        account.accountNo = account.accountNo.join(',');
      }

      return account;
    });

    const mainAccountDetails: any = { ...this.mainAccountDetails };

    if (mainAccountDetails.dates) {
      mainAccountDetails.dates = mainAccountDetails.dates.join(',');
    }
    if (mainAccountDetails.recurrenceDays) {
      mainAccountDetails.recurrenceDays = mainAccountDetails.recurrenceDays.join(',');
    }
    if (mainAccountDetails.accountNo) {
      mainAccountDetails.accountNo = mainAccountDetails.accountNo.join(',');
    }
    this.formData = {
      ...mainAccountDetails,
      accountHierarchy,
    };

    return true;
  }

  getActions() {
    return [
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
        paramList: '',
        methodName: 'edit',
        type: 'ICON',
        displayName: 'Edit',
        icon: 'fa-pencil',
      },
      {
        index: 2,
        paramList: '',
        methodName: 'view',
        type: 'ICON',
        displayName: 'View',
        icon: 'fa-eye',
      },
      {
        index: 3,
        paramList: '',
        methodName: 'suspend',
        type: 'ICON',
        displayName: 'Suspend',
        icon: 'fa-ban',
      },
      {
        index: 4,
        paramList: '',
        methodName: 'delete',
        type: 'ICON',
        displayName: 'Delete',
        icon: 'fa-trash-alt',
      },
    ];
  }

}
