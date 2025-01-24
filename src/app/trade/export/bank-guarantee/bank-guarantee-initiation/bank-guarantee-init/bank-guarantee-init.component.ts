import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { BankGuaranteeService } from '../../@services/bank-guarantee.service';
import { BankGuaranteeInitiationComponent } from '../bank-guarantee-initiation.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-bank-guarantee-init',
  templateUrl: './bank-guarantee-init.component.html',
  styleUrls: ['./bank-guarantee-init.component.scss'],
})
export class BankGuaranteeInitComponent implements OnInit {
  @ViewChild('form') form: any;
  @ViewChild('form1') form1: any;
  @ViewChild('form2') form2: any;
  @ViewChild('form3') form3: any;
  @ViewChild('form4') form4: any;
  @ViewChild('form5') form5: any;
  @ViewChild('form6') form6: any;

  loading: boolean;

  @Input('parentRef') parentRef: BankGuaranteeInitiationComponent;

  formKeys: string[] = [];

  viewport: string;

  searchBeneficiary = false;

  activeStep: any;
  activeStepIndex: number;

  repair = false;
  showBankRemarks = false;
  isTermsAndCondition: boolean = false;
  termsAndCondition: any[] = [];

  editMode = false;

  repairFields = {
    amountForTransactionMessage: false,
    amountForTransactionCharges: '20000',
    amountForTransactionChargesOld: '',

    latestDateOfTransactionMessage: false,
    latestDateOfTransaction: '01-Nov-2021',
    latestDateOfTransactionOld: '',
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private bankGuaranteeService: BankGuaranteeService,
    private viewportService: ViewportService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

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

    this.getTermsAndConditionList();

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
      if (viewport === 'web') {
        this.actionsService.setShowActionContainer(false);
      } else {
        this.actionsService.setShowActionContainer(true);
      }
    });

    this.repair = this.parentRef.mode === 'REPAIR';

    this.activeStepIndex = this.bankGuaranteeService.activeStepIndex;

    this.loading = false;
  }

  changeRepairStep(action: string) {
    if (action == 'next') {
      this.changeStep(this.activeStepIndex < 0 ? 0 : 3);
    } else if (action == 'previous') {
      this.changeStep(this.activeStepIndex > 3 ? 3 : 0);
    }
  }

  onStepsReady() {
    if (this.repair) {
      this.parentRef.stepperDetails.steps = this.parentRef.stepperDetails.steps.map((step: any) => {
        step.stepStatus = 'success';
        return step;
      });

      this.parentRef.stepperDetails.steps[0].stepStatus = 'repair';

      this.parentRef.stepperDetails.steps[3].stepStatus = 'repair';

      this.repairFields.amountForTransactionChargesOld =
        this.parentRef.formData.transactionDetails[0].amount;

      this.repairFields.latestDateOfTransactionOld =
        this.parentRef.formData.bankGuaranteeDetails[0].transactionDate;
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
    if (this.activeStepIndex < 5) {
      if (this.form.valid) {
        this.parentRef.stepperDetails.steps[this.activeStepIndex].stepStatus = 'success';
      } else {
        this.parentRef.stepperDetails.steps[this.activeStepIndex].stepStatus = 'error';
      }

      this.activeStepIndex++;

      this.setStep();
    }
  }

  getCurrentDate() {
    return new Date();
  }

  getTermsAndConditionList(): void {
    const reqModel = {
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: { type: 'Bank Guarantee' },
      sortModel: [],
      entityName: 'TERMSANDCONDITION',
    };

    this.httpService
      .httpPost('trade/termsAndCondition/private/getTermsAndConditionList', reqModel)
      .subscribe((response: any) => {
        this.termsAndCondition = response.data;
      });
  }

  changeStep(stepIndex: number) {
    this.showBankRemarks = false;

    this.parentRef.onStepClick(stepIndex + 1);

    const form = this.getForm(stepIndex + 1);

    console.log(form);

    if (this.repair && (this.activeStepIndex == 0 || this.activeStepIndex == 3)) {
      if (this.activeStepIndex == 0) {
        if (
          this.repairFields.amountForTransactionChargesOld !=
          this.parentRef.formData.transactionDetails[0].amount
        ) {
          this.parentRef.stepperDetails.steps[0].stepStatus = 'success';
        }
      } else {
        if (
          this.repairFields.latestDateOfTransactionOld !=
          this.parentRef.formData.bankGuaranteeDetails[0].transactionDate
        ) {
          this.parentRef.stepperDetails.steps[3].stepStatus = 'success';
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
    for (let i = 0; i < 6; i++) {
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
          name: 'Type of Application/Undertaking',
          value: this.parentRef.formData.bankGuaranteeDetails[0].typeOfApplicationOrUndertaking,
        },
        {
          name: 'Transaction Date',
          value: this.parentRef.formData.bankGuaranteeDetails[0].transactionDate,
        },
        {
          name: 'Applicable Rule',
          value: this.parentRef.formData.bankGuaranteeDetails[0].applicableRule,
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
          name: 'Amount',
          value: this.parentRef.formData.transactionDetails[0].amount,
        },
      ];
    } else if (stepNo == 5) {
      fields = [
        {
          name: 'Document Type',
          value: this.parentRef.formData.supportingDocuments[0].bgStandard359,
        },
      ];
    } else if (stepNo == 6) {
      fields = [];
    }
    return fields;
  }

  addBeneficiaryAddress(): void {
    if (!this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress2[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress2[0].show = true;
    } else if (!this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress3[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress3[0].show = true;
    }
  }

  addApplicantAddress() {
    if (!this.parentRef.formData.applicantDetails[0].address2[0].show) {
      this.parentRef.formData.applicantDetails[0].address2[0].show = true;
    } else if (!this.parentRef.formData.applicantDetails[0].address3[0].show) {
      this.parentRef.formData.applicantDetails[0].address3[0].show = true;
    }
  }

  addBeneficiaryBankAddress(): void {
    if (!this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress2[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress2[0].show = true;
    } else if (!this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress3[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress3[0].show = true;
    }
  }

  onBeneSelection(beneficiary: any): void {
    this.parentRef.formData.beneficiaryDetails[0] = {
      frequencyOfExecution: this.parentRef.formData.beneficiaryDetails[0].frequencyOfExecution,
      beneficiaryCode: beneficiary.beneficiaryCode,
      beneficiaryName: 'B123',
      email: 'b123@gmail.con',
      bankSwiftCode: '6589654122',
      beneficiaryAddress1: [{ show: true, address: 'address 1234' }],
      beneficiaryAddress2: [{ show: false, address: '' }],
      beneficiaryAddress3: [{ show: false, address: '' }],
      country: 'IND',
      beneficiaryAccountNumber: '123456787543221',
      beneficiaryBankName: 'ABCD',
      beneficiaryBankAddress1: [{ show: true, address: 'bank address 1234' }],
      beneficiaryBankAddress2: [{ show: false, address: '' }],
      beneficiaryBankAddress3: [{ show: false, address: '' }],
    };
    this.searchBeneficiary = false;
  }

  onApplicantClick(applicant: any): void {
    if (applicant) {
      this.parentRef.formData.applicantDetails[0].applicant = applicant.id;
      this.parentRef.formData.applicantDetails[0].applicantName = applicant.displayName;
      this.parentRef.formData.applicantDetails[0].applicantEmail = 'info.dxb@pepsico.in';
      this.parentRef.formData.applicantDetails[0].applicantMobileNo = '+91 7000000000';
      this.parentRef.formData.applicantDetails[0].applicantAddress = 'India';
    }
  }

  private getForm(stepNo: number) {
    // return this.form;
    return this['form' + stepNo];
  }

  ngOnDestroy(): void {
    this.bankGuaranteeService.activeStepIndex = this.activeStepIndex;
    this.bankGuaranteeService.bankGuarantee = this.parentRef.formData;
    this.actionsService.setShowActionContainer(true);
  }
}
