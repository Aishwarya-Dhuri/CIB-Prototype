import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Beneficiary, BeneficiaryDetails, LetterOfCredit } from '../../letter-of-credit/@models/letter-of-credit.model';
import { LetterOfCreditAmendService } from '../@services/letter-of-credit-amend.service';
import { LetterOfCreditAmendComponent } from '../letter-of-credit-amend.component';

@Component({
  selector: 'app-letter-of-credit-amend-initiate',
  templateUrl: './letter-of-credit-amend-initiate.component.html',
  styleUrls: ['./letter-of-credit-amend-initiate.component.scss'],
})
export class LetterOfCreditAmendInitiateComponent implements OnInit, OnDestroy {
  @Input('parentRef') parentRef: LetterOfCreditAmendComponent;

  loading: boolean = false;

  viewport: string;

  formData: any = {};

  activeStepIndex: number;

  amendmentStatus = false;

  showSubmit: boolean = false;

  remark = '';
  showRemark = false;

  showMoreDetails = false;

  letterOfCredit: LetterOfCredit;
  beneficiary: Beneficiary;

  beneficiaryDetails:BeneficiaryDetails;

  letterOfCreditAmend: any = {
    letterOfCreditDetails: [
      {
        amount: [
          {
            value: '',
            remark: '',

            showRemark: false,
            isValidated: false,
          },
        ],
        irrevocable: false,
        transferable: false,
        increaseOfDocumentaryCreditAmountAmend:'',
        decreaseOfDocumentaryCreditAmountAmend:'',
        notExceedingAmend:'',
        expiryDateAmend:'',
        maximumToleranceAmend:'',
        minimumToleranceAmend:'',
        placeOfExpiryAmend:'',
        negotiationDeferredPaymentDetails:'',
        additionalDocuments:'',
        instructionsToBank:''
      },
    ],

    shippingDetails: [
      {
        modeOfShipment: '',
        latestDateOfShipment:'',
        partialShipment: '',
        transhipment: '',
        shipmentFrom:'',
        shipmentTo:'',
        placeOfTakingCharge:'',
        portOfLoading:'',
        portOfDischarge:'',
        finalDestination:'',
        goodsDescription:'',
        termsOfShipment:'',
        periodOfPresentation: [
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

  mode: string;

  stepperDetails: Stepper = {
    masterName: 'Letter of Credit Amend',
    stepperType: 'vertical',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: true,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    isHideLastStep: true,
    headings: [
      'Amend Details',
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
    private letterOfCreditAmendService: LetterOfCreditAmendService,
    private viewportService: ViewportService,
    private httpService: HttpService,
    private viewService: ViewService,
    private route: ActivatedRoute,
    private router: Router,
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

    // this.letterOfCredit = new LetterOfCredit();

    this.activeStepIndex = this.letterOfCreditAmendService.activeStepIndex;

    const id = this.parentRef.amendableRecordId;

    if (id) {
      const data = { dataMap: { id } };
      this.httpService
        .httpPost('trade/importTransactions/letterOfCredit/private/view', data)
        .subscribe((formData: any) => {
          if (!formData) {
            this.parentRef.currentScreen = 'SEARCH_RESULTS';
          }

          this.letterOfCredit = formData;

          this.parentRef.formData = this.letterOfCredit;

          if (this.parentRef.currentScreen == 'AMENDVIEW') {
            this.mode = 'VIEW';
            this.activeStepIndex = 9;
            this.stepperDetails.currentStep = 10;
          }

          this.loading = false;
        });
    } else {
      this.mode = this.viewService.getMode();

      if (this.mode == 'EDIT' || this.mode == 'VIEW') {
        const data = { dataMap: { id: this.viewService.getId() } };
        this.httpService
          .httpPost('trade/importTransactions/letterOfCreditAmend/private/view', data)
          .subscribe((formData: any) => {
            this.viewService.clearAll();
            this.formData = formData;

            this.letterOfCreditAmend = { ...formData.amendment[0] };

            delete formData.amendment;

            this.letterOfCredit = formData;

            if (this.mode == 'VIEW') {
              this.activeStepIndex = this.stepperDetails.headings.length - 1;
              this.stepperDetails.currentStep = this.stepperDetails.headings.length;
            }
            this.loading = false;
          });
      } else if (this.mode == 'DRAFT') {
        const data = { dataMap: { id: this.viewService.getId() } };
        this.httpService
          .httpPost('trade/importTransactions/letterOfCreditAmend/private/viewDraft', data)
          .subscribe((formData: any) => {
            this.viewService.clearAll();
            this.formData = formData;

            this.loading = false;
          });
      } else if (this.mode == 'TEMPLATE') {
        const data = { dataMap: { id: this.viewService.getId() } };
        this.httpService
          .httpPost('trade/importTransactions/letterOfCreditAmend/private/viewTemplate', data)
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

  onCheckedSupportingDocument(checkboxEvent: any, documentType: string) {
    if (!checkboxEvent.checked) {
      this.parentRef.formData.supportingDocuments[0][documentType + 'RefNo'] = '';
      this.parentRef.formData.supportingDocuments[0][documentType + 'Document'] = [];
    }
  }

  onStepsReady() {
    this.stepperDetails.steps = this.stepperDetails.steps.map((step: any) => {
      step.visited = true;
      step.completed = true;
      step.stepStatus = 'success';
      return step;
    });

    if (this.letterOfCreditAmend.letterOfCreditDetails[0].amount[0].value) {
      this.setStepStatus(2);
    } else {
      this.stepperDetails.steps[1].stepStatus = 'amend';
    }

    if (this.letterOfCreditAmend.shippingDetails[0].periodOfPresentation[0].value) {
      this.setStepStatus(6);
    } else {
      this.stepperDetails.steps[5].stepStatus = 'amend';
    }
  }

  addRemark() {
    if (this.activeStepIndex === 1) {
      this.letterOfCreditAmend.letterOfCreditDetails[0].amount[0].remark = this.remark;
    } else if (this.activeStepIndex === 5) {
      this.letterOfCreditAmend.shippingDetails[0].periodOfPresentation[0].remark = this.remark;
    }

    this.showRemark = false;
    this.remark = '';
  }

  onComment() {
    if (this.activeStepIndex === 1) {
      this.remark = this.letterOfCreditAmend.letterOfCreditDetails[0].amount[0].remark;
    } else if (this.activeStepIndex === 5) {
      this.remark = this.letterOfCreditAmend.shippingDetails[0].periodOfPresentation[0].remark;
    }
    this.showRemark = true;
  }

  cancel() {
    this.showSubmit = false;
    this.router.navigate(['./', 'listing'], { relativeTo: this.route });
  }

  changeAmendStep(action: string) {
    if (action == 'next') {
      this.changeStep(this.activeStepIndex < 1 ? 1 : 5);
    } else if (action == 'previous') {
      this.changeStep(this.activeStepIndex > 5 ? 5 : 1);
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
      return this.letterOfCreditAmend.letterOfCreditDetails[0].amount[0].isValidated;
    } else if (stepNo == 6) {
      return this.letterOfCreditAmend.shippingDetails[0].periodOfPresentation[0].isValidated;
    }
    return true;
  }

  amendValueEntered() {
    if (this.activeStepIndex === 1) {
      if (this.letterOfCreditAmend.letterOfCreditDetails[0].amount[0].value) {
        this.letterOfCreditAmend.letterOfCreditDetails[0].amount[0].isValidated = true;
        this.stepperDetails.steps[this.activeStepIndex].stepStatus = 'success';
      } else {
        this.letterOfCreditAmend.letterOfCreditDetails[0].amount[0].isValidated = false;
        this.stepperDetails.steps[this.activeStepIndex].stepStatus = 'amend';
      }
    } else if (this.activeStepIndex === 5) {
      if (this.letterOfCreditAmend.shippingDetails[0].periodOfPresentation[0].value) {
        this.letterOfCreditAmend.shippingDetails[0].periodOfPresentation[0].isValidated = true;
        this.stepperDetails.steps[this.activeStepIndex].stepStatus = 'success';
      } else {
        this.letterOfCreditAmend.shippingDetails[0].periodOfPresentation[0].isValidated = false;
        this.stepperDetails.steps[this.activeStepIndex].stepStatus = 'amend';
      }
    }

    this.changeAmendmentStatus();
  }

  validateForm(stepNo: number) {
    if (stepNo == 6) {
      return this.formValidation(6) && this.amendmentStatus;
    }
    return true;
  }

  onStepChange(stepNo: number) {
    if (this.activeStepIndex <= stepNo - 1) {
      if (stepNo === 1) {
        this.activeStepIndex = 0;
        this.stepperDetails.currentStep = 1;
      } 
      else if (stepNo === 2) {
        this.activeStepIndex = 1;
        this.stepperDetails.currentStep = 2;
      } 
      else if (stepNo === 3) {
        this.activeStepIndex = 2;
        this.stepperDetails.currentStep = 3;
      } 
      else if (stepNo === 4) {
        this.activeStepIndex = 3;
        this.stepperDetails.currentStep = 4;
      } 
      else if (stepNo === 5) {
        this.activeStepIndex = 4;
        this.stepperDetails.currentStep = 5;
      } 
      else if (stepNo === 6) {
        this.activeStepIndex = 5;
        this.stepperDetails.currentStep = 6;
      } 
      else if (stepNo === 7) {
        this.activeStepIndex = 6;
        this.stepperDetails.currentStep = 7;
      } 
      else if (stepNo === 8) {
        this.activeStepIndex = 7;
        this.stepperDetails.currentStep = 8;
      } 
      else if (stepNo === 9) {
        this.activeStepIndex = 8;
        this.stepperDetails.currentStep = 9;
      } 
      // else if (stepNo === 3 || stepNo === 4 || stepNo === 5 || stepNo === 6) {
      //   this.activeStepIndex = 5;
      //   this.stepperDetails.currentStep = 6;
      // } 

      else {
        if (this.amendmentStatus) {
          this.activeStepIndex = 9;
          this.stepperDetails.currentStep = 10;
        }
      }
    } 
    else {
      if (stepNo === 1) {
        this.activeStepIndex = 0;
        this.stepperDetails.currentStep = 1;
      } 
      else if (stepNo === 2) {
        this.activeStepIndex = 1;
        this.stepperDetails.currentStep = 2;
      } 
      else if (stepNo === 3) {
        this.activeStepIndex = 2;
        this.stepperDetails.currentStep = 3;
      } 
      else if (stepNo === 4) {
        this.activeStepIndex = 3;
        this.stepperDetails.currentStep = 4;
      } 
      else if (stepNo === 5) {
        this.activeStepIndex = 4;
        this.stepperDetails.currentStep = 5;
      } 
      else if (stepNo === 6) {
        this.activeStepIndex = 5;
        this.stepperDetails.currentStep = 6;
      } 
      else if (stepNo === 7) {
        this.activeStepIndex = 6;
        this.stepperDetails.currentStep = 7;
      } 
      else if (stepNo === 8) {
        this.activeStepIndex = 7;
        this.stepperDetails.currentStep = 8;
      } 
      else if (stepNo === 9) {
        this.activeStepIndex = 8;
        this.stepperDetails.currentStep = 9;
      } 
    }
  }

  beforeSubmit() {
    this.formData = {
      ...this.letterOfCredit,
      amendment: [this.letterOfCreditAmend],
    };

    return true;
  }

  beforeSaveDraft() {
    this.formData = {
      ...this.letterOfCredit,
      amendment: [this.letterOfCreditAmend],
    };

    return true;
  }

  beforeSaveTemplate() {
    this.formData = {
      ...this.letterOfCredit,
      amendment: [this.letterOfCreditAmend],
    };

    return true;
  }

  afterSubmit() {
    this.showSubmit = true;
    return false;
  }

  changeAmendmentStatus() {
    if (
      this.letterOfCreditAmend.letterOfCreditDetails[0].amount[0].isValidated &&
      this.letterOfCreditAmend.shippingDetails[0].periodOfPresentation[0].isValidated
    ) {
      this.amendmentStatus = true;
    } else {
      this.amendmentStatus = false;
    }
  }

  ngOnDestroy() {
    this.actionsService.setShowActionContainer(true);
  }
}
