import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BankGuaranteeAmendService } from '../@services/bank-guarantee-amend.service';
import { BankGuaranteeAmendComponent } from '../bank-guarantee-amend.component';
import { BankGuarantee } from '../../bank-guarantee/@models/bank-guarantee.model';

@Component({
  selector: 'app-bank-guarantee-amend-initiate',
  templateUrl: './bank-guarantee-amend-initiate.component.html',
  styleUrls: ['./bank-guarantee-amend-initiate.component.scss'],
})
export class BankGuaranteeAmendInitiateComponent implements OnInit {
  @Input('parentRef') parentRef: BankGuaranteeAmendComponent;

  loading: boolean = false;

  viewport: string;

  formData: any = {};

  activeStepIndex: number;

  amendmentStatus = false;

  showSubmit: boolean = false;

  remark: string = '';
  remarkField: string = '';
  showRemark = false;

  showMoreDetails = false;

  bankGuarantee: BankGuarantee;

  bankGuaranteeAmend: any = {
    bankGuaranteeDetails: [
      {
        corporateReferenceNo: [
          {
            value: '',
            remark: '',
            showRemark: false,
            isValidated: false,
          },
        ],
      },
    ],

    transactionDetails: [
      {
        claimExpiryDate: [
          {
            value: '',
            remark: '',
            showRemark: false,
            isValidated: false,
          },
        ],
        guaranteeFormat: [
          {
            value: '',
            remark: '',
            supportingDocument: [],
            showRemark: false,
            isValidated: false,
          },
        ],
        preferredLanguageOfGuarantee: [
          {
            value: '',
            remark: '',
            showRemark: false,
            isValidated: false,
          },
        ],
        name: [
          {
            value: '',
            remark: '',
            showRemark: false,
            isValidated: false,
          },
        ],
        telephoneNo: [
          {
            value: '',
            remark: '',
            showRemark: false,
            isValidated: false,
          },
        ],
        idProof: [
          {
            value: '',
            remark: '',
            showRemark: false,
            isValidated: false,
          },
        ],
      },
    ],
    beneficiaryDetails: [
      {
        beneficiaryCode: [
          {
            value: '',
            remark: '',
            showRemark: false,
            isValidated: false,
          },
        ],
        beneficiaryName: [
          {
            value: '',
            remark: '',
            showRemark: false,
            isValidated: false,
          },
        ],
        country: [
          {
            value: '',
            remark: '',
            showRemark: false,
            isValidated: false,
          },
        ],
      },
    ],
  };

  mode: string = '';

  stepperDetails: Stepper = {
    masterName: 'Bank Guarantee Amend',
    stepperType: 'vertical',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: true,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    isHideLastStep: true,
    headings: [
      'Amend Details',
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
    private bankGuaranteeAmendService: BankGuaranteeAmendService,
    private actionsService: ActionService,
    private viewportService: ViewportService,
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
      if (viewport === 'web' && this.parentRef.currentScreen != 'AMENDVIEW') {
        this.actionsService.setShowActionContainer(false);
      } else {
        this.actionsService.setShowActionContainer(true);
      }
    });

    this.parentRef.stepperDetails = this.stepperDetails;

    this.activeStepIndex = this.bankGuaranteeAmendService.activeStepIndex;

    const id = this.parentRef.amendableRecordId;

