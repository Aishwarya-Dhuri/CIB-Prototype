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
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { TemplateManagement } from './@model/template-management.model';

@Component({
  selector: 'app-template-management',
  templateUrl: './template-management.component.html',
  styleUrls: ['./template-management.component.scss'],
})
export class TemplateManagementComponent implements OnInit {
  @ViewChild('forwardExchangeDetails') forwardExchangeDetails: any;

  formData: TemplateManagement = new TemplateManagement();
  mode: string;
  viewport: string;
  chargeRate: number = 0.0001;
  fxRates: string = '0.79';

  payableFxRate: string = '0.24';
  debitFxRate: string = '0.24';

  isGroupUser: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Template Management',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Payment Details', 'Beneficiary & Enrichment Details', 'Template Management - View'],
  };

  currencyName: string;
  debitAccountReqBody: any = { dataMap: { corporateId: this.userService.getCorporateId() } };
  extraFormData: any = {};
  uploadedFiles: any = [];

  instructionCount: number = 1;
  extraAddressCount: number = 0;

  isAddNewBeneficiary: boolean;
  isShowBicCodeModal: boolean;
  bicCodeColDefUrl: string = 'payments/transactions/templateManagement/private/bicCodeColDef';
  bicCodeRowDefUrl: string = 'payments/transactions/templateManagement/private/bicCodeData';

  isShowBeneficiaryModal: boolean;
  beneficiaryColDefUrl: string =
    'payments/transactions/templateManagement/private/beneficiaryColDef';
  beneficiaryRowDefUrl: string = 'payments/masters/beneficiary/private/getBeneficiaryList';

  forwardExchangeColDefUrl: string =
    'payments/transactions/templateManagement/private/forwardExchangeColDef';
  forwardExchangeRowDataUrl: string =
    'payments/transactions/templateManagement/private/forwardExchangeData';

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
  ) {}

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Template Management - Initiate',
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
      { label: 'Template Management' },
      { label: 'Initiate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

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

    this.getViewData();
    this.formData.valueDate = this.userService.applicationDate;
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'VIEW') this.stepperDetails.currentStep = this.stepperDetails.headings.length;

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/transactions/templateManagement/private/view', data)
        .subscribe((formData: TemplateManagement) => {
          this.viewService.clearAll();
          this.formData = formData;
        });
    } else {
      this.formData = new TemplateManagement();
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

  getSubHeading(stepNo: number): string {
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
    return 'Step' + stepNo + ' Details';
  }

  beforeSubmit(): boolean {
    return true;
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return true;
    } else if (stepNo == 2) {
      return true;
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
  }

  onDebitAccountChange(value: Select) {
    this.formData.debitAccountNo = value.displayName;
    this.formData.debitAccountBalance = value.enrichments.balance;
    this.formData.debitAccountCurrency = value.enrichments.currency;
    this.formData.debitAccountCurrencyCode = value.enrichments.currencyCode;
    this.formData.accountTitle = value.enrichments.accountTitle;
    this.formData.paymentRequestDetails[0].debitAccountId = value.id;
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
    this.stepperDetails.currentStep = 1;
    this.applyFormData();
  }
}
