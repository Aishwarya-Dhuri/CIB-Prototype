import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { cloneDeep } from 'lodash';
import {
  BeneficiaryDetails,
  BulkPaymentManual,
  BulkPaymentTransactionRequest,
  BulkPaymentUpload,
} from './@models/bulk-payment.model';
import { Select } from 'src/app/shared/@models/select.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';

@Component({
  selector: 'app-bulk-payment-request-initiate',
  templateUrl: './bulk-payment-request-initiate.component.html',
  styleUrls: ['./bulk-payment-request-initiate.component.scss'],
})
export class BulkPaymentRequestInitiateComponent implements OnInit {
  @Input('isViewMode') isViewMode: boolean = false;

  loading: boolean = true;

  showAddBeneficiary: boolean = false;
  isShowUploadDocuments: boolean = false;
  files: File[] = [];

  formData!: any;
  transactionData: BulkPaymentTransactionRequest = new BulkPaymentTransactionRequest();
  isLayoutData = false;

  transactionDetails: any;
  activeTransactionIndex: number = 0;
  isEditTransaction: boolean = true;
  showPrintBranchModel: boolean = false;

  fxRates: string = '0.79';

  payableFxRate: string = '0.24';
  debitFxRate: string = '0.24';

  isExchangeDetails: boolean = false;

  initiateType: string = '';
  mode: string = '';

  isShowEnrichments: boolean = false;
  private enrichmentDetails: any[] = [];
  enrichments: any[] = [];
  beneficiary: BeneficiaryDetails = new BeneficiaryDetails();

  treeData: any[] = [
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Bulk Payment Initiate',
          subHeader: '12 Aug 2022, 13:35',
          data: [],
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'File Parsed Successfully',
          subHeader: '12 Aug 2022, 13:35',
          data: ['Total Records: 10000', 'Parsed: 7500', 'Failed: 2500'],
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Validation in Process',
          subHeader: '12 Aug 2022, 13:35',
          data: [],
          active: false,
          partiallyActive: true,
          disabled: false,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Sent for Approval',
          subHeader: '',
          data: [],
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: true,
          header: 'Authorized',
          subHeader: '',
          data: [],
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
  ];

  stepperDetails: Stepper = {
    masterName: 'Bulk Payment',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    // isSaveAsTemplateApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  constructor(
    private actionsService: ActionService,
    private listingService: ListingService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private userService: UserService,
    private viewService: ViewService,
    private currencyService: CurrencyService,
    private router: Router,
  ) {
    if (this.router?.getCurrentNavigation()?.extras.state) {
      this.initiateType = this.router.getCurrentNavigation().extras.state.initiateType;
    }
    if (!this.initiateType) {
      this.initiateType = 'upload';
    }
  }

  ngOnInit(): void {
    if (!this.isViewMode) {
      const actions: Actions = {
        heading: 'Bulk Payment',
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
        { label: 'Bulk Payment' },
      ];

      this.breadcrumbService.setBreadCrumb(breadcrumbs);
    }

    const applicationDate: string = this.userService.userDetails.applicationDate;

    if (this.initiateType == 'upload') {
      this.stepperDetails.isSaveDraftApplicable = false;
      this.stepperDetails.isSecondLastStepLabelAsReview = false;
      this.stepperDetails.headings = [''];

      this.formData = new BulkPaymentUpload();
      this.formData.transactionDate = applicationDate;
    } else {
      this.formData = new BulkPaymentManual();
      this.formData.valueDate = applicationDate;
      this.currencyService.getCurrencyName().subscribe((currency: string) => {
        this.formData.currency = currency;
      });
      this.getEnrichments();
    }

    this.stepperDetails.isSaveDraftApplicable = this.formData.initiateType == 'manual';

    this.getViewData();
  }

