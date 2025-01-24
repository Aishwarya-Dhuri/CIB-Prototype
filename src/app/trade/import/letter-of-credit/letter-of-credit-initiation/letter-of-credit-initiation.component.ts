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
import { LetterOfCredit } from '../@models/letter-of-credit.model';
import { LetterOfCreditService } from '../@services/letter-of-credit.service';

@Component({
  selector: 'app-letter-of-credit-initiation',
  templateUrl: './letter-of-credit-initiation.component.html',
  styleUrls: ['./letter-of-credit-initiation.component.scss'],
})
export class LetterOfCreditInitiationComponent implements OnInit, OnDestroy {
  @ViewChild('initiate') initiateComponent: any;
  @ViewChild('review') reviewComponent: any;

  @Input() isViewMode: boolean = false;
  @Input('parentRef') parentRef: LetterOfCreditInitiationComponent;

  loading: boolean;

  formData: LetterOfCredit = new LetterOfCredit();

  mode: string = '';

  submitMessage: string = '';
  searchBeneficiary = false;

  stepperDetails: Stepper = {
    masterName: 'Letter of Credit',
    stepperType: 'vertical',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: true,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    isHideLastStep: true,
    headings: [
      'Letter Of Credit Details',
      'Applicant Details',
      'Beneficiary Details',
      'Payment Details',
      'Shipping Details',
      'Supporting Documents',
      'Clauses',
      'Terms And Conditions',
      'Review and Submit',
    ],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private letterOfCreditService: LetterOfCreditService,
    private viewService: ViewService,
    private httpService: HttpService,
    private clausesService: ClausesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    if (!this.isViewMode) {
      const actions: Actions = {
        heading: 'Letter Of Credit - Initiate',
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
        { label: 'Letter Of Credit' },
        { label: 'Initiate' },
      ];

      this.breadcrumbService.setBreadCrumb(breadcrumbs);
    }

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW' || this.mode == 'REPAIR') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/importTransactions/letterOfCredit/private/view', data)
        .subscribe((formData: LetterOfCredit) => {
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
        .httpPost('trade/importTransactions/letterOfCredit/private/viewDraft', data)
        .subscribe((formData: LetterOfCredit) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else if (this.mode == 'TEMPLATE') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/importTransactions/letterOfCredit/private/viewTemplate', data)
        .subscribe((formData: LetterOfCredit) => {
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

  getStepCompletePercentage(stepNo: number) {
    const percentage: number = Math.ceil(
      this.initiateComponent ? this.initiateComponent.setStepCompleted(stepNo) : 0,
    );
    return percentage;
  }

  validateForm(stepNo: number): boolean {
    if (stepNo < 8) {
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
    this.submitMessage = 'The Finance application Has been successfully Submitted.';
    return false;
  }

  onSubmitPopupClose() {
    this.submitMessage = '';
    this.goToListing();
  }

  goToListing() {
    this.router.navigate(['../listing'], { relativeTo: this.route });
  }

  resetBeneficiaryDetails(frequencyOfExecution: any) {
    this.parentRef.formData.beneficiaryDetails[0] = {
      frequencyOfExecution: frequencyOfExecution,
      beneficiaryCode: '',
      beneficiaryName: '',
      email: '',
      bankSwiftCode: '',
      beneficiaryAddress1: [{ show: true, address: '' }],
      beneficiaryAddress2: [{ show: false, address: '' }],
      beneficiaryAddress3: [{ show: false, address: '' }],
      country: '',
      beneficiaryAccountNumber: '',
      beneficiaryBankName: '',
      beneficiaryBankAddress1: [{ show: true, address: '' }],
      beneficiaryBankAddress2: [{ show: false, address: '' }],
      beneficiaryBankAddress3: [{ show: false, address: '' }],
    };
  }

  onBeneSelection(beneficiary: any) {
    this.parentRef.formData.beneficiaryDetails[0] = {
      frequencyOfExecution: this.parentRef.formData.beneficiaryDetails[0].frequencyOfExecution,
      beneficiaryCode: beneficiary.beneficiaryCode,
      beneficiaryName: beneficiary.beneficiaryName,
      email: beneficiary.beneficiaryEmail,
      bankSwiftCode: beneficiary.id,
      beneficiaryAddress1: [{ show: true, address: beneficiary.beneficiaryAddress }],
      beneficiaryAddress2: [{ show: false, address: '' }],
      beneficiaryAddress3: [{ show: false, address: '' }],
      country: beneficiary.country,
      beneficiaryAccountNumber: beneficiary.beneficiaryAccountNo,
      beneficiaryBankName: beneficiary.beneficiaryBank,
      beneficiaryBankAddress1: [{ show: true, address: beneficiary.beneficiaryBankAddress }],
      beneficiaryBankAddress2: [{ show: false, address: '' }],
      beneficiaryBankAddress3: [{ show: false, address: '' }],
    };
    this.searchBeneficiary = false;
  }

  private prepareFormData() {
    this.formData.irrevocable = this.formData.letterOfCreditDetails[0].irrevocable;
    this.formData.transferable = this.formData.letterOfCreditDetails[0].transferable;
    this.formData.proformaInvoiceNo = this.formData.letterOfCreditDetails[0].proformaInvoiceNo;
    this.formData.corporateReferenceNo =
      this.formData.letterOfCreditDetails[0].corporateReferenceNo;
    this.formData.amends = 0;
    this.formData.currency = this.formData.letterOfCreditDetails[0].currency;
    this.formData.amount = this.formData.letterOfCreditDetails[0].amount;
    this.formData.minimumTolerance = this.formData.letterOfCreditDetails[0].minimumTolerance;
    this.formData.maximumTolerance = this.formData.letterOfCreditDetails[0].maximumTolerance;
    this.formData.notExceeding = this.formData.letterOfCreditDetails[0].notExceeding;
    this.formData.expiryDate = this.formData.letterOfCreditDetails[0].expiryDate;
    this.formData.placeOfExpiry = this.formData.letterOfCreditDetails[0].placeOfExpiry;
    this.formData.transactionDate = this.formData.letterOfCreditDetails[0].transactionDate;
    this.formData.issueDate = new Date().toDateString();
    this.formData.effectiveDate = this.formData.letterOfCreditDetails[0].effectiveDate;
    this.formData.applicantName = this.formData.applicantDetails[0].applicantName;
    this.formData.beneficiaryDetails[0].beneficiaryName = this.formData.beneficiaryDetails[0].beneficiaryName;
    this.formData.beneficiaryDetails[0].beneficiaryBankName = this.formData.beneficiaryDetails[0].beneficiaryBankName;
  }

  ngOnDestroy() {
    this.letterOfCreditService.activeStepIndex = 0;
    this.letterOfCreditService.resetLetterOfCredit();
  }
}