    if (id) {
      const data = { dataMap: { id } };
      this.httpService
        .httpPost('trade/exportTransactions/bankGuarantee/private/view', data)
        .subscribe((formData: any) => {
          if (!formData) {
            this.parentRef.currentScreen = 'SEARCH_RESULTS';
          }

          this.bankGuarantee = formData;

          this.parentRef.formData = this.bankGuarantee;

          if (this.parentRef.currentScreen == 'AMENDVIEW') {
            this.mode = 'VIEW';
            this.activeStepIndex = 7;
            this.stepperDetails.currentStep = 8;
          }

          this.loading = false;
        });
    } else {
      this.mode = this.viewService.getMode();

      if (this.mode == 'EDIT' || this.mode == 'VIEW') {
        const data = { dataMap: { id: this.viewService.getId() } };
        this.httpService
          .httpPost('trade/exportTransactions/bankGuaranteeAmend/private/view', data)
          .subscribe((formData: any) => {
            this.viewService.clearAll();
            this.formData = formData;

            this.bankGuaranteeAmend = { ...formData.amendment[0] };

            delete formData.amendment;

            this.bankGuarantee = formData;

            if (this.mode == 'VIEW') {
              this.activeStepIndex = this.stepperDetails.headings.length - 1;
              this.stepperDetails.currentStep = this.stepperDetails.headings.length;
            }
            this.loading = false;
          });
      } else if (this.mode == 'DRAFT') {
        const data = { dataMap: { id: this.viewService.getId() } };
        this.httpService
          .httpPost('trade/exportTransactions/bankGuaranteeAmend/private/viewDraft', data)
          .subscribe((formData: any) => {
            this.viewService.clearAll();
            this.formData = formData;

            this.loading = false;
          });
      } else if (this.mode == 'TEMPLATE') {
        const data = { dataMap: { id: this.viewService.getId() } };
        this.httpService
          .httpPost('trade/exportTransactions/bankGuaranteeAmend/private/viewTemplate', data)
          .subscribe((formData: any) => {
            this.viewService.clearAll();
            this.formData = formData;

            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    }
  }

  onStepsReady() {
    this.stepperDetails.steps = this.stepperDetails.steps.map((step: any) => {
      step.visited = true;
      step.completed = true;
      step.stepStatus = 'success';
      return step;
    });

    if (this.bankGuaranteeAmend.bankGuaranteeDetails[0].corporateReferenceNo[0].value) {
      this.setStepStatus(2);
    } else {
      this.stepperDetails.steps[1].stepStatus = 'amend';
    }

    if (
      this.bankGuaranteeAmend.beneficiaryDetails[0].beneficiaryCode[0].value &&
      this.bankGuaranteeAmend.beneficiaryDetails[0].beneficiaryName[0].value &&
      this.bankGuaranteeAmend.beneficiaryDetails[0].country[0].value
    ) {
      this.setStepStatus(4);
    } else {
      this.stepperDetails.steps[3].stepStatus = 'amend';
    }

    if (
      this.bankGuaranteeAmend.transactionDetails[0].claimExpiryDate[0].value &&
      this.bankGuaranteeAmend.transactionDetails[0].guaranteeFormat[0].value &&
      this.bankGuaranteeAmend.transactionDetails[0].preferredLanguageOfGuarantee[0].value &&
      this.bankGuaranteeAmend.transactionDetails[0].name[0].value &&
      this.bankGuaranteeAmend.transactionDetails[0].telephoneNo[0].value &&
      this.bankGuaranteeAmend.transactionDetails[0].idProof[0].value
    ) {
      this.setStepStatus(5);
    } else {
      this.stepperDetails.steps[4].stepStatus = 'amend';
    }
  }

  addRemark(field: string): void {
    if (this.activeStepIndex === 1) {
      this.bankGuaranteeAmend.bankGuaranteeDetails[0][this.remarkField][0].remark = this.remark;
    } else if (this.activeStepIndex === 4) {
      this.bankGuaranteeAmend.transactionDetails[0][this.remarkField][0].remark = this.remark;
    } else if (this.activeStepIndex === 5) {
      this.bankGuaranteeAmend.transactionDetails[0][this.remarkField][0].remark = this.remark;
    }
    this.showRemark = false;
    this.remarkField = '';
    this.remark = '';
  }

  onComment(field: string): void {
    this.remarkField = field;
    if (this.activeStepIndex === 1) {
      this.remark = this.bankGuaranteeAmend.bankGuaranteeDetails[0][field][0].remark;
    } else if (this.activeStepIndex === 4) {
      this.remark = this.bankGuaranteeAmend.transactionDetails[0][field][0].remark;
    } else if (this.activeStepIndex === 5) {
      this.remark = this.bankGuaranteeAmend.transactionDetails[0][field][0].remark;
    }
    this.showRemark = true;
  }

  cancel(): void {
    this.showSubmit = false;
    this.router.navigate(['./', 'listing'], { relativeTo: this.route });
  }

  changeAmendStep(action: string) {
    if (action == 'next') {
      this.changeStep(this.activeStepIndex < 1 ? 1 : 4);
    } else if (action == 'previous') {
      this.changeStep(this.activeStepIndex > 4 ? 4 : 1);
    }
  }

  changeStep(stepIndex: number) {
    this.onStepChange(stepIndex + 1);
    this.setStepStatus(stepIndex + 1);
  }

  setStepStatus(stepNo: number) {
    if (this.formValidation(stepNo)) {
      this.stepperDetails.steps[stepNo - 1].visited = true;
      this.stepperDetails.steps[stepNo - 1].completed = true;
      this.stepperDetails.steps[stepNo - 1].stepStatus = 'success';
    } else {
      this.stepperDetails.steps[stepNo - 1].visited = true;
      this.stepperDetails.steps[stepNo - 1].completed = true;
      this.stepperDetails.steps[stepNo - 1].stepStatus = 'error';
    }
  }

  private formValidation(stepNo: number) {
    if (stepNo == 2) {
      return this.bankGuaranteeAmend.bankGuaranteeDetails[0].corporateReferenceNo[0].isValidated;
    } else if (stepNo == 4) {
      return (
        this.bankGuaranteeAmend.beneficiaryDetails[0].beneficiaryCode[0].isValidated &&
        this.bankGuaranteeAmend.beneficiaryDetails[0].beneficiaryName[0].isValidated &&
        this.bankGuaranteeAmend.beneficiaryDetails[0].country[0].isValidated
      );
    } else if (stepNo == 5) {
      return (
        this.bankGuaranteeAmend.transactionDetails[0].claimExpiryDate[0].isValidated &&
        this.bankGuaranteeAmend.transactionDetails[0].guaranteeFormat[0].isValidated &&
        this.bankGuaranteeAmend.transactionDetails[0].preferredLanguageOfGuarantee[0].isValidated &&
        this.bankGuaranteeAmend.transactionDetails[0].name[0].isValidated &&
        this.bankGuaranteeAmend.transactionDetails[0].telephoneNo[0].isValidated &&
        this.bankGuaranteeAmend.transactionDetails[0].idProof[0].isValidated
      );
    }
    return true;
  }

  amendValueEntered(field: string): void {
    if (this.activeStepIndex === 1) {
      if (this.bankGuaranteeAmend.bankGuaranteeDetails[0][field][0].value) {
        this.bankGuaranteeAmend.bankGuaranteeDetails[0][field][0].isValidated = true;
      } else {
        this.bankGuaranteeAmend.bankGuaranteeDetails[0][field][0].isValidated = false;
      }
    } else if (this.activeStepIndex === 4) {
      if (this.bankGuaranteeAmend.beneficiaryDetails[0][field][0].value) {
        this.bankGuaranteeAmend.beneficiaryDetails[0][field][0].isValidated = true;
      } else {
        this.bankGuaranteeAmend.beneficiaryDetails[0][field][0].isValidated = false;
      }
    } else if (this.activeStepIndex === 5) {
      if (this.bankGuaranteeAmend.transactionDetails[0][field][0].value) {
        this.bankGuaranteeAmend.transactionDetails[0][field][0].isValidated = true;
      } else {
        this.bankGuaranteeAmend.transactionDetails[0][field][0].isValidated = false;
      }
    }

    if (this.formValidation(this.activeStepIndex + 1)) {
      this.stepperDetails.steps[this.activeStepIndex].stepStatus = 'success';
    } else {
      this.stepperDetails.steps[this.activeStepIndex].stepStatus = 'error';
    }

    this.changeAmendmentStatus();
  }

  validateForm(stepNo: number) {
    if (stepNo == 5) {
      return this.formValidation(5) && this.amendmentStatus;
    }
    return true;
  }

  onStepChange(stepNo: number) {
    if (this.activeStepIndex <= stepNo - 1) {
      if (stepNo === 1) {
        this.activeStepIndex = 0;
        this.stepperDetails.currentStep = 1;
      } else if (stepNo === 2) {
        this.activeStepIndex = 1;
        this.stepperDetails.currentStep = 2;
      } else if (stepNo === 3 || stepNo === 4) {
        this.activeStepIndex = 3;
        this.stepperDetails.currentStep = 4;
      } else if (stepNo === 5) {
        this.activeStepIndex = 4;
        this.stepperDetails.currentStep = 5;
      } else {
        if (this.amendmentStatus) {
          this.activeStepIndex = 7;
          this.stepperDetails.currentStep = 8;
        }
      }
    } else {
      if (stepNo === 1) {
        this.activeStepIndex = 0;
        this.stepperDetails.currentStep = 1;
      } else if (stepNo === 2 || stepNo === 3) {
        this.activeStepIndex = 1;
        this.stepperDetails.currentStep = 2;
      } else if (stepNo <= 4) {
        this.activeStepIndex = 3;
        this.stepperDetails.currentStep = 4;
      } else if (stepNo >= 5) {
        this.activeStepIndex = 4;
        this.stepperDetails.currentStep = 5;
      }
    }
  }

  beforeSubmit() {
    this.formData = {
      ...this.bankGuarantee,
      amendment: [this.bankGuaranteeAmend],
    };

    return true;
  }

  beforeSaveDraft() {
    this.formData = {
      ...this.bankGuarantee,
      amendment: [this.bankGuaranteeAmend],
    };

    return true;
  }

  beforeSaveTemplate() {
    this.formData = {
      ...this.bankGuarantee,
      amendment: [this.bankGuaranteeAmend],
    };

    return true;
  }

  afterSubmit() {
    this.showSubmit = true;
    return false;
  }

  changeAmendmentStatus() {
    if (
      this.bankGuaranteeAmend.bankGuaranteeDetails[0].corporateReferenceNo[0].isValidated &&
      this.bankGuaranteeAmend.beneficiaryDetails[0].beneficiaryCode[0].isValidated &&
      this.bankGuaranteeAmend.beneficiaryDetails[0].beneficiaryName[0].isValidated &&
      this.bankGuaranteeAmend.beneficiaryDetails[0].country[0].isValidated &&
      this.bankGuaranteeAmend.transactionDetails[0].claimExpiryDate[0].isValidated &&
      this.bankGuaranteeAmend.transactionDetails[0].guaranteeFormat[0].isValidated &&
      this.bankGuaranteeAmend.transactionDetails[0].preferredLanguageOfGuarantee[0].isValidated &&
      this.bankGuaranteeAmend.transactionDetails[0].name[0].isValidated &&
      this.bankGuaranteeAmend.transactionDetails[0].telephoneNo[0].isValidated &&
      this.bankGuaranteeAmend.transactionDetails[0].idProof[0].isValidated
    ) {
      this.amendmentStatus = true;
    } else {
      this.amendmentStatus = false;
    }
  }
}
