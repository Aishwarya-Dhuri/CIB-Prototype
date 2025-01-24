import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { Select } from 'src/app/shared/@models/select.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { OutwardTelegraphicTransferService } from '../../@services/outward-telegraphic-transfer.service';
import { OutwardTelegraphicTransferInitiationComponent } from '../outward-telegraphic-transfer-initiation.component';
import { UserService } from 'src/app/shared/@services/user.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { cloneDeep, filter } from 'lodash';
import { PaymentDetailsCurrencyAndAmount } from '../../@models/outward-telegraphic-center.model';

@Component({
  selector: 'app-outward-telegraphic-transfer-init',
  templateUrl: './outward-telegraphic-transfer-init.component.html',
  styleUrls: ['./outward-telegraphic-transfer-init.component.scss']
})
export class OutwardTelegraphicTransferInitComponent implements OnInit {
  @Input('parentRef') parentRef: OutwardTelegraphicTransferInitiationComponent;
  @ViewChild('paymentDetailsGrid') paymentDetailsGrid!: AgGridListingComponent;
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
  editIndex: number = -1;
  transactionInitGridAPI: any;
  formKeys: string[] = [];
  viewport: string;
  searchBeneficiary = false;
  activeStep: any;
  activeStepIndex: number;
  deliveryTermList: any[];
  debitAccountNoList: any[];
  paymentTermsList: any[];
  CurrencyList: any[];
  selectedAccessTypeName: string;
  selectedDebitAccountNoName: string;
  selectedPaymentTerms: string;
  selectedPaymentTermsName: string;
  selectedCurrency: string;
  selectedCurrencyName: string;
  suppDocuments: any[]
  currencyName: string;
  debitAmountPayableCurrency: string;
  debitAmountPayableCurrencyName: string;
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

