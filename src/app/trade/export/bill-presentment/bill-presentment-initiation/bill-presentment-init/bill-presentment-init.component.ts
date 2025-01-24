import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { BillPresentmentService } from '../../@services/bill-presentment.service';
import { BillPresentmentInitiationComponent } from '../bill-presentment-initiation.component';

@Component({
  selector: 'app-bill-presentment-init',
  templateUrl: './bill-presentment-init.component.html',
  styleUrls: ['./bill-presentment-init.component.scss'],
})
export class BillPresentmentInitComponent implements OnInit, OnDestroy {
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

  @Input('parentRef') parentRef: BillPresentmentInitiationComponent;

  formKeys: string[] = [];

  viewport: string;

  activeStep: any;
  activeStepIndex: number;

  isBuyerCode: boolean = false;
  isAddNewBuyer: boolean = false;
  isLcNumber: boolean = false;

  repair = false;
  showBillPresentmentRemarks: boolean = false;
  isTermsAndCondition: boolean = false;
  termsAndCondition: any[] = [];
  clausesDataList: any[] = [];
  selectedClauseIndex: number = -1;

  repairFields = {
    amountForTransactionMessage: false,
    amountForTransactionCharges: '20000',
    amountForTransactionChargesOld: '',

    shippingDateMessage: false,
    shippingDate: '01-Nov-2021',
    shippingDateOld: '',
  };

