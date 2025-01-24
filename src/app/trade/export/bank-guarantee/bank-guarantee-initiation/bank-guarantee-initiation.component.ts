import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BankGuarantee } from '../@models/bank-guarantee.model';
import { BankGuaranteeService } from '../@services/bank-guarantee.service';

@Component({
  selector: 'app-bank-guarantee-initiation',
  templateUrl: './bank-guarantee-initiation.component.html',
  styleUrls: ['./bank-guarantee-initiation.component.scss'],
})
export class BankGuaranteeInitiationComponent implements OnInit {
  @ViewChild('initiate') initiateComponent: any;
  @ViewChild('review') reviewComponent: any;
  @Input() isViewMode: boolean;

  loading: boolean;
  formData: BankGuarantee = new BankGuarantee();

  mode: string = '';

  submitMessage: string = '';

  stepperDetails: Stepper = {
    masterName: 'Bank Guarantee',
    stepperType: 'vertical',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: true,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    isHideLastStep: true,
    headings: [
      'Bank Guarantee Details',
      'Applicant Details',
      'Beneficiary Details',
      'Transaction Details',
      'Supporting Documents',
      'Terms And Conditions',
      'Review and Submit',
    ],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private bankGuaranteeService: BankGuaranteeService,
    private viewService: ViewService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    if (!this.isViewMode) {
      const actions: Actions = {
        heading: 'Bank Guarantee - Initiate',
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
        { label: 'Export' },
        { label: 'Bank Guarantee' },
        { label: 'Initiate' },
      ];

      this.breadcrumbService.setBreadCrumb(breadcrumbs);
    }

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW' || this.mode == 'REPAIR') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/exportTransactions/bankGuarantee/private/view', data)
        .subscribe((formData: BankGuarantee) => {
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
        .httpPost('trade/exportTransactions/bankGuarantee/private/viewDraft', data)
        .subscribe((formData: BankGuarantee) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else if (this.mode == 'TEMPLATE') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/exportTransactions/bankGuarantee/private/viewTemplate', data)
        .subscribe((formData: BankGuarantee) => {
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
    if (stepNo < 7) {
      this.initiateComponent.changeStep(stepNo - 1);
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
    if (stepNo < 6) {
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
    this.formData.initiationType = this.mode == 'REPAIR' ? 'Repair' : 'New';
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
    this.submitMessage = 'The Bank Guarantee has been submitted successfully.';
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
    (this.formData.bankGuaranteeNo = (Math.random() * 1000).toString()),
      (this.formData.typeOfApplicationOrUndertaking =
        this.formData.bankGuaranteeDetails[0].typeOfApplicationOrUndertaking),
      (this.formData.corporateReferenceNo =
        this.formData.bankGuaranteeDetails[0].corporateReferenceNo),
      (this.formData.transactionDate = this.formData.bankGuaranteeDetails[0].transactionDate),
      (this.formData.applicant = this.formData.applicantDetails[0].applicant),
      (this.formData.applicantName = this.formData.applicantDetails[0].applicantName),
      (this.formData.beneficiaryName = this.formData.beneficiaryDetails[0].beneficiaryName),
      (this.formData.currency = this.formData.transactionDetails[0].currency),
      (this.formData.amount = this.formData.transactionDetails[0].amount),
      (this.formData.expiryDate = this.formData.transactionDetails[0].expiryDate),
      (this.formData.claimExpiryDate = this.formData.transactionDetails[0].claimExpiryDate),
      (this.formData.status = 'Authorized');
    this.formData.noOfAmendments = '0';
  }

  ngOnDestroy() {
    this.bankGuaranteeService.activeStepIndex = 0;
    this.bankGuaranteeService.resetBankGuarantee();
  }
}
