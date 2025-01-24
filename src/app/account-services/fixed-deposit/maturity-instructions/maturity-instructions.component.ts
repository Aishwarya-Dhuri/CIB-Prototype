import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { FDSummaryService } from '../fd-summary/@services/fd-summary.service';
import { MaturityInstructions } from './@models/maturity-instructions.model';

@Component({
  selector: 'app-maturity-instructions',
  templateUrl: './maturity-instructions.component.html',
  styleUrls: ['./maturity-instructions.component.scss'],
})
export class MaturityInstructionsComponent implements OnInit {
  @ViewChild('maturityInstructionsForm') maturityInstructionsForm: any;

  isPrincipalCreditDisable: boolean = true;
  isPrincipalCreditRequired: boolean = false;
  isInterestCreditDisable: boolean = true;
  isInterestCreditRequired: boolean = false;

  currencyList: any[] = [];
  accountList: any[] = [];
  formData: MaturityInstructions;
  fixedDepositDataList: any[] = [];
  mode: string;
  isMDInitiated: boolean = false;
  fdNumberList: Select[] = [];
  productTypeList: Select[] = [];
  creditModeDataList: Select[] = [];

  maturityInstructionsList: Select[] = [];
  filteredMaturityInstructionsList: Select[] = [];

  stepperDetails: Stepper = {
    masterName: 'Maturity Instructions',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  constructor(
    private actionsService: ActionService,
    private currencyService: CurrencyService,
    private httpService: HttpService,
    private router: Router,
    private viewService: ViewService,
    private breadcrumbService: BreadcrumbService,
    private fdSummaryService: FDSummaryService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Maturity Instructions',
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
      { label: 'Fixed Deposit' },
      { label: 'Maturity Instructions' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData = {
      fdNumber: '',
      productTypeId: '',
      productTypeName: '',
      debitFromAccountId: '',
      debitFromAccountName: '',
      valueDate: '',
      tenor: '',
      maturityDate: '',
      amount: '',
      amountCurrency: '',
      currentBalanceCurrency: '',
      currentBalance: '',
      maturityInstructionsName: '',
      accountBalance: '',
      status: 'Unauthorized',
    };
    this.getCurrency();
    this.getDropdownData();
    this.prepareDate();
    this.getViewData();
  }

  prepareDate(): void {
    this.httpService
      .httpPost('accountServices/fixedDeposit/private/getFDNumberList')
      .subscribe((response: any) => {
        this.fdNumberList = response.dataList;
      });
    const reqData = {
      dataMap: {
        corporateId: this.userService.getCorporateId(),
      },
    };

    const data = {
      filters: [{ name: 'moduleCode', value: 'FDINITIATION', type: 'String' }],
    };

    this.httpService
      .httpPost(
        'accountServices/fixedDeposit/fdInitiation/private/dropdown/maturityInstructionsDataList',
        data,
      )
      .subscribe((response: any) => {
        this.maturityInstructionsList = response.dataList;
        this.filteredMaturityInstructionsList = [...this.maturityInstructionsList];
      });

    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', reqData)
      .subscribe((res: any) => {
        this.accountList = res.dataList;
      });
    if (this.fdSummaryService.selectedId) {
      this.httpService
        .httpPost('accountServices/fixedDeposit/private/getFixedDepositList')
        .subscribe((res: any) => {
          let dataList: any;
          dataList = res.dataList.find((res) => res.id === this.fdSummaryService.selectedId);
          this.formData = dataList;
          this.formData.fdNumber = dataList.id;
          this.formData.amountCurrency = dataList.currencyId;
          this.formData.currentBalanceCurrency = dataList.currencyId;
          this.formData.currentBalance = dataList.accountBalance;
        });
    }
  }

  fdNumberSelected(fdNumber): void {
    let dataList: any;
    this.httpService
      .httpPost('accountServices/fixedDeposit/private/getFixedDepositList')
      .subscribe((res: any) => {
        dataList = res.dataList.find((res) => res.id === fdNumber);
        this.formData = dataList;
        this.formData.fdNumber = dataList.id;
        this.formData.currentBalance = dataList.accountBalance;
        this.formData.amountCurrency = dataList.currencyId;
        this.formData.currentBalanceCurrency = dataList.currencyId;
        this.formData.maturityInstructionsName = dataList.maturityInstructionsName;
      });
  }

  getDropdownData(): void {
    const data = {
      filters: [{ name: 'moduleCode', value: 'MATURITYINSTRUCTION', type: 'String' }],
    };
    this.httpService
      .httpPost(
        'accountServices/fixedDeposit/fdInitiation/private/dropdown/fdProductTypeDataList',
        data,
      )
      .subscribe((response: any) => {
        this.productTypeList = response.dataList;
      });

    this.httpService
      .httpPost(
        'accountServices/fixedDeposit/fdInitiation/private/dropdown/creditModeDataList',
        data,
      )
      .subscribe((response: any) => {
        this.creditModeDataList = response.dataList;
      });
  }

  setProductTypeNameById(productTypeId: number): void {
    this.formData.productTypeName = this.productTypeList.find(
      (res) => +res.id === productTypeId,
    ).displayName;
  }

  getAccountNameById(debitFromAccountId: number): string {
    let accountName: string = '';
    accountName = this.accountList.find((res) => +res.id === debitFromAccountId).displayName;
    this.formData.debitFromAccountName = accountName;
    return accountName;
  }

  setDebitAccountNameById(debitFromAccountId: number): void {
    this.formData.debitFromAccountName = this.accountList.find(
      (res) => res.id === debitFromAccountId,
    );
  }

  getCurrency(): void {
    this.currencyService.getCurrencyList().subscribe((res) => {
      this.currencyList = res;
    });
    this.currencyService.getCurrencyId().subscribe((res) => {
      this.formData.amountCurrency = res;
      this.formData.currentBalanceCurrency = res;
    });
  }

  getCurrencyById(currencyId: string): string {
    return this.currencyList.find((res) => res.id === currencyId).displayName;
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('accountServices/fixedDeposit/maturityInstructions/private/view', data)
        .subscribe((formData: MaturityInstructions) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  principalCreditModeDisable(maturityInstructionsId: number): void {
    this.formData.maturityInstructionsName = this.getMaturityNameById(maturityInstructionsId);
    this.formData.principalCreditMode = '';
    this.formData.principalCreditAccount = '';
    this.formData.interestCreditMode = '';
    this.formData.interestCreditAccount = '';
    if (
      maturityInstructionsId === 2 ||
      maturityInstructionsId === 4 ||
      maturityInstructionsId === 5 ||
      maturityInstructionsId === 6
    ) {
      this.isPrincipalCreditDisable = false;
      this.isPrincipalCreditRequired = true;
      this.isInterestCreditDisable = true;
      this.isInterestCreditRequired = false;
    } else {
      this.isPrincipalCreditDisable = true;
      this.isPrincipalCreditRequired = false;
      this.isInterestCreditDisable = false;
      this.isInterestCreditRequired = true;
    }
  }

  getMaturityNameById(maturityInstructionsId: number): string {
    return this.maturityInstructionsList.find((res) => +res.id === maturityInstructionsId)
      .displayName;
  }

  getCreditModeById(creditModeId: number): string {
    return this.creditModeDataList.find((response: any) => response.id === creditModeId)
      .displayName;
  }

  getMaturityInstructions(productTypeId: number): void {
    this.filteredMaturityInstructionsList = [];
    this.filteredMaturityInstructionsList = this.maturityInstructionsList.filter(
      (response: any) => response.enrichments.productType === productTypeId,
    );
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.maturityInstructionsForm && this.maturityInstructionsForm.valid) {
        return true;
      }
      return false;
    }
    return true;
  }

  onOKClick(): void {
    this.isMDInitiated = false;
    this.goToListing();
  }

  afterSubmit(): void {
    this.isMDInitiated = true;
  }

  goToListing(): void {
    this.router.navigateByUrl(this.router.url + '/listing');
  }
}