  collectionInstructionsDataList: Select[] = [];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private billPresentmentService: BillPresentmentService,
    private viewportService: ViewportService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Bill Presentment - Initiate',
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
      { label: 'Bill Presentment' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getDropdownData();

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
      if (viewport === 'web') {
        this.actionsService.setShowActionContainer(false);
      } else {
        this.actionsService.setShowActionContainer(true);
      }
    });

    this.repair = this.parentRef.mode === 'REPAIR';

    this.activeStepIndex = this.billPresentmentService.activeStepIndex;

    this.loading = false;
  }

  getDropdownData(): void {
    this.httpService
      .httpPost(
        'trade/exportTransactions/billPresentment/private/dropdown/collectionInstructionsDataList',
      )
      .subscribe((response: any) => {
        this.collectionInstructionsDataList = response.dataList;
      });

    var reqModel = {
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: { type: 'Bill Presentment' },
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

      this.repairFields.amountForTransactionChargesOld =
        this.parentRef.formData.tradeBillDetails[0].billAmount;

      this.repairFields.shippingDateOld = this.parentRef.formData.shippingDetails[0].shippingDate;
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
    this.showBillPresentmentRemarks = false;

    this.parentRef.onStepClick(stepIndex + 1);

    const form = this.getForm(stepIndex + 1);

    if (this.repair && (this.activeStepIndex == 1 || this.activeStepIndex == 3)) {
      if (this.activeStepIndex == 1) {
        if (
          this.repairFields.amountForTransactionChargesOld !=
          this.parentRef.formData.tradeBillDetails[0].billAmount
        ) {
          this.parentRef.stepperDetails.steps[1].stepStatus = 'success';
        }
      } else {
        if (
          this.repairFields.shippingDateOld !=
          this.parentRef.formData.shippingDetails[0].shippingDate
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
          name: 'Name',
          value: this.parentRef.formData.beneficiaryOrExporterDetails[0].name,
        },
      ];
    } else if (stepNo == 2) {
      fields = [
        {
          name: 'Type of Bill Presentment',
          value: this.parentRef.formData.tradeBillDetails[0].typeOfBillPresentment,
        },
        {
          name: 'Bill Currency',
          value: this.parentRef.formData.tradeBillDetails[0].billCurrency,
        },
        {
          name: 'Bill Amount',
          value: this.parentRef.formData.tradeBillDetails[0].billAmount,
        },
        {
          name: 'LC Number',
          value: this.parentRef.formData.tradeBillDetails[0].lcNumber,
        },
      ];
    } else if (stepNo == 3) {
      fields = [
        {
          name: 'Account to be Credited',
          value: this.parentRef.formData.paymentDetails[0].accountToBeCredited,
        },
        {
          name: 'Due Date Indicator',
          value: this.parentRef.formData.paymentDetails[0].dueDateIndicator,
        },
      ];
    } else if (stepNo == 4) {
      fields = [
        {
          name: 'Shipping Date',
          value: this.parentRef.formData.shippingDetails[0].shippingDate,
        },
      ];
    } else if (stepNo == 5) {
      fields = [
        {
          name: 'Document Type',
          value: this.parentRef.formData.supportingDocuments[0].isSignedBillsOfLading,
        },
      ];
    } else if (stepNo == 6) {
      fields = [
        {
          name: 'Contact Name',
          value: this.parentRef.formData.collectionInstruction[0].contactName,
        },
      ];
    }
    return fields;
  }

  onBeneficiarySelection(beneficiary: any): void {
    this.parentRef.formData.beneficiaryOrExporterDetails[0] = {
      name: beneficiary.displayName,
      email: 'b123@gmail.com',
      address1: 'address 1234',
      address2: 'address 1234',
      address3: 'address 1234',
      mobileNumber: '9876543210',
      ieCode: 'IE12345',
      cifId: 'CF1234',
    };
  }

  getCurrentDate() {
    return new Date();
  }

  changeTypeOfBillPresentment(selectedTypeOfBillPresentment: any): void {
    if (selectedTypeOfBillPresentment.displayName === 'Document against Payment') {
      this.parentRef.formData.tradeBillDetails[0].type = 'Collection';
      this.parentRef.formData.tradeBillDetails[0].typeOfBillPresentment;
    } else {
      this.parentRef.formData.tradeBillDetails[0].type = 'Purchase';
    }
  }

  onBuyerCodeSelection(selectedBuyer: any): void {
    this.parentRef.formData.tradeBillDetails[0].buyerCode = selectedBuyer.buyerCode;
    this.parentRef.formData.tradeBillDetails[0].buyerName = selectedBuyer.buyerName;
    this.parentRef.formData.tradeBillDetails[0].buyerAddress = 'A-22, Vas Road';
    this.parentRef.formData.tradeBillDetails[0].country = 'India';
    this.parentRef.formData.tradeBillDetails[0].pinCode = '00081';
    this.parentRef.formData.tradeBillDetails[0].mobileNumber = '987654321';
    this.parentRef.formData.tradeBillDetails[0].email = 'test@email.com';
    this.parentRef.formData.tradeBillDetails[0].bankSwiftCode = 'BSC001';
    this.parentRef.formData.tradeBillDetails[0].bankName = 'Demo Bank';
    this.parentRef.formData.tradeBillDetails[0].bankAddress = 'Vegas';
    this.parentRef.formData.tradeBillDetails[0].buyerAccountNumber = selectedBuyer.buyerAccountNo;
  }

  onLCNumberSelection(selectedLC: any): void {
    this.parentRef.formData.tradeBillDetails[0].lcNumber = selectedLC.id;
    this.parentRef.formData.tradeBillDetails[0].lcOriginalNumber = 'LC' + selectedLC.id;
    this.parentRef.formData.tradeBillDetails[0].lcIssueDate = selectedLC.effectiveDate;
    this.parentRef.formData.tradeBillDetails[0].buyerName = selectedLC.beneficiaryName;
    this.parentRef.formData.tradeBillDetails[0].lcCurrency = selectedLC.currency;
    this.parentRef.formData.tradeBillDetails[0].lcAmount = selectedLC.amount;
    this.parentRef.formData.tradeBillDetails[0].lcAvailableAmount = selectedLC.amount;
  }

  onChangeAccountToBeDebitForCharges(account: any) {
    this.parentRef.formData.paymentDetails[0].debitAccountBalance =
      account.enrichments.currencyCode + ' ' + account.enrichments.balance;
  }

  onSignedBillsOfLadingCheckboxChange(event: any) {
    if (!event.checked) {
      this.parentRef.formData.supportingDocuments[0].signedBillCopyCount = '';
      this.parentRef.formData.supportingDocuments[0].signedBillOriginalCount = '';
      this.parentRef.formData.supportingDocuments[0].signedBillRefNo = '';
      this.parentRef.formData.supportingDocuments[0].signedBillDocument = [];
    }
  }

  onCertificateOfOriginCheckboxChange(event: any) {
    if (!event.checked) {
      this.parentRef.formData.supportingDocuments[0].certificateOfOriginOriginalCount = '';
      this.parentRef.formData.supportingDocuments[0].certificateOfOriginCopyCount = '';
      this.parentRef.formData.supportingDocuments[0].certificateOfOriginRefNo = '';
      this.parentRef.formData.supportingDocuments[0].certificateOfOriginDocument = [];
    }
  }

  onAirwayBillCheckboxChange(event: any) {
    if (!event.checked) {
      this.parentRef.formData.supportingDocuments[0].airwayBillCopyCount = '';
      this.parentRef.formData.supportingDocuments[0].airwayBillOriginalCount = '';
      this.parentRef.formData.supportingDocuments[0].airwayBillRefNo = '';
      this.parentRef.formData.supportingDocuments[0].airwayBillDocument = [];
    }
  }

  onBeneficiaryCertificateCheckboxChange(event: any) {
    if (!event.checked) {
      this.parentRef.formData.supportingDocuments[0].beneficiaryCertificateCopyCount = '';
      this.parentRef.formData.supportingDocuments[0].beneficiaryCertificateOriginalCount = '';
      this.parentRef.formData.supportingDocuments[0].beneficiaryCertificateRefNo = '';
      this.parentRef.formData.supportingDocuments[0].beneficiaryCertificateDocument = [];
    }
  }

  onBillPresentDAPay26CheckboxChange(event: any) {
    if (!event.checked) {
      this.parentRef.formData.supportingDocuments[0].billPresentDAPay26CopyCount = '';
      this.parentRef.formData.supportingDocuments[0].billPresentDAPay26OriginalCount = '';
      this.parentRef.formData.supportingDocuments[0].billPresentDAPay26RefNo = '';
      this.parentRef.formData.supportingDocuments[0].billPresentDAPay26Document = [];
    }
  }

  private getForm(stepNo: number) {
    // return this.form;
    return this['form' + stepNo];
  }

  ngOnDestroy(): void {
    this.billPresentmentService.activeStepIndex = this.activeStepIndex;
    this.billPresentmentService.billPresentment = this.parentRef.formData;
    this.actionsService.setShowActionContainer(true);
  }
}
