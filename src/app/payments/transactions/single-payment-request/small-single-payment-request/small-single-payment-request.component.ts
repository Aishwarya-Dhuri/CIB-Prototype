import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { PaymentRequest } from './@model/payment-request.model';

@Component({
  selector: 'app-small-single-payment-request',
  templateUrl: './small-single-payment-request.component.html',
  styleUrls: ['./small-single-payment-request.component.scss'],
})
export class SmallSinglePaymentRequestComponent implements OnInit {
  isInititateScreen: boolean;
  isMultiFundTranfer: boolean;
  isFundTransferEdit: boolean;
  fundTransferEditIndex: number;
  insights: any[] = [];
  isLoading: boolean;
  @ViewChild('stepFooter') stepFooter: any;
  formData: PaymentRequest = new PaymentRequest();
  // fundTransferList: PaymentRequest[] = [{"totalRequest":"1","channelName":"WEB","status":"Processing","beneficiaryName":"Thomas Wilson","entryType":"SINGLE","entryMode":"MANUAL","requestBy":"CORPORATE","initiateMode":"BENEFICIARYWISE","paymentMethodId":"","debitAccountId":"2288","valueDate":"18-Jan-2022","payableAmount":"20000","debitAmount":"20000.00","paymentMethodName":"IBG","paymentRequestDetails":[{"beneficiaryId":"2","beneficiaryCode":"THOMASWILSON","beneficiaryName":"Thomas Wilson","amountType":"PAYABLE","exchangeType":"CARD","dealNo":"","paymentDetails1":"Salary","paymentDetails2":"","paymentDetails3":"","paymentDetails4":"","corporateRefNo":"","accountNo":"1812220918342730","beneficiaryAddress1":"S/N 781, MG Road,","beneficiaryAddress2":"Mumbai","beneficiaryAddress3":"Maharashtra","pinCode":"400001","phoneNo":"9087654321","faxNo":"","email":"myemail@gmail.com","enrichments":[],"supportingDocList":[],"paymentRequestAdditionalDetail":[{"beneficiaryAccountNo":"1812220918342730","bicCode":"","bicCodeId":"","dispatchTo":"BENEFICIARY","instrumentDispatchMode":"EMAIL","beneDispatchMode":"","remarks":""}],"remarks":"","valueDate":"","transactionDate":"","debitAccountId":"2288","payableAmount":"20000"}],"payableCurrencyId":"1","debitCurrencyId":"1","payableCurrencyCode":"MYR","fxRate":"0","transactionDate":"","debitAccountNo":"999200000011-MYR","debitAccountBalance":"788800","accountTitle":"ACC11","totalRequestAmount":"20000"},{"totalRequest":"1","channelName":"WEB","status":"Processing","beneficiaryName":"James Murphy","entryType":"SINGLE","entryMode":"MANUAL","requestBy":"CORPORATE","initiateMode":"BENEFICIARYWISE","paymentMethodId":"","debitAccountId":"2288","valueDate":"18-Jan-2022","payableAmount":"10000","debitAmount":"10000.00","paymentMethodName":"Own Cheques","paymentRequestDetails":[{"beneficiaryId":"1","beneficiaryCode":"JAMESMURPHY","beneficiaryName":"James Murphy","amountType":"PAYABLE","exchangeType":"CARD","dealNo":"","paymentDetails1":"Salary","paymentDetails2":"","paymentDetails3":"","paymentDetails4":"","corporateRefNo":"","accountNo":"1812220918342730","beneficiaryAddress1":"S/N 781, MG Road,","beneficiaryAddress2":"Pune","beneficiaryAddress3":"Maharashtra","pinCode":"400001","phoneNo":"9087654321","faxNo":"","email":"myemail@gmail.com","enrichments":[],"supportingDocList":[],"paymentRequestAdditionalDetail":[{"beneficiaryAccountNo":"1812220918342730","bicCode":"","bicCodeId":"","dispatchTo":"BENEFICIARY","instrumentDispatchMode":"EMAIL","beneDispatchMode":"","remarks":""}],"remarks":"","valueDate":"","transactionDate":"","debitAccountId":"2288","payableAmount":"10000"}],"payableCurrencyId":"1","debitCurrencyId":"1","payableCurrencyCode":"MYR","fxRate":"0","transactionDate":"","debitAccountNo":"999200000011-MYR","debitAccountBalance":"788800","accountTitle":"ACC11","totalRequestAmount":"10000"},{"totalRequest":"1","channelName":"WEB","status":"Processing","beneficiaryName":"Charlie Davis","entryType":"SINGLE","entryMode":"MANUAL","requestBy":"CORPORATE","initiateMode":"BENEFICIARYWISE","paymentMethodId":"","debitAccountId":"2288","valueDate":"18-Jan-2022","payableAmount":"20000","debitAmount":"20000.00","paymentMethodName":"DuitNow","paymentRequestDetails":[{"beneficiaryId":"4","beneficiaryCode":"CHARLIEDAVIS","beneficiaryName":"Charlie Davis","amountType":"PAYABLE","exchangeType":"CARD","dealNo":"","paymentDetails1":"Salary","paymentDetails2":"","paymentDetails3":"","paymentDetails4":"","corporateRefNo":"","accountNo":"1812220918342730","beneficiaryAddress1":"S/N 781, MG Road,","beneficiaryAddress2":"Mumbai","beneficiaryAddress3":"Maharashtra","pinCode":"400001","phoneNo":"9087654321","faxNo":"","email":"myemail@gmail.com","enrichments":[],"supportingDocList":[],"paymentRequestAdditionalDetail":[{"beneficiaryAccountNo":"1812220918342730","bicCode":"","bicCodeId":"","dispatchTo":"BENEFICIARY","instrumentDispatchMode":"EMAIL","beneDispatchMode":"","remarks":""}],"remarks":"","valueDate":"","transactionDate":"","debitAccountId":"2288","payableAmount":"20000"}],"payableCurrencyId":"1","debitCurrencyId":"1","payableCurrencyCode":"MYR","fxRate":"0","transactionDate":"","debitAccountNo":"999200000011-MYR","debitAccountBalance":"788800","accountTitle":"ACC11","totalRequestAmount":"20000"}];
  fundTransferList: PaymentRequest[] = [];
  isShowAttachmentModal: boolean;
  mode: string;
  viewport: string;
  chargeRate: number = 0.0001;
  fxRates: string = '0.79';

