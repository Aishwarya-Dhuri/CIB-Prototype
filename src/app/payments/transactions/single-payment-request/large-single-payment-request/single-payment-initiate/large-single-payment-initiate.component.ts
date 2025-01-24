import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { PaymentRequest } from '../../@model/payment-request.model';

@Component({
  selector: 'app-large-single-payment-initiate',
  templateUrl: './large-single-payment-initiate.component.html',
  styleUrls: ['./large-single-payment-initiate.component.scss'],
})
export class LargeSinglePaymentInitiateComponent implements OnInit {
  @ViewChild('forwardExchangeDetails') forwardExchangeDetails: any;
  @ViewChild('paymentDetails') paymentDetails: any;
  @ViewChild('beneficiaryDetails') beneficiaryDetails: any;
  @Input('isViewMode') isViewMode: boolean = false;

  formData: PaymentRequest = new PaymentRequest();
  mode: string;
  viewport: string;
  chargeRate: number = 0.0001;
  fxRates: string = '1';

  payableFxRate: string = '1';
  debitFxRate: string = '1';

  isGroupUser: boolean = false;
  beneficiaryRowDefReq: any = {};

  stepperDetails: Stepper = {
    masterName: 'Single Payment Request',
    currentStep: 1,
    isSaveDraftApplicable: true,
    isSaveAsTemplateApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['', '', 'Review Details & Confirm'],
  };

  currencyName: string;
  debitAccountReqBody: any = { dataMap: { corporateId: this.userService.getCorporateId() } };
  extraFormData: any = {};
  uploadedFiles: any = [];

  instructionCount: number = 1;
  extraAddressCount: number = 0;

  isAddNewBeneficiary: boolean;
  isShowBicCodeModal: boolean;
  bicCodeColDefUrl: string = 'payments/transactions/singlePaymentRequest/private/bicCodeColDef';
  bicCodeRowDefUrl: string = 'payments/transactions/singlePaymentRequest/private/bicCodeData';

  isShowBeneficiaryModal: boolean;
  beneficiaryColDefUrl: string =
    'payments/transactions/singlePaymentRequest/private/beneficiaryColDef';
  beneficiaryRowDefUrl: string = 'payments/masters/beneficiary/private/getBeneficiaryList';

  forwardExchangeColDefUrl: string =
    'payments/transactions/singlePaymentRequest/private/forwardExchangeColDef';
  forwardExchangeRowDataUrl: string =
    'payments/transactions/singlePaymentRequest/private/forwardExchangeData';

  forwardExchangeGridOptions = {
    rowSelection: 'single',
    pagination: false,
  };

  isExchangeDetails: boolean = false;

  constructor(
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private viewportService: ViewportService,
    private currencyService: CurrencyService,
    private userService: UserService,
    private viewService: ViewService,
    private toasterService: ToasterService,
  ) {
    if (!this.isViewMode) {
      if (this.router?.getCurrentNavigation()?.extras.state) {
        this.formData.initiateMode = this.router.getCurrentNavigation().extras.state.initiateMode;
        const initiateId = this.router.getCurrentNavigation().extras.state.id;
        if (initiateId) {
          this.viewService.setId(initiateId);
          const mode = this.viewService.getMode() ? this.viewService.getMode() : 'INITIATE';
          this.getViewData(mode);
        }
      }
      if (!this.formData.initiateMode) {
        this.formData.initiateMode = 'PAYMENTMETHODWISE';
      }
      this.getStepHeadings(this.formData.initiateMode);
    }
  }

  ngOnInit(): void {
    if (!this.isViewMode) {
      /* remove below : starts */
      const actions: Actions = {
        heading: 'Single Payment Request - Initiate',
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

      const breadcrumbs: Breadcrumb[] = [
        { icon: 'fa-home' },
        { label: 'Payments' },
        { label: 'Transactions' },
        { label: 'Single Payment Request' },
        { label: 'Initiate' },
      ];
      this.breadcrumbService.setBreadCrumb(breadcrumbs);
      /* remove below : ends */
    }
    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
    });

