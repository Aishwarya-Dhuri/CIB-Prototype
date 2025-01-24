import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { BeneficiaryDetails } from '../../@models/letter-of-credit.model';
import { LetterOfCreditService } from '../../@services/letter-of-credit.service';
import { LetterOfCreditInitiationComponent } from '../letter-of-credit-initiation.component';

@Component({
  selector: 'app-letter-of-credit-init',
  templateUrl: './letter-of-credit-init.component.html',
  styleUrls: ['./letter-of-credit-init.component.scss'],
})
export class LetterOfCreditInitComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: any;
  @ViewChild('form1') form1: any;
  @ViewChild('form2') form2: any;
  @ViewChild('form3') form3: any;
  @ViewChild('form4') form4: any;
  @ViewChild('form5') form5: any;
  @ViewChild('form6') form6: any;
  @ViewChild('form7') form7: any;
  @ViewChild('form8') form8: any;

  loading: boolean;

  @Input('parentRef') parentRef: LetterOfCreditInitiationComponent;

  formKeys: string[] = [];

  viewport: string;

  searchBeneficiary = false;

  activeStep: any;
  activeStepIndex: number;

  repair = false;
  showBankRemarks = false;
  isTermsAndCondition: boolean = false;
  termsAndCondition: any[] = [];
  clausesDataList: any[] = [];
  selectedClauseIndex: number = -1;

  repairFields = {
    accountNumberForChargesMessage: false,
    accountNumberForCharges: '1234567891',
    accountNumberForChargesOld: '',

    latestDateOfShipmentMessage: false,
    latestDateOfShipment: '01-Nov-2021',
    latestDateOfShipmentOld: '',
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private letterOfCreditService: LetterOfCreditService,
    private viewportService: ViewportService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

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

    const reqModel = {
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {
        type: {
          filterType: 'text',
          type: 'equals',
          filter: 'Letter of Credit',
        },
      },
      sortModel: [],
      entityName: 'TERMSANDCONDITION',
    };

    this.httpService
      .httpPost('trade/termsAndCondition/private/getTermsAndConditionList', reqModel)
      .subscribe((response: any) => {
        this.termsAndCondition = response.data;
      });

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
      if (viewport === 'web') {
        this.actionsService.setShowActionContainer(false);
      } else {
        this.actionsService.setShowActionContainer(true);
      }
    });

    this.repair = this.parentRef.mode === 'REPAIR';

    this.activeStepIndex = this.letterOfCreditService.activeStepIndex;

    this.loading = false;
  }

  changeRepairStep(action: string) {
    if (action == 'next') {
      this.changeStep(this.activeStepIndex < 3 ? 3 : 4);
    } else if (action == 'previous') {
      this.changeStep(this.activeStepIndex > 4 ? 4 : 3);
    }
  }

  onStepsReady() {
    if (this.repair) {
      this.parentRef.stepperDetails.steps = this.parentRef.stepperDetails.steps.map((step: any) => {
        step.stepStatus = 'success';
        return step;
      });

      this.parentRef.stepperDetails.steps[3].stepStatus = 'repair';

      this.parentRef.stepperDetails.steps[4].stepStatus = 'repair';

      this.repairFields.accountNumberForChargesOld =
        this.parentRef.formData.paymentDetails[0].accountNumberForCharges;

      this.repairFields.latestDateOfShipmentOld =
        this.parentRef.formData.shippingDetails[0].latestDateOfShipment;
    } else if (this.parentRef.mode == 'EDIT') {
      this.parentRef.stepperDetails.steps = this.parentRef.stepperDetails.steps.map((step: any) => {
        step.stepStatus = 'success';
        return step;
      });
    }

    this.setStep();
  }

  prepareRepairSteps() {}

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  previous() {
    if (this.activeStepIndex > 0) {
      if (this.form.valid) {
        this.parentRef.stepperDetails.steps[this.activeStepIndex].stepStatus = 'success';
      } else {
        this.parentRef.stepperDetails.steps[this.activeStepIndex].stepStatus = 'error';
      }

      this.activeStepIndex--;
      this.setStep();
    }
  }

  next() {
    if (this.activeStepIndex < 7) {
      if (this.form.valid) {
        this.parentRef.stepperDetails.steps[this.activeStepIndex].stepStatus = 'success';
      } else {
        this.parentRef.stepperDetails.steps[this.activeStepIndex].stepStatus = 'error';
      }

      this.activeStepIndex++;

      this.setStep();
    }
  }

  changeStep(stepIndex: number) {
    this.showBankRemarks = false;

    this.parentRef.onStepClick(stepIndex + 1);

    const form = this.getForm(stepIndex + 1);

    if (this.repair && (this.activeStepIndex == 3 || this.activeStepIndex == 4)) {
      if (this.activeStepIndex == 3) {
        if (
          this.repairFields.accountNumberForChargesOld !=
          this.parentRef.formData.paymentDetails[0].accountNumberForCharges
        ) {
          this.parentRef.stepperDetails.steps[3].stepStatus = 'success';
        }
      } else {
        if (
          this.repairFields.latestDateOfShipmentOld !=
          this.parentRef.formData.shippingDetails[0].latestDateOfShipment
        ) {
          this.parentRef.stepperDetails.steps[4].stepStatus = 'success';
        }
      }
    } else {
      if (form.valid) {
        this.parentRef.stepperDetails.steps[this.activeStepIndex].stepStatus = 'success';
      } else {
        this.parentRef.stepperDetails.steps[this.activeStepIndex].stepStatus = 'error';
      }
    }

    this.activeStepIndex = stepIndex;

    this.setStep();
  }

  validateBeforeReview(): boolean {
    for (let i = 0; i < 8; i++) {
      const form = this.getForm(i + 1);
      if (!form.valid) {
        return false;
      }
    }

    return true;
  }

  setStep() {
    if (this.parentRef.stepperDetails.steps) {
      this.activeStep = this.parentRef.stepperDetails.steps[this.activeStepIndex];
    }

    setTimeout(() => {
      const form = this.getForm(this.activeStepIndex + 1);
      this.formKeys = Object.keys(form.controls);
      this.setStepCompleted(this.activeStepIndex);
    });
  }

  validateForm(stepNo: number) {
    const form = this.getForm(stepNo);

    return form && form.valid;
  }

  setStepCompleted(stepNo: number): number {
    const form = this.getForm(stepNo);

    let completePercentage = 1;

    if (form) {
      const formKeys = Object.keys(form.controls);

      let validCount = 0;

      this.formKeys.forEach((key: string) => {
        if (form.controls && form.controls[key] && form.controls[key].status === 'VALID') {
          validCount++;
        }
      });

      completePercentage = (validCount * 100) / formKeys.length;

      this.parentRef.stepperDetails.steps[
        this.parentRef.stepperDetails.currentStep - 1
      ].completePercentage = completePercentage > 100 ? 100 : Math.ceil(completePercentage);

      if (completePercentage >= 100) {
        this.parentRef.stepperDetails.steps[
          this.parentRef.stepperDetails.currentStep - 1
        ].stepStatus = 'success';
      } else {
        this.parentRef.stepperDetails.steps[
          this.parentRef.stepperDetails.currentStep - 1
        ].stepStatus = 'progress';
      }
    }

    return completePercentage;
  }

  getStepFields(stepNo: number) {
    let fields = [];
    if (stepNo == 1) {
      fields = [
        {
          name: 'Proforma Invoice',
          value: this.parentRef.formData.letterOfCreditDetails[0].proformaInvoiceNo,
        },
        { name: 'Expiry Date', value: this.parentRef.formData.letterOfCreditDetails[0].expiryDate },
        {
          name: 'Amount',
          value: this.parentRef.formData.letterOfCreditDetails[0].amount,
          currency: this.parentRef.formData.letterOfCreditDetails[0].currency,
        },
      ];
    } else if (stepNo == 2) {
      fields = [
        {
          name: 'Applicant Name',
          value: this.parentRef.formData.applicantDetails[0].applicantName,
        },
        {
          name: 'Applicant Email',
          value: this.parentRef.formData.applicantDetails[0].applicantEmail,
        },
      ];
    } else if (stepNo == 3) {
      fields = [
        {
          name: 'Beneficiary Name',
          value: this.parentRef.formData.beneficiaryDetails[0].beneficiaryName,
        },
      ];
    } else if (stepNo == 4) {
      fields = [
        {
          name: 'Credit Available By',
          value: this.parentRef.formData.paymentDetails[0].creditAvailableBy,
        },
      ];
    } else if (stepNo == 5) {
      fields = [
        {
          name: 'Date Of Shipping',
          value: this.parentRef.formData.shippingDetails[0].latestDateOfShipment,
        },
      ];
    } else if (stepNo == 6) {
      fields = [
        {
          name: 'Document Type',
          value: this.parentRef.formData.supportingDocuments[0].lcIrrevocable,
        },
      ];
    }
    return fields;
  }

  addApplicantDetailsAddress() {
    if (!this.parentRef.formData.applicantDetails[0].address2[0].show) {
      this.parentRef.formData.applicantDetails[0].address2[0].show = true;
    } else if (!this.parentRef.formData.applicantDetails[0].address3[0].show) {
      this.parentRef.formData.applicantDetails[0].address3[0].show = true;
    }
  }

  addBeneficiaryAddress() {
    if (!this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress2[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress2[0].show = true;
    } else if (!this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress3[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress3[0].show = true;
    }
  }

  addBeneficiaryBankAddress() {
    if (!this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress2[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress2[0].show = true;
    } else if (!this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress3[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress3[0].show = true;
    }
  }

  addPaymentBankAddress() {
    if (!this.parentRef.formData.paymentDetails[0].bankAddress2[0].show) {
      this.parentRef.formData.paymentDetails[0].bankAddress2[0].show = true;
    } else if (!this.parentRef.formData.paymentDetails[0].bankAddress3[0].show) {
      this.parentRef.formData.paymentDetails[0].bankAddress3[0].show = true;
    }
  }

  onCheckedSupportingDocument(checkboxEvent: any, documentType: string) {
    if (!checkboxEvent.checked) {
      this.parentRef.formData.supportingDocuments[0][documentType + 'RefNo'] = '';
      this.parentRef.formData.supportingDocuments[0][documentType + 'Document'] = [];
    }
  }

  getCurrentDate() {
    return new Date();
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

  private getForm(stepNo: number) {
    // return this.form;
    return this['form' + stepNo];
  }

  ngOnDestroy() {
    this.letterOfCreditService.activeStepIndex = this.activeStepIndex;
    this.letterOfCreditService.letterOfCredit = this.parentRef.formData;
    this.actionsService.setShowActionContainer(true);
  }
}
