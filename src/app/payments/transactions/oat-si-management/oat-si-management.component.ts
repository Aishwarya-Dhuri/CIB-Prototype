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
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { OatSiManagement } from './@model/oat-si-management.model';

@Component({
  selector: 'app-oat-si-management',
  templateUrl: './oat-si-management.component.html',
  styleUrls: ['./oat-si-management.component.scss'],
})
export class OatSiManagementComponent implements OnInit {
  @ViewChild('forwardExchangeDetails') forwardExchangeDetails: any;

  formData: OatSiManagement = new OatSiManagement();
  mode: string;
  viewport: string;

  chargeRate: number = 0.0001;

  payableFxRate: string = '0.24';

  currencyName: string;

  uploadedFiles: any = [];

  isGroupUser: boolean = false;

  instructionCount: number = 1;
  isExchangeDetails: boolean = false;

  paymentMethod!: Select;

  stepperDetails: Stepper = {
    masterName: 'SI Management',
    currentStep: 1,
    isSaveDraftApplicable: true,
    isSaveAsTemplateApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: [
      'Payment Details',
      'Beneficiary & Enrichment Details',
      'SI Details',
      'Review Details & Confirm',
    ],
  };

  frequencyDetailsUrl = '';

  constructor(
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private viewportService: ViewportService,
    private currencyService: CurrencyService,
    private userService: UserService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'OAT SI Management - Initiate',
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
      { label: 'OAT SI Management' },
      { label: 'Initiate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
    });

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.currencyService.getCurrency().subscribe((currency: any) => {
      this.formData.creditCurrencyId = currency.id;
      this.formData.creditCurrencyCode = currency.displayName;
      this.formData.debitCurrencyId = currency.id;
      this.formData.debitCurrencyCode = currency.displayName;
    });

    this.getViewData();

