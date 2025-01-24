import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { OwnAccountTransfer } from '../../@model/own-account-transfer.model';

@Component({
  selector: 'app-own-account-transfer-initiate',
  templateUrl: './own-account-transfer-initiate.component.html',
  styleUrls: ['./own-account-transfer-initiate.component.scss'],
})
export class OwnAccountTransferInitiateComponent implements OnInit {
  @ViewChild('forwardExchangeDetails') forwardExchangeDetails: any;

  formData: OwnAccountTransfer = new OwnAccountTransfer();
  mode: string;
  viewport: string;

  chargeRate: number = 0.0001;

  payableFxRate: string = '0.79';

  currencyName: string;

  uploadedFiles: any = [];

  isGroupUser: boolean = false;

  instructionCount: number = 1;
  isExchangeDetails: boolean = false;

  paymentMethod!: Select;

  stepperDetails: Stepper = {
    masterName: 'Own Account Transfer',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: true,
    isSaveAsTemplateApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['Payment Details', 'Review Details & Confirm'],
  };

  constructor(
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private viewportService: ViewportService,
    private currencyService: CurrencyService,
    private userService: UserService,
    private viewService: ViewService,
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.formData.initiateMode = this.router.getCurrentNavigation().extras.state.initiateMode;
    }
  }

  ngOnInit(): void {
    if (this.userService.userDetails.corporateType === 'S') {
      this.router.navigate(['/payments/transactions/ownAccountTransfer'], {
        relativeTo: this.route,
      });
      return;
    }

    /* remove below : starts */
    const actions: Actions = {
      heading: 'Own Account Transfer - Initiate',
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
      { label: 'Own Account Transfer' },
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

    this.formData.corporateCode = this.userService.userDetails.corporateId;

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
        .httpPost('payments/transactions/ownAccountTransfer/private/view', data)
        .subscribe((formData: OwnAccountTransfer) => {
          this.viewService.clearAll();
          this.formData = formData;
        });
    } else if (this.mode == 'DRAFT') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/transactions/ownAccountTransfer/private/viewDraft', data)
        .subscribe((formData: OwnAccountTransfer) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.mode = '';
          this.stepperDetails.isUpdateDraft = true;
        });
    } else {
      this.formData.paymentRequestDetails[0].enrichments = [
        { name: 'Value Date', value: '', type: 'DATE', required: true },
        { name: 'Invoice Number', value: '', type: 'STRING', required: false },
      ];
    }
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

  beforeSubmit() {
    this.formData.transactionDate = this.formData.valueDate;
    return true;
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url.replace('initiate', 'listing'));
  }

  onValueDateChange() {
    this.formData.transactionDate = this.formData.valueDate;
    this.formData.paymentRequestDetails[0].valueDate = this.formData.valueDate;
    this.formData.paymentRequestDetails[0].transactionDate = this.formData.valueDate;
  }

  onPaymentMethodChange(value: Select) {
    this.paymentMethod = value;
    this.formData.paymentMethodId = value.id;
    this.formData.paymentMethodName = value.displayName;
    this.formData.corporateProductId = value.enrichments.corporateProductId;
    this.formData.paymentRequestDetails[0].paymentMethodId = value.id;
    this.formData.paymentRequestDetails[0].corporateProductId =
      value.enrichments.corporateProductId;
  }

  onDebitAccountChange(value: Select) {
    this.formData.debitAccountNo = value.displayName;
    this.formData.debitCurrencyId = value.enrichments.currencyId;
    this.formData.debitAccountBalance = value.enrichments.balance;
    this.formData.accountTitle = value.enrichments.accountTitle;

    this.formData.paymentRequestDetails[0].debitAccountId = value.id;
    this.isExchangeDetails = this.formData.creditCurrencyId != this.formData.debitCurrencyId;

    this.formData.debitAccountCorporate = value.enrichments.corporateId;
  }

  onCreditAccountChange(value: Select) {
    this.formData.creditAccountNo = value.displayName;
    this.formData.creditAccountBalance = value.enrichments.balance;
    this.formData.accountTitle = value.enrichments.accountTitle;
    this.formData.paymentRequestDetails[0].creditAccountId = value.id;

    this.formData.creditAccountCorporate = value.enrichments.corporateId;
  }

  onDebitCurrencyChange(value: Select) {
    this.formData.debitCurrencyCode = value.displayName;
    this.formData.paymentRequestDetails[0].debitCurrencyId = value.id;
  }

  onCreditCurrencyChange(value: Select) {
    this.formData.creditCurrencyCode = value.displayName;
    this.payableFxRate = value.enrichments.fxRateToBase;
    this.formData.fxRate = value.enrichments.fxRateToBase;
    this.formData.paymentRequestDetails[0].creditCurrencyId = value.id;
    this.isExchangeDetails = this.formData.debitCurrencyId != value.id;

    if (this.formData.payableAmount) {
      this.onPayableAmountChange();
    }
  }

  onPayableAmountChange() {
    this.formData.creditAmount = this.formData.payableAmount;
    this.formData.totalRequestAmount = this.formData.payableAmount;
    this.formData.paymentRequestDetails[0].payableAmount = this.formData.payableAmount;
    const fxRate = +this.payableFxRate !== 0 ? +this.payableFxRate : 1;
    this.formData.debitAmount = (+this.formData.payableAmount / fxRate).toFixed(2).toString();
  }

  onDebitAmountChange() {
    this.formData.creditAmount = this.formData.debitAmount;
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

  onFileUploaded(files: any[]) {
    this.uploadedFiles = files;
    this.formData.paymentRequestDetails[0].supportingDocList = [];
    files.forEach((file) => {
      this.formData.paymentRequestDetails[0].supportingDocList.push({
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
      this.formData.paymentRequestDetails[0].forwardExchangeId = $event.data.id;
    } else {
      this.formData.paymentRequestDetails[0].forwardExchangeId = '';
    }
  }

  onEditClick(isPaymentDetails: boolean): void {
    if (isPaymentDetails) {
      this.stepperDetails.currentStep = 1;
      this.applyFormData();
    }
  }
}