    latestDateOfShippingMessage: false,
    latestDateOfShipping: '01-Nov-2021',
    latestDateOfShippingOld: '',
  };



  paymentDetailsGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private OutwardTelegraphicTransferService: OutwardTelegraphicTransferService,
    private viewportService: ViewportService,
    private currencyService: CurrencyService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.loading = true;
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
      { label: 'Outward Telegraphic Transfer' },
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

    this.activeStepIndex = this.OutwardTelegraphicTransferService.activeStepIndex;

    this.loading = false;

    this.deliveryTermList = [
      {
        "id": "STANDARD",
        "displayName": "Standard"
      },
      {
        "id": "NOTAPPLICABLE",
        "displayName": "Not Applicable"
      },
      {
        "id": "COSTANDFREIGHT",
        "displayName": "Cost and Freight (CFR)"
      },
      {
        "id": "COSTINSURANCEFREIGHT",
        "displayName": "Cost, Insurance and Freight (CIF)"
      },
      {
        "id": "CARRIAGEPAIDTO",
        "displayName": "Carriage Paid To (CPT)"
      },
      {
        "id": "CARRIAGEANDINSURANCEPAIDTO",
        "displayName": "Carriage and Insurance Paid To (CIP)"
      },
      {
        "id": "DELIVERYATPLACE",
        "displayName": "Delivered At Place (DAP)"
      },
      {
        "id": "DELIVERYTERMINAL",
        "displayName": "Delivered At Terminal (DAT)"
      },
      {
        "id": "DELIVEREDDUTYPAID",
        "displayName": "Delivered Duty Paid (DDP)"
      },
      {
        "id": "EXWORKS",
        "displayName": "Ex Works(EXW)"
      },
      {
        "id": "FREEALONGSIDE",
        "displayName": "Free Alongside Ship(FAS)"
      },
      {
        "id": "FREECARRIERSIDE",
        "displayName": "Free Carrier (FCA)"
      },
      {
        "id": "FREEONBOARD",
        "displayName": "Free On Board (FOB)"
      }
    ];

    this.debitAccountNoList = [
      { "id": "777000003002", "displayName": "777000003002" },
      { "id": "773127003004", "displayName": "773127003004" },
      { "id": "777200000013", "displayName": "777200000013" }
    ];

    this.paymentTermsList = [
      { "id": "OPEN_PAYMENT", "displayName": "Open Account" },
      { "id": "ADVANCE_PAYMENT", "displayName": "Advance Payment" },
      { "id": "DIRECT_PAYMENT", "displayName": "Direct Payment" }
    ];

    this.CurrencyList = [
      { "id": "INR", "displayName": "INR" },
      { "id": "USD", "displayName": "USD" }
    ];

    this.currencyService.getCurrency().subscribe((currency: Select) => {
      if (currency) {
        this.parentRef.formData.paymentDetails[0].selectedPayableCurrencyId = currency.id;
        this.parentRef.formData.paymentDetails[0].selectedDebitAmountPayableCurrency = currency.displayName;
      }
    });

    this.getCurrentDate()



  }

  currencyList = [
    { id: "THB", displayName: "THB" },
    { id: "INR", displayName: "INR" },
    { id: "IDR", displayName: "IDR" },
    { id: "SGD", displayName: "SGD" },
    { id: "YEN", displayName: "YEN" },
    { id: "GBP", displayName: "GBP" },
    { id: "USD", displayName: "USD" },
    { id: "AED", displayName: "AED" },
    { id: "SAR", displayName: "SAR" }
  ];


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

      this.repairFields.latestDateOfShippingOld =
        this.parentRef.formData.shippingDetails[0].latestDateOfShipping;
    } else if (this.parentRef.mode == 'EDIT') {
      this.parentRef.stepperDetails.steps = this.parentRef.stepperDetails.steps.map((step: any) => {
        step.stepStatus = 'success';
        return step;
      });
    }

    this.setStep();
  }

  prepareRepairSteps() { }

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
          this.repairFields.latestDateOfShippingOld !=
          this.parentRef.formData.shippingDetails[0].latestDateOfShipping
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
    for (let i = 0; i < 9; i++) {
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
      // this.setStepCompleted(this.activeStepIndex);
    });
  }

  validateForm(stepNo: number) {
    const form = this.getForm(stepNo);
    return form;
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
          value: this.parentRef.formData.billDetails[0].proformaInvoiceNo,
        },
        { name: 'Expiry Date', value: this.parentRef.formData.letterOfCreditDetails[0].expiryDate },
        {
          name: 'Amount',
          value: this.parentRef.formData.paymentDetails[0].debitAmtInPayableCcy,
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
          value: this.parentRef.formData.shippingDetails[0].latestDateOfShipping,
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

  addIntermediaryBankAddress() {
    if (!this.parentRef.formData.beneficiaryDetails[0].intermediaryBankAddress2[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].intermediaryBankAddress2[0].show = true;
    } else if (!this.parentRef.formData.beneficiaryDetails[0].intermediaryBankAddress3[0].show) {
      this.parentRef.formData.beneficiaryDetails[0].intermediaryBankAddress3[0].show = true;
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

  resetBeneficiaryDetails(frequencyOfExecution: any) {
    this.parentRef.formData.beneficiaryDetails[0] = {
      frequencyOfExecution: frequencyOfExecution,
      beneficiaryCode: '',
      beneficiaryName: '',
      HSCode: '',
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
      intermediarySwiftCode: '',
      intermediaryBankName: '',
      intermediaryBankAddress1: [{ show: true, address: '' }],
      intermediaryBankAddress2: [{ show: false, address: '' }],
      intermediaryBankAddress3: [{ show: false, address: '' }],
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
      intermediarySwiftCode: beneficiary.beneficiaryBank,
      intermediaryBankName: beneficiary.beneficiaryBank,
      intermediaryBankAddress1: [{ show: true, address: beneficiary.beneficiaryBankAddress }],
      intermediaryBankAddress2: [{ show: false, address: '' }],
      intermediaryBankAddress3: [{ show: false, address: '' }],
      HSCode: ''
    };
    this.searchBeneficiary = false;
  }

  private getForm(stepNo: number) {
    // return this.form;
    return this['form' + stepNo];
  }

  ngOnDestroy() {
    this.OutwardTelegraphicTransferService.activeStepIndex = this.activeStepIndex;
    this.OutwardTelegraphicTransferService.letterOfCredit = this.parentRef.formData;
    this.actionsService.setShowActionContainer(true);
  }

  onFileDropoverAndLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileDropped(event: any) {
    event.preventDefault();
    event.stopPropagation();
    let files = event.dataTransfer.files;
    if (files.length > 0) {
      this.prepareFilesList(files);
    }
  }
  prepareFilesList(files: any) {
    throw new Error('Method not implemented.');
  }

  getCurrentDate() {
    return this.userService.applicationDate;
  };



  //Add Update Functionality

  gridActions(transaction: PaymentDetailsCurrencyAndAmount): PaymentDetailsCurrencyAndAmount {
    const editAction = {
      index: 2,
      displayName: 'Edit',
      type: 'ICON',
      icon: 'fa-pencil',
      methodName: 'onEdit',
      paramList: 'id',
    };
    const deleteAction = {
      index: 3,
      color: 'warn',
      displayName: 'Delete',
      type: 'ICON',
      icon: 'fa-trash-alt',
      methodName: 'onDelete',
      paramList: 'id',
    };
    transaction.initActions = [editAction, deleteAction];
    return transaction;
  }

  onPaymentDetailsGridReady(api: any): void {
    this.transactionInitGridAPI = api;
    this.transactionInitGridAPI.setRowData(this.parentRef.formData.transaction);
  };

  onAddCurrencyAndAmount(): void {
    this.parentRef.PaymentDetailsCurrencyAndAmountFormData = this.gridActions(this.parentRef.PaymentDetailsCurrencyAndAmountFormData)
    this.parentRef.formData.transaction.push({ ...this.parentRef.PaymentDetailsCurrencyAndAmountFormData });
    this.paymentDetailsGrid.setRowData(this.parentRef.formData.transaction);
    this.parentRef.PaymentDetailsCurrencyAndAmountFormData = new PaymentDetailsCurrencyAndAmount();
  };

  onUpdateCurrencyAndAmount() {
    if (this.editIndex > -1) {
      this.parentRef.formData.transaction[this.editIndex] = {
        ...this.parentRef.formData.transaction[this.editIndex],
        ...cloneDeep(this.parentRef.PaymentDetailsCurrencyAndAmountFormData),
      };
      if (this.paymentDetailsGrid) {
        this.paymentDetailsGrid.setRowData(this.parentRef.formData.transaction);
      }
      this.parentRef.PaymentDetailsCurrencyAndAmountFormData = new PaymentDetailsCurrencyAndAmount();
      this.editIndex = -1;
    }
  };

  onEdit(value: any): void {
    const index: number = this.parentRef.formData.transaction.findIndex((transaction: PaymentDetailsCurrencyAndAmount) => transaction.id == value);
    if (index > -1) {
      const formData = cloneDeep(this.parentRef.formData.transaction[index]);
      delete formData.id
      this.parentRef.PaymentDetailsCurrencyAndAmountFormData = formData;
      this.editIndex = index;
    }
  };

  onDelete(value: any): void {
    const index: number = this.parentRef.formData.transaction.findIndex((transaction: PaymentDetailsCurrencyAndAmount) => transaction.id == value);
    if (index >= 0) {
      this.parentRef.formData.transaction.splice(index, 1);
      this.transactionInitGridAPI.setRowData(this.parentRef.formData.transaction);
    }
  };



}