    this.currencyService.getCurrency().subscribe((currency: Select) => {
      if (currency) {
        this.formData.debitCurrencyId = currency.id;
        this.formData.debitCurrencyCode = currency.displayName;
        this.formData.payableCurrencyId = currency.id;
        this.formData.payableCurrencyCode = currency.displayName;
        this.currencyName = currency.displayName + ' ';
      }
    });
    this.mode = this.viewService.getMode();
    this.getViewData(this.mode);
    this.formData.valueDate = this.userService?.applicationDate
      ? this.userService.applicationDate
      : '';
  }

  getViewData(mode: string): void {
    if (mode == 'VIEW') {
      this.stepperDetails.currentStep = this.stepperDetails.headings.length;
    }

    if (mode == 'EDIT' || mode == 'VIEW' || mode == 'INITIATE') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/transactions/singlePaymentRequest/private/view', data)
        .subscribe((formData: PaymentRequest) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.getStepHeadings(this.formData.initiateMode);
          this.isExchangeDetails = this.formData.payableCurrencyId != this.formData.debitCurrencyId;
        });
    } else if (mode == 'DRAFT') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/transactions/singlePaymentRequest/private/viewDraft', data)
        .subscribe((formData: PaymentRequest) => {
          this.viewService.clearAll();
          this.formData = formData;
          mode = '';
          this.stepperDetails.isUpdateDraft = true;
          this.getStepHeadings(this.formData.initiateMode);
        });
    } else if (mode == 'TEMPLATE') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/transactions/singlePaymentRequest/private/viewTemplate', data)
        .subscribe((formData: PaymentRequest) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.getStepHeadings(this.formData.initiateMode);
          mode = '';
          this.stepperDetails.isUpdateTemplate = true;
        });
    } else {
      const initiateMode = this.formData.initiateMode;

      this.formData = new PaymentRequest();

      if (this.mode == 'PREFILLED') {
        const data = this.viewService.getExtraData();
        this.formData.debitAccountId = data.id;
        this.viewService.clearAll();
      }

      this.formData.initiateMode = initiateMode ? initiateMode : 'PAYMENTMETHODWISE';

      let enrichReq = {
        dataMap: { filters: [{ name: 'enrichmentFor', value: 'SINGLEPAYMENTREQUEST' }] },
      };
      this.httpService
        .httpPost('setup/templates/enrichmentMapping/private/view', enrichReq)
        .subscribe((enrichmentData: any) => {
          this.formData.paymentRequestDetails[0].enrichments =
            enrichmentData.enrichmentMappingDetails;
        });
    }
  }

  getStepHeadings(initiateMode): void {
    if (initiateMode == 'PAYMENTMETHODWISE') {
      this.stepperDetails.headings[0] = 'Payment Details';
      this.stepperDetails.headings[1] = 'Beneficiary & Enrichment Details';
    } else {
      this.stepperDetails.headings[0] = 'Beneficiary Details';
      this.stepperDetails.headings[1] = 'Payment & Enrichment Details';
    }
  }

  getSubHeading(stepNo: number): string {
    if (this.formData.initiateMode == 'PAYMENTMETHODWISE') {
      if (stepNo == 1) {
        return (
          this.formData.paymentMethodName +
          ' | ' +
          this.formData.debitCurrencyCode +
          ' ' +
          this.formData.totalRequestAmount
        );
      } else if (stepNo == 2) {
        return this.formData.paymentRequestDetails[0].beneficiaryName;
      }
    } else if (this.formData.initiateMode == 'BENEFICIARYWISE') {
      if (stepNo == 1) {
        return this.formData.paymentRequestDetails[0].beneficiaryName;
      } else if (stepNo == 2) {
        return (
          this.formData.paymentMethodName +
          ' | ' +
          this.formData.debitCurrencyCode +
          ' ' +
          this.formData.totalRequestAmount
        );
      }
    }
    return 'Step' + stepNo + ' Details';
  }

  validateForm(stepNo: number): boolean {
    if (this.formData.initiateMode == 'PAYMENTMETHODWISE') {
      if (stepNo == 1) {
        if (this.paymentDetails && this.paymentDetails.valid) {
          return true;
        }
        return false;
      } else if (stepNo == 2) {
        if (this.beneficiaryDetails && this.beneficiaryDetails.valid) {
          return true;
        }
        return false;
      }
    } else if (this.formData.initiateMode == 'BENEFICIARYWISE') {
      if (stepNo == 1) {
        if (this.beneficiaryDetails && this.beneficiaryDetails.valid) {
          return true;
        }
        return false;
      } else if (stepNo == 2) {
        if (this.paymentDetails && this.paymentDetails.valid) {
          return true;
        }
        return false;
      }
    }

    return true;
  }

  onStepChange(stepNo: number, subStepNo: number): void {
    this.applyFormData();
  }

  applyFormData() {
    if (
      this.formData.paymentRequestDetails[0].exchangeType == 'FORWARD' &&
      this.formData.paymentRequestDetails[0].forwardExchangeId
    ) {
      setTimeout(() => {
        if (this.forwardExchangeDetails)
          this.forwardExchangeDetails.selectRow(
            { id: this.formData.paymentRequestDetails[0].forwardExchangeId },
            'id',
          );
      }, 1100);
    }
  }

  onValueDateChange() {
    if (this.formData.valueDate == '26-Jan-2023') {
      this.toasterService.showToaster({
        severity: 'error',
        detail: '26-Jan-2023 is Public Holiday',
      });

      this.formData.valueDate = '';

      return;
    }

    this.formData.transactionDate = this.formData.valueDate;
    this.formData.paymentRequestDetails[0].valueDate = this.formData.valueDate;
    this.formData.paymentRequestDetails[0].transactionDate = this.formData.valueDate;
  }

  onPaymentMethodChange(value: Select) {
    this.formData.paymentMethodName = value.displayName;
    this.formData.corporateProductId = value.enrichments.corporateProductId;
    this.formData.isPaperBasedTransaction = value.enrichments.isPaperBasedTransaction;
    this.formData.paymentRequestDetails[0].paymentMethodId = value.id;
    this.formData.paymentRequestDetails[0].corporateProductId =
      value.enrichments.corporateProductId;
    this.formData.paymentRequestDetails[0].isPaperBasedTransaction =
      value.enrichments.isPaperBasedTransaction;

    this.formData.debitAccountId = '';
    this.formData.debitAccountNo = '';
    this.formData.debitAccountBalance = '';
    this.formData.debitAccountCurrency = '';
    this.formData.debitAccountCurrencyCode = '';
    this.formData.accountTitle = '';
    this.formData.paymentRequestDetails[0].debitAccountId = '';

    this.beneficiaryRowDefReq = {
      paymentMethodId: value.id,
      paymentMethodName: value.displayName,
    };
  }

  onDebitAccountChange(value: Select) {
    this.formData.debitAccountNo = value.displayName;
    this.formData.debitAccountBalance = value.enrichments.balance;
    this.formData.debitAccountCurrency = value.enrichments.currency;
    this.formData.debitAccountCurrencyCode = value.enrichments.currencyCode;
    this.formData.accountTitle = value.enrichments.accountTitle;
    this.formData.paymentRequestDetails[0].debitAccountId = value.id;
    this.formData.debitCurrencyId = value.enrichments.currencyId;
    this.formData.debitCurrencyCode = value.enrichments.currencyCode;
    this.formData.payableCurrencyId = value.enrichments.currencyId;
    this.formData.payableCurrencyCode = value.enrichments.currencyCode;
    this.isExchangeDetails = this.formData.payableCurrencyId != this.formData.debitCurrencyId;
  }

  onPayableCurrencyChange(value: Select) {
    this.formData.payableCurrencyCode = value.displayName;
    this.payableFxRate = value.enrichments.fxRateToBase;
    this.formData.fxRate = value.enrichments.fxRateToBase;
    this.formData.paymentRequestDetails[0].payableCurrencyId = value.id;
    this.isExchangeDetails = this.formData.debitCurrencyId != value.id;

    if (this.formData.payableAmount) {
      this.onPayableAmountChange();
    }
  }

  onDebitCurrencyChange(value: Select) {
    this.formData.debitCurrencyCode = value.displayName;
    this.formData.fxRate = value.enrichments.fxRateToBase;
    this.debitFxRate = value.enrichments.fxRateToBase;
    this.formData.paymentRequestDetails[0].debitCurrencyId = value.id;
    if (this.formData.debitAmount) {
      this.onDebitAmountChange();
    }
  }

  onPayableAmountChange() {
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
    return '';
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

  onForwardExchangeSelection($event: any) {
    if ($event.node.selected)
      this.formData.paymentRequestDetails[0].forwardExchangeId = $event.data.id;
    else this.formData.paymentRequestDetails[0].forwardExchangeId = '';
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
    if (this.formData.initiateMode == 'BENEFICIARYWISE') {
      this.formData.paymentMethodId = beneficiary.paymentMethodId;
      this.formData.paymentMethodName = beneficiary.paymentMethod;
      this.formData.isPaperBasedTransaction = beneficiary.isPaperBasedTransaction;
      this.formData.paymentRequestDetails[0].paymentMethodId = beneficiary.paymentMethodId;
      this.formData.paymentRequestDetails[0].corporateProductId = beneficiary.corporateProductId;
      this.formData.paymentRequestDetails[0].isPaperBasedTransaction =
        beneficiary.isPaperBasedTransaction;
    }

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

    this.formData.beneficiaryAccountNo = beneficiary.accountNo;

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
    this.formData.beneficiaryAccountNo = '';
  }

  showAddBeneficiary() {
    //reset and enable the thing
    this.restBeneficiaryFormData();
    this.isAddNewBeneficiary = true;
  }

  onAddBeneficiary() {
    // disable the things
    this.formData.paymentRequestDetails[0].remarks = '';
    this.formData.beneficiaryName = this.formData.paymentRequestDetails[0].beneficiaryName;
    this.formData.paymentRequestDetails[0].accountNo =
      this.formData.paymentRequestDetails[0].paymentRequestAdditionalDetail[0].beneficiaryAccountNo;
    this.isAddNewBeneficiary = false;
    this.toasterService.showToaster({
      severity: 'success',
      detail: 'Beneficiary Successfully Created',
    });
  }

  onAddCancelBeneficiary() {
    this.restBeneficiaryFormData();
    this.isAddNewBeneficiary = false;
  }

  onEditClick(isPaymentDetails: boolean): void {
    if (isPaymentDetails) {
      this.stepperDetails.currentStep = this.formData.initiateMode == 'PAYMENTMETHODWISE' ? 1 : 2;
      this.applyFormData();
    } else {
      this.stepperDetails.currentStep = this.formData.initiateMode == 'BENEFICIARYWISE' ? 1 : 2;
    }
  }
}
