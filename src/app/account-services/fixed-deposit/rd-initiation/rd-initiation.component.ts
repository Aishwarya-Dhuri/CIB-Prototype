import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RdInitiation } from './@models/rd-initiation.model';
import { Select } from 'src/app/shared/@models/select.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';



@Component({
  selector: 'app-rd-initiation',
  templateUrl: './rd-initiation.component.html',
  styleUrls: ['./rd-initiation.component.scss']
})
export class RdInitiationComponent implements OnInit {
  formData: RdInitiation = new RdInitiation();
  @ViewChild('rdInitiationForm') rdInitiationForm: any;
  @Input('isViewMode') isViewMode: boolean = false;

  loading: boolean = false;
  mode: string;
  currencyList: any[] = [];
  isRDInitiated: boolean = false;
  isPrincipalCreditDisable: boolean = true;
  isPrincipalCreditRequired: boolean = false;
  isInterestCreditDisable: boolean = true;
  isInterestCreditRequired: boolean = false;
  isTermsAndCondition: boolean = false;
  productTypeList: Select[] = [];
  accountList: Select[] = [];
  maturityInstructionsList: Select[] = [];
  filteredMaturityInstructionsList: Select[] = [];
  creditModeDataList: Select[] = [];
  yearsDataList: Select[] = [];
  monthsDataList: Select[] = [];
  daysDataList: Select[] = [];
  stepperDetails: Stepper = {
    masterName: 'RD Initiation',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  installmentsList: any = [
    { id: 1, displayName: 1 }, { id: 2, displayName: 2 },
    { id: 3, displayName: 3 }, { id: 4, displayName: 4 },
    { id: 5, displayName: 5 }, { id: 6, displayName: 6 },
  ]

  dateformat = new Date().toDateString().split(' ');
  // date = this.dateformat[2];
  // month = this.dateformat[1];
  // year = this.dateformat[3];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private currencyService: CurrencyService,
    private httpService: HttpService,
    private router: Router,
    private viewService: ViewService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    console.log(this.isViewMode);

    if (!this.isViewMode) {
      const actions: Actions = {
        heading: 'RD Initiation',
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

      // const breadcrumbs: Breadcrumb[] = [
      //   { icon: 'fa-home' },
      //   { label: 'Account Services' },
      //   { label: 'Fixed Deposit' },
      //   { label: 'FD Initiation' },
      // ];
      // this.breadcrumbService.setBreadCrumb(breadcrumbs);
    }

    this.getViewData();
    this.getDropdownData();
    this.getCurrency();
  }

  getDropdownData(): void {
    const data = {
      filters: [{ name: 'moduleCode', value: 'FDINITIATION', type: 'String' }],
    };
    const reqData = {
      dataMap: {
        corporateId: this.userService.getCorporateId(),
      },
    };
    this.httpService
      .httpPost(
        'accountServices/fixedDeposit/rdInitiation/private/dropdown/fdProductTypeDataList',
        data,
      )
      .subscribe((response: any) => {
        this.productTypeList = response.dataList;
      });

    this.httpService
      .httpPost('accountServices/fixedDeposit/rdInitiation/private/dropdown/yearsDataList', data)
      .subscribe((response: any) => {
        this.yearsDataList = response.dataList;
      });

    this.httpService
      .httpPost('accountServices/fixedDeposit/rdInitiation/private/dropdown/monthsDataList', data)
      .subscribe((response: any) => {
        this.monthsDataList = response.dataList;
      });

    this.httpService
      .httpPost('accountServices/fixedDeposit/rdInitiation/private/dropdown/daysDataList', data)
      .subscribe((response: any) => {
        this.daysDataList = response.dataList;
      });

    this.httpService
      .httpPost(
        'accountServices/fixedDeposit/rdInitiation/private/dropdown/creditModeDataList',
        data,
      )
      .subscribe((response: any) => {
        this.creditModeDataList = response.dataList;
      });

    this.httpService
      .httpPost(
        'accountServices/fixedDeposit/rdInitiation/private/dropdown/maturityInstructionsDataList',
        data,
      )
      .subscribe((response: any) => {
        this.maturityInstructionsList = response.dataList;
        this.filteredMaturityInstructionsList = [...this.maturityInstructionsList];
      });

    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', reqData)
      .subscribe((res) => {
        this.accountList = res.dataList;
      });
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('accountServices/fixedDeposit/rdInitiation/private/view', data)
        .subscribe((formData: RdInitiation) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
          this.loading = false;
        });
    } else if (this.mode == 'PREFILLED') {
      const data = this.viewService.getExtraData();
      this.formData.debitFromAccountId = data.id;
      this.viewService.clearAll();
      this.loading = false;
    } else {
      this.loading = false;
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.rdInitiationForm && this.rdInitiationForm.valid) {
        return true;
      }
      return false;
    }
    return true;
  }

  getMaturityInstructions(productTypeId: number): void {
    this.filteredMaturityInstructionsList = [];
    this.filteredMaturityInstructionsList = this.maturityInstructionsList.filter(
      (response: any) => response.enrichments.productType === productTypeId,
    );
  }

  getCreditModeById(creditModeId: number): string {
    return this.creditModeDataList.find((response: any) => response.id === creditModeId)
      .displayName;
  }

  setInterestRateByYears(yearId: number): void {
    if (yearId) {
      let year: string;
      year = this.yearsDataList.find((response: any) => response.id === yearId).displayName;
      this.formData.interestRate = (+year * 7.0).toString();
    }
  }

  setYearDisplayNameById(yearId: number): string {
    return this.yearsDataList.find((response: any) => response.id === yearId).displayName;
  }
  setMonthDisplayNameById(monthId: number): string {
    return this.monthsDataList.find((response: any) => response.id === monthId).displayName;
  }
  setDayDisplayNameById(dayId: number): string {
    return this.daysDataList.find((response: any) => response.id === dayId).displayName;
  }

  principalCreditModeDisable(maturityInstructionsId: number): void {
    this.formData.maturityInstructionsName = this.getMaturityNameById(maturityInstructionsId);
    this.formData.principalCreditMode = '';
    this.formData.principalCreditAccount = '';
    this.formData.principalPrefferedCurrency = '';
    this.formData.interestCreditMode = '';
    this.formData.interestCreditAccount = '';
    this.formData.interestPrefferedCurrency = '';
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

  getProductNameByType(productType: number): string {
    let productName: string = '';
    productName = this.productTypeList.find((res: any) => res.id === productType)?.displayName;
    this.formData.productTypeName = productName;
    return productName;
  }

  getAccountNameById(debitFromAccountId: number): string {
    let accountName: string = '';
    accountName = this.accountList.find((res) => +res.id === debitFromAccountId)?.displayName;
    this.formData.debitFromAccountName = accountName;
    return accountName;
  }

  getMaturityNameById(maturityInstructionsId: number): string {
    return this.maturityInstructionsList.find((res) => +res.id === maturityInstructionsId)
      .displayName;
  }

  // afterSubmit(): void {
  //   this.isFDInitiated = true;
  // }

  beforeSubmit(): boolean {
    this.formData.branch = 'Headoffice';
    this.formData.depositAmount = this.formData.amount;
    // this.formData.maturityAmount = this.getMaturityAmount().toString();
    // this.formData.maturityDate = this.getMaturityDate();
    // this.formData.tenor = this.formData.years + ' Year';
    this.formData.fdClosedDate = this.formData.maturityDate;
    this.formData.depositStartDate = this.formData.placementDate;
    this.formData.accountBalance = (
      +this.getBalanceByAccount(this.formData.debitFromAccountId) - +this.formData.amount
    ).toString();

    return true;
  }

  // getMaturityDate(): string {
  //   let maturityDate: string = '';
  //   let splitDate = this.formData.placementDate.split('-');
  //   let year = +splitDate[2] + this.formData.years;
  //   maturityDate = splitDate[0] + '-' + splitDate[1] + '-' + year;

  //   return maturityDate;
  // }

  // getMaturityAmount(): number {
  //   let maturityAmount: number;
  //   maturityAmount =
  //     +this.formData.amount +
  //     (+this.formData.interestRate / 100) * +this.formData.amount * +this.formData.years;
  //   return maturityAmount;
  // }

  onOkClick(): void {
    this.isRDInitiated = false;
    this.goToListing();
  }

  goToListing(): void {
    this.router.navigateByUrl(this.router.url + '/listing');
  }

  getCurrency(): void {
    this.currencyService.getCurrencyList().subscribe((res) => {
      this.currencyList = res;
    });
    this.currencyService.getCurrencyId().subscribe((res) => {
      this.formData.currencyId = res;
      this.formData.currencyName = this.getCurrencyById(res);
    });
  }

  getCurrencyById(currencyId: string): string {
    let currencyName: string = '';
    currencyName = this.currencyList.find((res) => res.id === currencyId).displayName;
    this.formData.currencyName = currencyName;
    return currencyName;
  }

  getBalanceByAccount(debitAccountId: string): string {
    let accountBalance: string = '';
    if (debitAccountId) {
      accountBalance = this.accountList.find((res) => res.id === debitAccountId).enrichments
        .balance;
    } else {
      accountBalance = '00.00';
    }
    return accountBalance;
  }

  amountValidate(amount: string, debitAccountId: string) {
    let accountBalance: string = '';
    accountBalance = this.accountList.find((res) => res.id === debitAccountId).enrichments.balance;
    if (amount > accountBalance) {
      this.formData.amount = '00.00';
    }
  }
  setInterestRate() {
    this.formData.interestRate = '5.25';
  }
}
