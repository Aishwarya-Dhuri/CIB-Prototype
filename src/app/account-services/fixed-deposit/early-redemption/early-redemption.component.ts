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
import { EarlyRedemption } from './@models/early-redemption.model';

@Component({
  selector: 'app-early-redemption',
  templateUrl: './early-redemption.component.html',
  styleUrls: ['./early-redemption.component.scss'],
})
export class EarlyRedemptionComponent implements OnInit {
  @ViewChild('earlyRedemptionForm') earlyRedemptionForm: any;

  formData: EarlyRedemption;
  currencyList: any[] = [];
  isFDRedemption: boolean = false;
  mode: string;
  accountList: any[] = [];
  isTermsAndCondition: boolean = false;
  fdNumberList: Select[] = [];
  productTypeList: Select[] = [];
  creditModeDataList: Select[] = [];
  stepperDetails: Stepper = {
    masterName: 'Early Redemption',
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
    private userService: UserService,
    private fdSummaryService: FDSummaryService,
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
      { label: 'Early Redemption' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData = new EarlyRedemption();

    this.getCurrency();
    this.prepareData();
    this.getDropdownList();
    this.getViewData();
  }

  prepareData(): void {
    if (this.fdSummaryService.selectedId) {
      this.httpService
        .httpPost('accountServices/fixedDeposit/private/getFixedDepositList')
        .subscribe((res: any) => {
          var dataList: any;
          dataList = res.dataList[0];
          this.formData = dataList;
          this.formData.fdNumber = dataList.id;
          this.formData.currentBalance = dataList.accountBalance;
          this.formData.amountCurrency = dataList.currencyId;
          this.formData.currentBalanceCurrency = dataList.currencyId;
          this.formData.redemptionCurrency = dataList.currencyId;
          this.formData.redemptionType = 'Full Amount';
          this.formData.redemptionAmount = '';
          this.formData.redemptionDate = '';
          this.formData.creditAccount = 'Maturity Instructions';
          if ((this.formData.redemptionType = 'Full Amount')) {
            this.formData.redemptionAmount = this.formData.amount;
          }
        });
    }
  }

  getDropdownList(): void {
    const data = {
      filters: [{ name: 'moduleCode', value: 'MATURITYINSTRUCTION', type: 'String' }],
    };
    const reqData = {
      dataMap: {
        corporateId: this.userService.getCorporateId(),
      },
    };
    this.httpService
      .httpPost('accountServices/fixedDeposit/private/getFDNumberList')
      .subscribe((response: any) => {
        this.fdNumberList = response.dataList;
      });

    this.httpService
      .httpPost(
        'accountServices/fixedDeposit/fdInitiation/private/dropdown/fdProductTypeDataList',
        data,
      )
      .subscribe((response: any) => {
        this.productTypeList = response.dataList;
      });

    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', reqData)
      .subscribe((res: any) => {
        this.accountList = res.dataList;
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

  getAccountNameById(AccountId: number): string {
    return this.accountList.find((res) => res.id === AccountId).displayName;
  }

  getCurrency(): void {
    this.currencyService.getCurrencyList().subscribe((res: any) => {
      this.currencyList = res;
    });
    this.currencyService.getCurrencyId().subscribe((res: any) => {
      this.formData.amountCurrency = res;
      this.formData.currentBalanceCurrency = res;
      this.formData.redemptionCurrency = res;
    });
  }

  getCreditModeById(creditModeId: number): string {
    return this.creditModeDataList.find((response: any) => response.id === creditModeId)
      .displayName;
  }

  getCurrencyById(currencyId: string): string {
    return this.currencyList.find((res) => res.id === currencyId).displayName;
  }

  validateRedemptionAmount(redemptionAmount: string): void {
    if (redemptionAmount > this.formData.amount) {
      this.formData.redemptionAmount = '00.00';
    }
  }

  onCreditAccountClick(creditAccount: string): void {
    if (creditAccount === 'Full Amount') {
      this.formData.redemptionAmount = this.formData.amount;
    } else {
      this.formData.redemptionAmount = ' ';
    }
  }

  onPartialAmountClick(redemptionType: string): void {
    if (redemptionType === 'Partial Amount') {
      this.formData.principalCreditMode = '';
      this.formData.principalCreditAccount = '';
      this.formData.principalPrefferedCurrency = '';
      this.formData.interestCreditMode = '';
      this.formData.interestCreditAccount = '';
      this.formData.interestPrefferedCurrency = '';
    }
  }

  fdNumberSelected(fdNumber: string): void {
    var dataList: any;
    this.httpService
      .httpPost('accountServices/fixedDeposit/private/getFixedDepositList')
      .subscribe((res: any) => {
        dataList = res.dataList.find((x) => x.id === fdNumber);
        this.formData = dataList;
        this.formData.fdNumber = dataList.id;
        this.formData.currentBalance = dataList.accountBalance;
        this.formData.amountCurrency = dataList.currencyId;
        this.formData.currentBalanceCurrency = dataList.currencyId;
        this.formData.redemptionCurrency = dataList.currencyId;
        this.formData.redemptionType = 'Full Amount';
        this.formData.redemptionAmount = '';
        this.formData.redemptionDate = '';
        this.formData.creditAccount = 'Maturity Instructions';
        if ((this.formData.redemptionType = 'Full Amount')) {
          this.formData.redemptionAmount = this.formData.amount;
        }
      });
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('accountServices/fixedDeposit/earlyRedemption/private/view', data)
        .subscribe((formData: EarlyRedemption) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }
  beforeSubmit() {
    if (!this.mode) {
      delete this.formData.id;
    }
    return true;
  }

  afterSubmit(response: any) {
    this.formData['id'] = response.dataMap.id;
    this.isFDRedemption = true;
    return false;
  }

  onCloseClick(): void {
    this.isFDRedemption = false;
    this.goToListing();
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.earlyRedemptionForm && this.earlyRedemptionForm.valid) {
        return true;
      }
      return false;
    } else if (stepNo == 1) {
      return this.formData.termsAndCondition;
    }
    return true;
  }

  goToListing(): void {
    this.router.navigateByUrl(this.router.url + '/listing');
  }
}
