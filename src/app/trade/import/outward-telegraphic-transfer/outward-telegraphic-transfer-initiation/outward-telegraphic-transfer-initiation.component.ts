import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ClausesService } from 'src/app/trade/@components/clauses/@services/clauses.service';
import { OutwardTelegraphicTransfer, PaymentDetailsCurrencyAndAmount } from '../@models/outward-telegraphic-center.model';
import { OutwardTelegraphicTransferService } from '../@services/outward-telegraphic-transfer.service';



@Component({
  selector: 'app-outward-telegraphic-transfer-initiation',
  templateUrl: './outward-telegraphic-transfer-initiation.component.html',
  styleUrls: ['./outward-telegraphic-transfer-initiation.component.scss']
})
export class OutwardTelegraphicTransferInitiationComponent implements OnInit {
  @ViewChild('initiate') initiateComponent: any;
  @ViewChild('review') reviewComponent: any;

  @Input() isViewMode: boolean = false;

  loading: boolean;

  formData: OutwardTelegraphicTransfer = new OutwardTelegraphicTransfer();
  PaymentDetailsCurrencyAndAmountFormData: PaymentDetailsCurrencyAndAmount = new PaymentDetailsCurrencyAndAmount();

  mode: string = '';

  submitMessage: string = '';

  stepperDetails: Stepper = {
    masterName: 'Outward Telegraphic Transfer',
    stepperType: 'vertical',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: true,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    isHideLastStep: true,
    headings: [
      'Applicant Details',
      'Payment Details',
      'Beneficiary Details',
      'Finance Details',
      'Bill Details',
      'FX Rate',
      'Supporting Documents',
      'Terms And Conditions',
      'Review and Submit',
    ],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private OutwardTelegraphicTransferService: OutwardTelegraphicTransferService,
    private viewService: ViewService,
    private httpService: HttpService,
    private clausesService: ClausesService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.loading = true;

    if (!this.isViewMode) {
      const actions: Actions = {
        heading: 'Outward Telegraphic Transfer - Initiate',
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
        { label: 'Trade' },
        { label: 'Import' },
        { label: 'Outward Telegraph Transfer' },
        { label: 'Initiate' },
      ];

      this.breadcrumbService.setBreadCrumb(breadcrumbs);
    }

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW' || this.mode == 'REPAIR') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/importTransactions/outwardTelegraphTransfer/private/view', data)
        .subscribe((formData: OutwardTelegraphicTransfer) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
          this.loading = false;
        });
    } else if (this.mode == 'DRAFT') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/importTransactions/outwardTelegraphTransfer/private/viewDraft', data)
        .subscribe((formData: OutwardTelegraphicTransfer) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else if (this.mode == 'TEMPLATE') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/importTransactions/outwardTelegraphTransfer/private/viewTemplate', data)
        .subscribe((formData: OutwardTelegraphicTransfer) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }


  onStepClick(stepNo: number) {
    this.stepperDetails.currentStep = stepNo;
  }

  onStepChange(stepNo: number, subStepNo?: number): void {
    if (stepNo < 9) {
      this.initiateComponent.changeStep(stepNo - 1);
    } else {
      this.formData.clauses[0].documentMappingList = this.clausesService.clausesDataList;
    }
  }

  getStepFields(stepNo: number) {
    return this.initiateComponent ? this.initiateComponent.getStepFields(stepNo) : [];
  }

  // getStepCompletePercentage(stepNo: number) {
  //   const percentage: number = Math.ceil(
  //     this.initiateComponent ? this.initiateComponent.setStepCompleted(stepNo) : 0,
  //   );
  //   return percentage;
  // }

  validateForm(stepNo: number): boolean {
    if (stepNo < 9) {
      if (this.initiateComponent) {
        return this.initiateComponent.validateForm(stepNo);
      }
      return true;
    } else {
      if (this.initiateComponent) {
        return this.initiateComponent.validateBeforeReview();
      }
      return true;
    }
  }

  beforeSaveDraft() {
    this.prepareFormData();
    this.formData.initiateType = this.mode == 'REPAIR' ? 'Repair' : 'New';
    return true;
  }

  beforeSaveTemplate() {
    this.prepareFormData();
    return true;
  }

  beforeSubmit() {
    this.prepareFormData();
    return true;
  }

  afterSubmit(response: any) {
    this.submitMessage = 'Outward Telegraphic Transfer has been successfully Submitted.';
    return false;
  }

  onSubmitPopupClose() {
    this.submitMessage = '';
    this.goToListing();
  }

  goToListing() {
    this.router.navigate(['../listing'], { relativeTo: this.route });
  }

  private prepareFormData() {
    this.formData.proformaInvoiceNo = this.formData.billDetails[0].proformaInvoiceNo;
    this.formData.corporateReferenceNo = this.formData.paymentDetails[0].corpRefNo;
    this.formData.amends = 0;
    this.formData.currency = this.formData.letterOfCreditDetails[0].currency;
    this.formData.amount = this.formData.paymentDetails[0].debitAmtInPayableCcy;
    this.formData.minimumTolerance = this.formData.letterOfCreditDetails[0].minimumTolerance;
    this.formData.maximumTolerance = this.formData.letterOfCreditDetails[0].maximumTolerance;
    this.formData.notExceeding = this.formData.letterOfCreditDetails[0].notExceeding;
    this.formData.expiryDate = this.formData.letterOfCreditDetails[0].expiryDate;
    this.formData.placeOfExpiry = this.formData.letterOfCreditDetails[0].placeOfExpiry;
    this.formData.transactionDate = this.formData.letterOfCreditDetails[0].transactionDate;
    this.formData.issueDate = new Date().toDateString();
    this.formData.effectiveDate = this.formData.paymentDetails[0].effectiveDate;
    this.formData.applicantName = this.formData.applicantDetails[0].applicantName;
    this.formData.beneficiaryName = this.formData.beneficiaryDetails[0].beneficiaryName;
    this.formData.beneficiaryBankName = this.formData.beneficiaryDetails[0].beneficiaryBankName;
  }

  ngOnDestroy() {
    this.OutwardTelegraphicTransferService.activeStepIndex = 0;
    this.OutwardTelegraphicTransferService.resetLetterOfCredit();
  }

}
