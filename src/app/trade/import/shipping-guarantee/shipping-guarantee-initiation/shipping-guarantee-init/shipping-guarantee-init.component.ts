import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ShippingGuaranteeService } from '../../@services/shipping-guarantee.service';
import { ShippingGuaranteeInitiationComponent } from '../shipping-guarantee-initiation.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-shipping-guarantee-init',
  templateUrl: './shipping-guarantee-init.component.html',
  styleUrls: ['./shipping-guarantee-init.component.scss'],
})
export class ShippingGuaranteeInitComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: any;
  @ViewChild('form1') form1: any;
  @ViewChild('form2') form2: any;
  @ViewChild('form3') form3: any;
  @ViewChild('form4') form4: any;
  @ViewChild('form5') form5: any;
  @ViewChild('form6') form6: any;
  @ViewChild('form7') form7: any;
  @ViewChild('form8') form8: any;

  loading: boolean = false;

  @Input('parentRef') parentRef: ShippingGuaranteeInitiationComponent;

  formKeys: string[] = [];

  viewport: string;

  searchBeneficiary = false;

  activeStep: any;
  activeStepIndex: number;

  repair = false;
  showShippingRemarks = false;

  termsAndCondition: any[] = [];
  isTermsAndCondition: boolean = false;

  editMode = false;

  accountBalance: string = '';

  searchLcNumber: boolean = false;
  searchShippingCompanyCode: boolean = false;
  searchConsigneeCode: boolean = false;
  searchNotifyPartyCode: boolean = false;
  isNewShippingCompany: boolean = false;
  isNewConsignee: boolean = false;
  isNewNotifyParty: boolean = false;

  repairFields: any = {
    dateOfShipmentMessage: false,
    dateOfShipment: '20000',
    dateOfShipmentOld: '',

    transactionDateMessage: false,
    transactionDate: '01-Nov-2021',
    transactionDateOld: '',
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private shippingGuaranteeService: ShippingGuaranteeService,
    private viewportService: ViewportService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Shipping Guarantee - Initiate',
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
      { label: 'Shipping Guarantee' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getTermsAndConditionsData();

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
      if (viewport === 'web') {
        this.actionsService.setShowActionContainer(false);
      } else {
        this.actionsService.setShowActionContainer(true);
      }
    });

    this.repair = this.parentRef.mode === 'REPAIR';

    this.activeStepIndex = this.shippingGuaranteeService.activeStepIndex;

    this.loading = false;
  }

  getTermsAndConditionsData() {
    var reqModel = {
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: { type: 'Shipping Guarantee' },
      sortModel: [],
      entityName: 'TERMSANDCONDITION',
    };
    this.httpService
      .httpPost('trade/termsAndCondition/private/getTermsAndConditionList', reqModel)
      .subscribe((response: any) => {
        this.termsAndCondition = response.data;
      });
  }

  changeRepairStep(action: string) {
    if (action == 'next') {
      this.changeStep(this.activeStepIndex < 1 ? 1 : 2);
    } else if (action == 'previous') {
      this.changeStep(this.activeStepIndex > 3 ? 3 : 1);
    }
  }

  onStepsReady() {
    if (this.repair) {
      this.parentRef.stepperDetails.steps = this.parentRef.stepperDetails.steps.map((step: any) => {
        step.stepStatus = 'success';
        return step;
      });

      this.parentRef.stepperDetails.steps[1].stepStatus = 'repair';

      this.parentRef.stepperDetails.steps[3].stepStatus = 'repair';

      this.repairFields.dateOfShipmentOld =
        this.parentRef.formData.shippingDetails[0].dateOfShipment;

      this.repairFields.transactionDateOld =
        this.parentRef.formData.shippingGuaranteeDetails[0].transactionDate;
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
    this.showShippingRemarks = false;

    this.parentRef.onStepClick(stepIndex + 1);

    const form = this.getForm(stepIndex + 1);

    if (this.repair && (this.activeStepIndex == 1 || this.activeStepIndex == 3)) {
      if (this.activeStepIndex == 1) {
        if (
          this.repairFields.transactionDateOld !=
          this.parentRef.formData.shippingGuaranteeDetails[0].transactionDate
        ) {
          this.parentRef.stepperDetails.steps[1].stepStatus = 'success';
        }
      } else {
        if (
          this.repairFields.dateOfShipmentOld !=
          this.parentRef.formData.shippingDetails[0].dateOfShipment
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
          name: 'Applicant Name',
          value: this.parentRef.formData.applicantDetails[0].applicantName,
        },
        {
          name: 'Applicant Email',
          value: this.parentRef.formData.applicantDetails[0].applicantEmail,
        },
      ];
    } else if (stepNo == 2) {
      fields = [
        {
          name: 'Type of Guarantee',
          value: this.parentRef.formData.shippingGuaranteeDetails[0].typeOfGuarantee,
        },
        {
          name: 'Transaction Date',
          value: this.parentRef.formData.shippingGuaranteeDetails[0].transactionDate,
        },
        {
          name: 'Currency',
          value: this.parentRef.formData.shippingGuaranteeDetails[0].currencyCode,
        },
        {
          name: 'Amount',
          value: this.parentRef.formData.shippingGuaranteeDetails[0].amount,
        },
        {
          name: 'SG Expiry Date',
          value: this.parentRef.formData.shippingGuaranteeDetails[0].sgExpiryDate,
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
          name: 'Mode of Shipment',
          value: this.parentRef.formData.shippingDetails[0].modeOfShipment,
        },
        {
          name: 'Date of Shipment',
          value: this.parentRef.formData.shippingDetails[0].dateOfShipment,
        },
      ];
    } else if (stepNo == 5) {
      fields = [
        {
          name: 'Shipping Company Code',
          value: this.parentRef.formData.shippingDocumentDetails[0].shippingCompanyCode,
        },
        {
          name: 'Consignee',
          value: this.parentRef.formData.shippingDocumentDetails[0].consigneeCode,
        },
        {
          name: 'Notify Party',
          value: this.parentRef.formData.shippingDocumentDetails[0].notifyPartyCode,
        },
      ];
    } else if (stepNo == 6) {
      fields = [
        {
          name: 'Bill of Lading',
          value: this.parentRef.formData.supportingDocuments[0].billOfLading,
        },
        {
          name: 'Undertaking',
          value: this.parentRef.formData.supportingDocuments[0].undertaking,
        },
      ];
    } else if (stepNo == 7) {
      fields = [
        {
          name: 'Corporate Name',
          value: this.parentRef.formData.clauses[0].corporateName,
        },
      ];
    } else if (stepNo == 8) {
      fields = [];
    }
    return fields;
  }

  getCurrentDate() {
    return new Date();
  }

  getAccountBalance(account: any): void {
    this.accountBalance = account.enrichments.currencyCode + ' ' + account.enrichments.balance;
  }

  addBeneficiaryAddress(): void {
    if (!this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress2[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress2[0].show = true;
    } else if (!this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress3[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress3[0].show = true;
    }
  }

  deleteBeneficiaryAddress(addressLine: number): void {
    if (addressLine == 2) {
      if (this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress3[0].show) {
        this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress3[0].show = false;

        this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress2[0].address =
          this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress3[0].address;

        this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress3[0].address = '';
      } else {
        this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress2[0].show = false;
        this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress2[0].address = '';
      }
    } else if (addressLine == 3) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress3[0].show = false;
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryAddress3[0].address = '';
    }
  }

  addBeneficiaryBankAddress(): void {
    if (!this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress2[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress2[0].show = true;
    } else if (!this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress3[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress3[0].show = true;
    }
  }

  deleteBeneficiaryBankAddress(addressLine: number): void {
    if (addressLine == 2) {
      if (this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress3[0].show) {
        this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress3[0].show = false;

        this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress2[0].address =
          this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress3[0].address;

        this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress3[0].address = '';
      } else {
        this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress2[0].show = false;
        this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress2[0].address = '';
      }
    } else if (addressLine == 3) {
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress3[0].show = false;
      this.parentRef.formData.beneficiaryDetails[0].beneficiaryBankAddress3[0].address = '';
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

  onLCSelection(lcDetails: any): void {
    this.parentRef.formData.shippingGuaranteeDetails[0].lcNumber = lcDetails.id;

    this.parentRef.formData.shippingGuaranteeDetails[0].descriptionOfGoods =
      lcDetails.enrichments.shippingDetails[0].descriptionOfGoodsServices;
  }

  onShippingCompanySelection(shippingCompanyDetails: any): void {
    this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyCode =
      shippingCompanyDetails.shippingCompanyCode;
    this.parentRef.formData.shippingDocumentDetails[0].shippingCompanyCode =
      shippingCompanyDetails.shippingCompanyCode;
    this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyName =
      shippingCompanyDetails.shippingCompanyName;
    this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress1[0].address =
      shippingCompanyDetails.shippingCompanyAddress1[0].address;
    this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress2[0].address =
      shippingCompanyDetails.shippingCompanyAddress2[0].address;
    this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress3[0].address =
      shippingCompanyDetails.shippingCompanyAddress3[0].address;
  }

  onConsigneeSelection(consigneeDetails: any): void {
    this.parentRef.formData.shippingDocumentDetails[0].consigneeCode =
      consigneeDetails.consigneeCode;
    this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeCode =
      consigneeDetails.consigneeCode;
    this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeName =
      consigneeDetails.consigneeName;
    this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress1[0].address =
      consigneeDetails.consigneeAddress1[0].address;
    this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress2[0].address =
      consigneeDetails.consigneeAddress2[0].address;
    this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress3[0].address =
      consigneeDetails.consigneeAddress3[0].address;
  }

  onNotifyPartySelection(notifyPartyDetails: any): void {
    this.parentRef.formData.shippingDocumentDetails[0].notifyPartyCode =
      notifyPartyDetails.notifyPartyCode;
    this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyCode =
      notifyPartyDetails.notifyPartyCode;
    this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyName =
      notifyPartyDetails.notifyPartyName;
    this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress1[0].address =
      notifyPartyDetails.notifyPartyAddress1[0].address;
    this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress2[0].address =
      notifyPartyDetails.notifyPartyAddress2[0].address;
    this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress3[0].address =
      notifyPartyDetails.notifyPartyAddress3[0].address;
  }

  onShippingCompanySubmit(): void {}

  onConsigneeSubmit(): void {}

  onNotifyPartySubmit(): void {}

  onChangeBillOfLading() {
    if (!this.parentRef.formData.supportingDocuments[0].billOfLading) {
      this.parentRef.formData.supportingDocuments[0].billOfLadingRefNo = '';
      this.parentRef.formData.supportingDocuments[0].billOfLadingDocument = [];
    }
  }

  onChangeUndertaking() {
    if (!this.parentRef.formData.supportingDocuments[0].billOfLading) {
      this.parentRef.formData.supportingDocuments[0].undertakingRefNo = '';
      this.parentRef.formData.supportingDocuments[0].undertakingDocument = [];
    }
  }

  private getForm(stepNo: number) {
    // return this.form;
    return this['form' + stepNo];
  }

  ngOnDestroy(): void {
    this.shippingGuaranteeService.activeStepIndex = this.activeStepIndex;
    this.shippingGuaranteeService.shippingGuarantee = this.parentRef.formData;
    this.actionsService.setShowActionContainer(true);
  }
}