    this.formData.valueDate = this.userService.applicationDate;
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return true;
    }
    return true;
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'VIEW') this.stepperDetails.currentStep = this.stepperDetails.headings.length;

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/transactions/oatSiManagement/private/view', data)
        .subscribe((formData: OatSiManagement) => {
          this.viewService.clearAll();
          this.formData = formData;
        });
    } else {
      this.formData = new OatSiManagement();
      let enrichReq = {
        dataMap: { filters: [{ name: 'enrichmentFor', value: 'SINGLEPAYMENTREQUEST' }] },
      };
      this.httpService
        .httpPost('setup/templates/enrichmentMapping/private/view', enrichReq)
        .subscribe((enrichmentData: any) => {
          this.formData.oatSiManagementDetails[0].enrichments =
            enrichmentData.enrichmentMappingDetails;
        });
    }
  }

  applyFormData() {
    if (
      this.formData.oatSiManagementDetails[0].exchangeType == 'FORWARD' &&
      this.formData.oatSiManagementDetails[0].forwardExchangeId
    ) {
      setTimeout(() => {
        if (this.forwardExchangeDetails)
          this.forwardExchangeDetails.selectRow(
            { id: this.formData.oatSiManagementDetails[0].forwardExchangeId },
            'id',
          );
      }, 1100);
    }
  }

  beforeSubmit() {
    this.formData.transactionDate = this.formData.valueDate;
    this.formData.siName = this.formData.siDetails[0].name;
    return true;
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url.replace('initiate', 'listing'));
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
      return this.formData.oatSiManagementDetails[0].beneficiaryName;
    }
    return 'Step' + stepNo + ' Details';
  }

  onStepChange(stepNo: number, subStepNo: number): void {
    this.applyFormData();
  }

  onFrequencyChange(frequency: Select) {
    this.frequencyDetailsUrl = '';
    this.formData.siDetails[0].frequencyDetails = '';
    if (frequency.id === 'Weekly') {
      this.frequencyDetailsUrl =
        'payments/transactions/oatSiManagement/private/dropdown/weeklyFrequencyDetailsList';
    } else if (frequency.id === 'Monthly') {
      this.frequencyDetailsUrl =
        'payments/transactions/oatSiManagement/private/dropdown/monthlyFrequencyDetailsList';
    } else {
      this.frequencyDetailsUrl = '';
      this.formData.siDetails[0].frequencyDetails = '';
    }
  }

  onValueDateChange() {
    this.formData.transactionDate = this.formData.valueDate;
    this.formData.oatSiManagementDetails[0].valueDate = this.formData.valueDate;
    this.formData.oatSiManagementDetails[0].transactionDate = this.formData.valueDate;
  }

  onPaymentMethodChange(value: Select) {
    this.paymentMethod = value;
    this.formData.paymentMethodId = value.id;
    this.formData.paymentMethodName = value.displayName;
    this.formData.corporateProductId = value.enrichments.corporateProductId;
    this.formData.oatSiManagementDetails[0].paymentMethodId = value.id;
    this.formData.oatSiManagementDetails[0].corporateProductId =
      value.enrichments.corporateProductId;
  }

  onDebitAccountChange(value: Select) {
    this.formData.debitAccountNo = value.displayName;
    this.formData.debitCurrencyId = value.enrichments.currencyId;
    this.formData.debitAccountBalance = value.enrichments.balance;
    this.formData.accountTitle = value.enrichments.accountTitle;

    this.formData.oatSiManagementDetails[0].debitAccountId = value.id;
    this.isExchangeDetails = this.formData.creditCurrencyId != this.formData.debitCurrencyId;

    this.formData.debitAccountCorporate = value.enrichments.corporateId;
  }

  onCreditAccountChange(value: Select) {
    this.formData.creditAccountNo = value.displayName;
    this.formData.creditAccountBalance = value.enrichments.balance;
    this.formData.accountTitle = value.enrichments.accountTitle;
    this.formData.oatSiManagementDetails[0].creditAccountId = value.id;

    this.formData.creditAccountCorporate = value.enrichments.corporateId;
  }

  onDebitCurrencyChange(value: Select) {
    this.formData.debitCurrencyCode = value.displayName;
    this.formData.fxRate = value.enrichments.fxRateToBase;
    this.formData.oatSiManagementDetails[0].debitCurrencyId = value.id;
  }

  onCreditCurrencyChange(value: Select) {
    this.formData.creditCurrencyCode = value.displayName;
    this.payableFxRate = value.enrichments.fxRateToBase;
    this.formData.fxRate = value.enrichments.fxRateToBase;
    this.formData.oatSiManagementDetails[0].creditCurrencyId = value.id;
    this.isExchangeDetails = this.formData.debitCurrencyId != value.id;

    if (this.formData.payableAmount) {
      this.onPayableAmountChange();
    }
  }

  onPayableAmountChange() {
    this.formData.creditAmount = this.formData.payableAmount;
    this.formData.totalRequestAmount = this.formData.payableAmount;
    this.formData.oatSiManagementDetails[0].payableAmount = this.formData.payableAmount;
    const fxRate = +this.payableFxRate !== 0 ? +this.payableFxRate : 1;
    this.formData.debitAmount = (+this.formData.payableAmount / fxRate).toFixed(2).toString();
  }

  onDebitAmountChange() {
    this.formData.creditAmount = this.formData.debitAmount;
    this.formData.totalRequestAmount = this.formData.debitAmount;
    this.formData.oatSiManagementDetails[0].debitAmount = this.formData.debitAmount;
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
    this.formData.corporateRefNo = this.formData.oatSiManagementDetails[0].corporateRefNo;
  }

  onFileUploaded(files: any[]) {
    this.uploadedFiles = files;
    this.formData.oatSiManagementDetails[0].supportingDocList = [];
    files.forEach((file) => {
      this.formData.oatSiManagementDetails[0].supportingDocList.push({
        fileName: file.fileName,
        fileSize: file.fileName,
        progress: file.progress,
        originalFileName: file.fileName,
        sysFileName: file.sysFileName,
        size: file.fileSize,
        status: file.status,
      });
    });
  }

  onForwardExchangeSelection($event: any) {
    if ($event.node.selected) {
      this.formData.oatSiManagementDetails[0].forwardExchangeId = $event.data.id;
    } else {
      this.formData.oatSiManagementDetails[0].forwardExchangeId = '';
    }
  }

  onEditClick(isPaymentDetails: boolean): void {
    //this.isReviewEditClick = true;
    this.stepperDetails.currentStep = 1;
    this.applyFormData();
  }
}