  payableFxRate: string = '0.24';
  debitFxRate: string = '0.24';

  transactionsListTypes: any = [];

  stepperDetails: Stepper = {
    masterName: 'Single Payment Request',
    currentStep: 1,
    isOnlyFooter: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  paymentMethodList: Select[];
  debitAccountList: Select[];
  currencyList: Select[] = [];
  currencyName: string;
  extraFormData: any = {};
  uploadedFiles: any = [];
  instructionCount: number = 1;
  isAddNewBeneficiary: boolean;
  extraAddressCount: number = 0;
  isShowBicCodeModal: boolean;
  bicCodeColDefUrl: string = 'payments/transactions/singlePaymentRequest/private/bicCodeColDef';
  bicCodeRowDefUrl: string = 'payments/transactions/singlePaymentRequest/private/bicCodeData';
  isShowBeneficiaryModal: boolean;
  beneficiaryColDefUrl: string =
    'payments/transactions/singlePaymentRequest/private/beneficiaryColDef';
  beneficiaryRowDefUrl: string = 'payments/masters/beneficiary/private/getBeneficiaryList';
  isReviewEditClick: boolean;

  constructor(
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewportService: ViewportService,
    private currencyService: CurrencyService,
    private userService: UserService,
    private viewService: ViewService,
    private toasterService: ToasterService,
    private menuService: MenuService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Fund Transfer - Initiate',
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
      { label: 'Payments' },
      { label: 'Transactions' },
      { label: 'Fund Transfer' },
      { label: 'Initiate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.httpService
      .httpPost('payments/transactions/singlePaymentRequest/private/getInsights')
      .subscribe((response: any) => {
        this.insights = response;
      });

    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
    });

    this.currencyService.getCurrencyList().subscribe((currencyList: Select[]) => {
      if (currencyList && currencyList.length > 0) {
        this.currencyList = currencyList;
        this.formData.payableCurrencyId = this.currencyList[0].id;
        this.formData.debitCurrencyId = this.currencyList[0].id;
        this.onPayableCurrencyChange();
        //this.onCurrencyChange();
      }
    });

    this.currencyService.getCurrencyName().subscribe((currencyName: string) => {
      if (currencyName) {
        this.currencyName = currencyName + ' ';
      }
    });

    this.transactionsListTypes = [
      {
        label: 'Frequent Payment',
        count: 8,
        colDefUrl: 'payments/transactions/singlePaymentRequest/private/frequentPaymentColDef',
        rowDataUrl: 'payments/transactions/singlePaymentRequest/private/frequentPaymentData',
        cardDataUrl: 'payments/transactions/singlePaymentRequest/private/frequentPaymentCardData',
      },
      {
        label: 'Recent Payment',
        count: 5,
        colDefUrl: 'payments/transactions/singlePaymentRequest/private/recentPaymentColDef',
        rowDataUrl: 'payments/transactions/singlePaymentRequest/private/recentPaymentData',
        cardDataUrl: 'payments/transactions/singlePaymentRequest/private/recentPaymentCardData',
      },
      {
        label: 'Recurring Payment',
        count: 10,
        colDefUrl: 'payments/transactions/singlePaymentRequest/private/upcomingPaymentColDef',
        rowDataUrl: 'payments/transactions/singlePaymentRequest/private/upcomingPaymentData',
        cardDataUrl: 'payments/transactions/singlePaymentRequest/private/upcomingPaymentCardData',
      },
    ];

    this.getDebitAccountList();
    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/transactions/singlePaymentRequest/private/view', data)
        .subscribe((formData: PaymentRequest) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW')
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          this.isInititateScreen = true;
          this.isLoading = true;
        });
    } else {
      this.isLoading = true;
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.isMultiFundTranfer) {
        return this.fundTransferList.length > 0;
      } else {
        return true;
      }
    }
    return true;
  }

  onValueDateChange() {
    this.formData.transactionDate = this.formData.valueDate;
    this.formData.paymentRequestDetails[0].valueDate = this.formData.valueDate;
    this.formData.paymentRequestDetails[0].transactionDate = this.formData.valueDate;
  }

  getDebitAccountList(): void {
    this.debitAccountList = [];
    /* const data = {filters: [
      { name: 'corporateProductId', value: this.formData.corporateProductId, type: 'String' },
      { name: 'paymentMethodId', value: this.formData.paymentMethodId, type: 'String' },
    ]}; */
    const data = { dataMap: { corporateId: this.userService.getCorporateId() } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        this.debitAccountList = response.dataList;
      });
  }

  onDebitAccountChange() {
    if (!this.formData.debitAccountId) return;
    const value = this.debitAccountList.find((p: any) => p.id === this.formData.debitAccountId);
    this.formData.debitAccountNo = value.displayName;
    this.formData.debitAccountBalance = value.enrichments.balance;
    this.formData.accountTitle = value.enrichments.accountTitle;
    this.formData.paymentRequestDetails[0].debitAccountId = value.id;
  }

  onCurrencyChange() {
    if (!this.formData.debitCurrencyId) return;
    const value = this.currencyList.find((p: any) => p.id === this.formData.debitCurrencyId);
    this.formData.debitCurrencyCode = value.displayName;
    this.formData.fxRate = value.enrichments.fxRateToBase;
    this.formData.paymentRequestDetails[0].debitCurrencyId = value.id;
  }

  onPayableCurrencyChange() {
    if (!this.formData.payableCurrencyId) return;
    const value = this.currencyList.find((p: any) => p.id === this.formData.payableCurrencyId);
    this.formData.payableCurrencyCode = value.displayName;
    this.payableFxRate = value.enrichments.fxRateToBase;
    this.formData.fxRate = value.enrichments.fxRateToBase;
    //this.formData.paymentRequestDetails[0].payableCurrencyId = value.id;
    if (this.formData.payableAmount) {
      this.onPayableAmoutChange();
    }
  }

  onDebitCurrencyChange() {
    if (!this.formData.debitCurrencyId) return;
    const value = this.currencyList.find((p: any) => p.id === this.formData.debitCurrencyId);
    this.formData.debitCurrencyCode = value.displayName;
    this.formData.fxRate = value.enrichments.fxRateToBase;
    this.debitFxRate = value.enrichments.fxRateToBase;
    this.formData.paymentRequestDetails[0].debitCurrencyId = value.id;
  }

  onPayableAmoutChange() {
    this.formData.totalRequestAmount = this.formData.payableAmount;
    this.formData.paymentRequestDetails[0].payableAmount = this.formData.payableAmount;
    const fxRate = +this.payableFxRate !== 0 ? +this.payableFxRate : 1;
    this.formData.debitAmount = (+this.formData.payableAmount / fxRate).toFixed(2).toString();
  }

  onDebitAmountChange() {
    this.formData.totalRequestAmount = this.formData.debitAmount;
    this.formData.paymentRequestDetails[0].debitAmount = this.formData.debitAmount;
    const fxRate = +this.payableFxRate !== 0 ? +this.payableFxRate : 1;
    this.formData.payableAmount = (+this.formData.debitAmount * fxRate).toFixed(2).toString();
  }

  getCharges(amount: any) {
    if (amount) {
      const amt = amount.replace(/,/g, '');
      return (amt * this.chargeRate).toFixed(2);
    }
    return '0.00';
  }

  addMoreInstruction() {
    if (this.instructionCount < 4) this.instructionCount = this.instructionCount + 1;
  }

  onCorporateRefNoChange() {
    this.formData.corporateRefNo = this.formData.paymentRequestDetails[0].corporateRefNo;
  }

  onFileUploaded(files: any[]) {
    this.uploadedFiles = files;
    this.formData.paymentRequestDetails[0].supportingDocList = [];
    files.forEach((file) => {
      this.formData.paymentRequestDetails[0].supportingDocList.push({
        originalFileName: file.fileName,
        sysFileName: file.sysFileName,
        size: file.fileSize,
      });
    });
  }

  onBicCodeSelection(record: any) {
    this.formData.paymentRequestDetails[0].paymentRequestAdditionalDetail[0].bicCodeId = record.id;
    this.formData.paymentRequestDetails[0].paymentRequestAdditionalDetail[0].bicCode =
      record.bicCode;
  }

  OnBeneDispatchModeChange() {
    this.formData.paymentRequestDetails[0].paymentRequestAdditionalDetail[0].beneDispatchMode =
      this.extraFormData.beneDispatchMode.join();
  }

  onBeneficiarySelection(beneficiary: any) {
    this.formData.paymentMethodName = beneficiary.paymentMethod;
    this.formData.paymentRequestDetails[0].remarks = '';
    this.formData.paymentRequestDetails[0].beneficiaryId = beneficiary.id;
    this.formData.paymentRequestDetails[0].beneficiaryCode = beneficiary.beneficiaryCode;
    this.formData.beneficiaryName = beneficiary.beneficiaryName;
    this.formData.paymentRequestDetails[0].beneficiaryName = beneficiary.beneficiaryName;
    this.formData.paymentRequestDetails[0].accountNo = beneficiary.accountNo;
    this.formData.paymentRequestDetails[0].beneficiaryAddress1 = beneficiary.beneficiaryAddress1;
    this.formData.paymentRequestDetails[0].beneficiaryAddress2 = beneficiary.beneficiaryAddress2;
    this.formData.paymentRequestDetails[0].beneficiaryAddress3 = beneficiary.beneficiaryAddress3;
    this.formData.paymentRequestDetails[0].pinCode = beneficiary.pinCode;
    this.formData.paymentRequestDetails[0].phoneNo = beneficiary.phoneNo;
    this.formData.paymentRequestDetails[0].email = beneficiary.email;
    this.formData.paymentRequestDetails[0].paymentRequestAdditionalDetail[0].beneficiaryAccountNo =
      beneficiary.accountNo;

    if (beneficiary.beneficiaryAddress3) this.extraAddressCount = 2;
    else if (beneficiary.beneficiaryAddress2) this.extraAddressCount = 1;
    else this.extraAddressCount = 0;
  }

  restBeneficiaryFormData() {
    this.extraAddressCount = 0;
    this.formData.paymentRequestDetails[0].beneficiaryId = '';
    this.formData.paymentRequestDetails[0].beneficiaryCode = '';
    this.formData.beneficiaryName = '';
    this.formData.paymentRequestDetails[0].beneficiaryName = '';
    this.formData.paymentRequestDetails[0].accountNo = '';
    this.formData.paymentRequestDetails[0].beneficiaryAddress1 = '';
    this.formData.paymentRequestDetails[0].beneficiaryAddress2 = '';
    this.formData.paymentRequestDetails[0].beneficiaryAddress3 = '';
    this.formData.paymentRequestDetails[0].pinCode = '';
    this.formData.paymentRequestDetails[0].phoneNo = '';
    this.formData.paymentRequestDetails[0].email = '';
    this.formData.paymentRequestDetails[0].paymentRequestAdditionalDetail[0].beneficiaryAccountNo =
      '';
  }

  showAddBeneficiary() {
    //reset and enable the thing
    this.restBeneficiaryFormData();
    this.isAddNewBeneficiary = true;
  }

  onAddBeneficiary() {
    // disable the things
    this.formData.paymentRequestDetails[0].id = '0';
    this.formData.paymentRequestDetails[0].remarks = '';
    this.formData.beneficiaryName = this.formData.paymentRequestDetails[0].beneficiaryName;
    this.formData.paymentRequestDetails[0].accountNo =
      this.formData.paymentRequestDetails[0].paymentRequestAdditionalDetail[0].beneficiaryAccountNo;
    this.isAddNewBeneficiary = false;
  }

  onAddCancelBeneficiary() {
    this.restBeneficiaryFormData();
    this.isAddNewBeneficiary = false;
  }

  addFundTransfer() {
    if (this.isFundTransferEdit) {
      this.fundTransferList[this.fundTransferEditIndex] = _.cloneDeep(this.formData);
      this.isFundTransferEdit = false;
    } else {
      this.fundTransferList.push(_.cloneDeep(this.formData));
    }
    this.resetFormData();
  }

  resetFormData(): void {
    this.formData = new PaymentRequest();
  }

  editFundTransfer(index: number): void {
    this.isFundTransferEdit = true;
    this.fundTransferEditIndex = index;
    this.formData = _.cloneDeep(this.fundTransferList[index]);
  }

  deleteFundTransfer(index: number): void {
    this.fundTransferList.splice(index, 1);
  }

  showHideFundTransferDetails(index: number): void {
    this.fundTransferList.forEach((formData: PaymentRequest, i: number) => {
      if (i == index) {
        formData.isShowDetails = !formData.isShowDetails;
        if (formData.isShowDetails) {
          this.formData = _.cloneDeep(this.fundTransferList[index]);
        }
      } else {
        formData.isShowDetails = false;
      }
    });
  }

  onStepChange(stepNo: number, subStepNo?: number): void {
    if (stepNo == 1 && this.isMultiFundTranfer) {
      this.formData = new PaymentRequest();
    } else if (stepNo == 2 && this.isMultiFundTranfer) {
      this.fundTransferList.forEach((formData: PaymentRequest) => {
        formData.isShowDetails = false;
      });
    }
  }

  beforeSubmit(): boolean {
    if (!this.isMultiFundTranfer) {
      return true;
    }
    let count = 0;
    this.fundTransferList.forEach((formData: PaymentRequest) => {
      this.httpService
        .httpPost('payments/transactions/singlePaymentRequest/private/create', formData)
        .subscribe((response: any) => {
          count = count + 1;
          if (count == this.fundTransferList.length) {
            const msg =
              this.stepperDetails.masterName +
              (this.mode ? ' updated successfully' : ' initiated successfully');
            this.toasterService.showToaster({ severity: 'success', detail: msg });
            this.router.navigateByUrl(this.menuService.getSelectedServiceUrl() + '/listing');
          }
        });
    });
    return false;
  }

  getTotalFundTranferAmount(): number {
    let total = 0;
    this.fundTransferList.forEach((formData: PaymentRequest) => {
      total = total + parseFloat(formData.payableAmount);
    });
    return total;
  }
}