  getEnrichments() {
    let enrichReq = {
      dataMap: { filters: [{ name: 'enrichmentFor', value: 'SINGLEPAYMENTREQUEST' }] },
    };
    this.httpService
      .httpPost('setup/templates/enrichmentMapping/private/view', enrichReq)
      .subscribe((enrichmentData: any) => {
        this.enrichmentDetails = enrichmentData.enrichmentMappingDetails;
        this.resetTransactionData();

        this.formData.transactions[0].enrichments = cloneDeep([...this.enrichmentDetails]);
        this.resetEnrichments();
      });
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'VIEW' || this.mode == 'EDIT') {
      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('payments/transactions/bulkPaymentRequest/private/view', data)
        .subscribe((formData: BulkPaymentUpload) => {
          this.viewService.clearAll();

          this.initiateType = formData.initiateType;
          this.formData = formData;

          if (this.initiateType == 'manual') {
            this.activeTransactionIndex = -1;
            this.isEditTransaction = false;
            this.getEnrichments();
            this.stepperDetails.headings = ['', ''];
          } else {
            this.stepperDetails.headings = [''];
          }

          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onClickAction(action: any, id: string) {
    this[action.methodName](id);
  }

  onViewTransaction(transactionId: string) {
    console.log(this.formData.id, transactionId);
    this.httpService
      .httpPost('payments/transactions/bulkPaymentRequest/private/viewTransaction', {
        dataMap: { id: this.formData.id, transactionId },
      })
      .subscribe((response: any) => {
        this.transactionDetails = response;
      });
  }

  validateForm(stepNo: number) {
    if (stepNo == 1) {
      if (this.formData.initiateType == 'upload') {
        return this.formData.uploadDocument.length > 0 && this.formData.template;
      }
    }
    return true;
  }

  onFileUploaded(file: any) {
    this.formData.uploadDocument = file;
  }

  onManualFileUploaded(files: any[]) {
    this.files = files;
  }

  beforeSubmit() {
    if (this.initiateType == 'upload') {
      const formData = new FormData();

      formData.append('transactionDate', this.formData.transactionDate);
      formData.append('initiateType', this.formData.initiateType);
      formData.append('template', this.formData.template);
      formData.append('remarkForChecker', this.formData.remarkForChecker);
      formData.append('channel', this.formData.channel);
      formData.append('amount', this.formData.amount);
      formData.append('status', this.formData.status);
      formData.append('supportingDocument', JSON.stringify(this.formData.supportingDocument));
      formData.append(
        'bulkFile',
        this.formData.uploadDocument[0],
        this.formData.uploadDocument[0].name,
      );

      this.formData = formData;
    }

    return true;
  }

  onSupportingDocumentUploaded(file: any) {
    this.formData.supportingDocument = file;
  }

  onBeneficiaryChange(beneficiary: any) {
    this.formData.transactions[this.activeTransactionIndex].beneficiaryCode =
      beneficiary.enrichments.beneficiaryCode;
    this.formData.transactions[this.activeTransactionIndex].beneficiaryName =
      beneficiary.enrichments.beneficiaryName;
    this.formData.transactions[this.activeTransactionIndex].beneAccount =
      beneficiary.enrichments.accountNo;
    this.formData.transactions[this.activeTransactionIndex].beneficiaryZipCode =
      beneficiary.enrichments.pinCode;
    this.formData.transactions[this.activeTransactionIndex].beneficiaryContactNumber =
      beneficiary.enrichments.phoneNo;
    this.formData.transactions[this.activeTransactionIndex].beneficiaryEmailId =
      beneficiary.enrichments.email;
    this.formData.transactions[this.activeTransactionIndex].beneficiaryAddress1 =
      beneficiary.enrichments.beneficiaryAddress1;
    this.formData.transactions[this.activeTransactionIndex].beneficiaryAddress2 =
      beneficiary.enrichments.beneficiaryAddress2;
    this.formData.transactions[this.activeTransactionIndex].beneficiaryAddress3 =
      beneficiary.enrichments.beneficiaryAddress3;
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url + '/listing');
  }

  onStepChange(stepNo: number) {
    if (stepNo == 1) {
      this.activeTransactionIndex = -1;
    } else if (stepNo == 2) {
      this.activeTransactionIndex = -1;
      this.isEditTransaction = false;
    }
  }

  onEditTransaction(i: number) {
    if (this.stepperDetails.currentStep == 2) {
      this.stepperDetails.currentStep = 1;
    }
    this.activeTransactionIndex = i;
    this.transactionData = cloneDeep({ ...this.formData.transactions[i] });
    this.files = cloneDeep([...this.formData.transactions[i].supportingDocument]);
    this.enrichments = cloneDeep([...this.formData.transactions[i].enrichments]);
    this.isEditTransaction = true;
  }

  onUploadDocuments(i: number) {
    this.files = cloneDeep([...this.formData.transactions[i].supportingDocument]);
    this.isShowUploadDocuments = true;
  }

  onEnrichments(i: number) {
    this.enrichments = cloneDeep([...this.formData.transactions[i].enrichments]);
    this.isShowEnrichments = true;
  }

  onPaymentMethodChange(paymentMethod: any) {
    this.formData.transactions[this.activeTransactionIndex].paymentMethodName =
      paymentMethod.displayName;
  }

  onSaveTransaction() {
    if (!this.validateEnrichments()) {
      this.onEnrichments(this.activeTransactionIndex);
      return;
    }

    this.activeTransactionIndex = -1;
    this.isEditTransaction = false;
    this.resetTransactionData();
    this.resetEnrichments();
    this.clearFiles();
  }

  resetTransactionData() {
    this.transactionData = new BulkPaymentTransactionRequest();
    this.transactionData.enrichments = [...cloneDeep(this.enrichmentDetails)];
  }

  validateEnrichments(): boolean {
    let validEnrichments: boolean = true;

    this.enrichments.forEach((enrich: any) => {
      if (!enrich.enrichmentIsNull && !enrich.value) {
        validEnrichments = false;
      }
    });

    console.log(validEnrichments);

    return validEnrichments;
  }

  onDebitAccountChange(value: Select) {
    this.formData.transactions[this.activeTransactionIndex].debitAccountNo = value.displayName;
    this.formData.transactions[this.activeTransactionIndex].accountBalance =
      value.enrichments.balance;
    this.formData.transactions[this.activeTransactionIndex].debitAccountBalance =
      value.enrichments.balance;
    this.formData.transactions[this.activeTransactionIndex].debitAccountCurrency =
      value.enrichments.currency;
    this.formData.transactions[this.activeTransactionIndex].debitAccountCurrencyCode =
      value.enrichments.currencyCode;
    this.formData.transactions[this.activeTransactionIndex].accountTitle =
      value.enrichments.accountTitle;
    this.formData.transactions[this.activeTransactionIndex].debitAccountId = value.id;
    this.formData.transactions[this.activeTransactionIndex].debitCurrencyId =
      value.enrichments.currencyId;
    this.formData.transactions[this.activeTransactionIndex].debitCurrencyCode =
      value.enrichments.currencyCode;
    this.formData.transactions[this.activeTransactionIndex].payableCurrencyId =
      value.enrichments.currencyId;


    this.formData.transactions[this.activeTransactionIndex].isExchangeDetails =
      this.formData.payableCurrencyId != this.formData.debitCurrencyId;
  }

  onPayableCurrencyChange(value: Select) {
    this.formData.transactions[this.activeTransactionIndex].payableCurrencyCode = value.displayName;
    this.formData.transactions[this.activeTransactionIndex].fxRate = value.enrichments.fxRateToBase;
    this.formData.transactions[this.activeTransactionIndex].payableCurrencyId = value.id;
    this.formData.transactions[this.activeTransactionIndex].isExchangeDetails =
      this.formData.debitCurrencyId != value.id;

    if (this.formData.transactions[this.activeTransactionIndex].payableAmount) {
      this.onPayableAmountChange();
    }
  }

  onAddBeneficiary(i: number) {
    this.beneficiary.beneficiary = this.formData.transactions[i].beneficiary;
    this.beneficiary.beneficiaryCode = this.formData.transactions[i].beneficiaryCode;
    this.beneficiary.beneficiaryName = this.formData.transactions[i].beneficiaryName;
    this.beneficiary.beneAccount = this.formData.transactions[i].beneAccount;
    this.beneficiary.beneficiaryType = this.formData.transactions[i].beneficiaryType;
    this.beneficiary.beneficiaryZipCode = this.formData.transactions[i].beneficiaryZipCode;
    this.beneficiary.beneficiaryContactNumber =
      this.formData.transactions[i].beneficiaryContactNumber;
    this.beneficiary.beneficiaryEmailId = this.formData.transactions[i].beneficiaryEmailId;
    this.beneficiary.beneficiaryAddressCount =
      this.formData.transactions[i].beneficiaryAddressCount;
    this.beneficiary.beneficiaryAddress1 = this.formData.transactions[i].beneficiaryAddress1;
    this.beneficiary.beneficiaryAddress2 = this.formData.transactions[i].beneficiaryAddress2;
    this.beneficiary.beneficiaryAddress3 = this.formData.transactions[i].beneficiaryAddress3;
    this.showAddBeneficiary = true;
  }

  onSaveBeneficiary() {
    this.formData.transactions[this.activeTransactionIndex] = {
      ...cloneDeep(this.formData.transactions[this.activeTransactionIndex]),
      ...cloneDeep(this.beneficiary),
      beneficiary: this.beneficiary.beneficiaryCode,
    };

    this.onCancelBeneficiaryModal();
  }
  onClearBeneficiary() {
    this.beneficiary = new BeneficiaryDetails();
  }

  onCancelBeneficiaryModal() {
    this.showAddBeneficiary = false;
    this.onClearBeneficiary();
  }

  onDebitCurrencyChange(value: Select) {
    this.formData.transactions[this.activeTransactionIndex].debitCurrencyCode = value.displayName;
    this.formData.transactions[this.activeTransactionIndex].fxRate = value.enrichments.fxRateToBase;
    this.formData.transactions[this.activeTransactionIndex].debitCurrencyId = value.id;
    if (this.formData.transactions[this.activeTransactionIndex].debitAmount) {
      this.onDebitAmountChange();
    }
  }

  onPayableAmountChange() {
    const payableAmount = this.formData.transactions[this.activeTransactionIndex].payableAmount;

    this.formData.transactions[this.activeTransactionIndex].totalRequestAmount = payableAmount;
    this.formData.transactions[this.activeTransactionIndex].payableAmount = payableAmount;
    const fxRate = +this.formData.transactions[this.activeTransactionIndex].fxRate;
    this.formData.transactions[this.activeTransactionIndex].debitAmount = (+payableAmount / fxRate)
      .toFixed(2)
      .toString();
  }

  onDebitAmountChange() {
    const debitAmount = this.formData.transactions[this.activeTransactionIndex].debitAmount;

    this.formData.transactions[this.activeTransactionIndex].totalRequestAmount = debitAmount;
    this.formData.transactions[this.activeTransactionIndex].debitAmount = debitAmount;
    const fxRate: number = +this.formData.transactions[this.activeTransactionIndex].fxRate;
    this.formData.transactions[this.activeTransactionIndex].payableAmount = (+debitAmount * fxRate)
      .toFixed(2)
      .toString();
  }

  addMoreTransaction() {
    const bulkPaymentTransactionRequest: BulkPaymentTransactionRequest =
      new BulkPaymentTransactionRequest();

    bulkPaymentTransactionRequest.enrichments = cloneDeep([...this.enrichmentDetails]);
    this.enrichments = bulkPaymentTransactionRequest.enrichments;

    this.formData.transactions.push(bulkPaymentTransactionRequest);

    this.activeTransactionIndex = this.formData.transactions.length - 1;

    this.isEditTransaction = true;
  }

  deleteTransaction(i: number) {
    this.formData.transactions.splice(i, 1);
  }

  discardTransaction() {
    this.formData.transactions[this.activeTransactionIndex] = cloneDeep({
      ...this.transactionData,
    });
    this.activeTransactionIndex = -1;
    this.isEditTransaction = false;
    this.resetTransactionData();
    this.resetEnrichments();
    this.clearFiles();
  }

  onUploadFile() {
    this.formData.transactions[this.activeTransactionIndex].supportingDocument = cloneDeep([
      ...this.files,
    ]);
    this.isShowUploadDocuments = false;
  }

  clearFiles() {
    this.files = [];
  }

  saveEnrichments() {
    this.formData.transactions[this.activeTransactionIndex].enrichments = cloneDeep(
      this.enrichments,
    );
    this.isShowEnrichments = false;
  }

  onBackClick() {
    let url = 'payments/transactions/wpsPayment';

    if (this.mode == 'VIEW') {
      url = 'payments/transactions/wpsPayment/listing#PENDINGLIST';

      if (!this.listingService.getSelectedListCode()) {
        const listTypeCode = url.split('#').length > 1 ? url.split('#')[1] : null;
        this.listingService.setSelectedListCode(listTypeCode);
      }

      url = url.substring(0, url.indexOf('#'));
    }

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
    });
  }

  private resetEnrichments() {
    this.enrichments = [...cloneDeep(this.enrichmentDetails)];
  }
}
