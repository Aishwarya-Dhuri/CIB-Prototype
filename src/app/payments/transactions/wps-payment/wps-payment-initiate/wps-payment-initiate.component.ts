import { Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { EDR, WpsPaymentManual, WpsPaymentUpload } from '../@model/wps-payment.model';
import { WpsPaymentService } from '../@services/wps-payment.service';
import { UserService } from 'src/app/shared/@services/user.service';
import * as moment from 'moment';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';

@Component({
  selector: 'app-wps-payment-initiate',
  templateUrl: './wps-payment-initiate.component.html',
  styleUrls: ['./wps-payment-initiate.component.scss'],
})
export class WpsPaymentInitiateComponent implements OnInit, OnDestroy {
  @ViewChild('edrDataListingGrid') edrDataListingGrid: AgGridListingComponent;
  @Input('isViewMode') isViewMode: boolean = false;

  loading: boolean = true;
  agreeTermsAndConditions: boolean = false;

  listingType: string = 'card';

  showSuccessfulModal: boolean = false;
  isShowSdrBicCodeModal: boolean = false;
  isShowEdrBicCodeModal: boolean = false;
  isShowEmployeeIdModal: boolean = false;

  minDateValue: string = null;
  maxDateValue: string = null;

  formData: any;

  isGroupUser: boolean = false;

  editEdrIndex: number = -1;

  edrForm: EDR;

  isLayoutData = false;

  successData: any;

  mode: string;

  debitAccountDropdownReqData = { molId: '' };

  stepperDetails: Stepper = {
    masterName: 'WPS Payment',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: true,
    // isSaveAsTemplateApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  treeData: any[] = [
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'WPS Payment Upload',
          subHeader: '12 Aug 2021, 13:35',
          data: [],
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'File Parsed Successfully',
          subHeader: '12 Aug 2021, 13:35',
          data: ['Total Records: 10000', 'Parsed: 7500', 'Failed: 2500'],
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Validation in Process',
          subHeader: '12 Aug 2021, 13:35',
          data: [],
          active: false,
          partiallyActive: true,
          disabled: false,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Sent for Approval',
          subHeader: '',
          data: [],
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Authorized',
          subHeader: '',
          data: [],
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: true,
          header: 'Send to Bank',
          subHeader: '',
          data: [],
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
  ];

  edrDataColDefsUrl: string = 'payments/transactions/wpsPayment/private/edrDataColDefs';

  constructor(
    private breadcrumbService: BreadcrumbService,
    private wpsPaymentService: WpsPaymentService,
    private actionsService: ActionService,
    private currencyService: CurrencyService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private listingService: ListingService,
    private viewService: ViewService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    if (!this.isViewMode) {
      const actions: Actions = {
        heading: 'WPS Payment',
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
        { label: 'Payments' },
        { label: 'Transactions' },
        { label: 'WPS Payment' },
        { label: 'Initiate' },
      ];
      this.breadcrumbService.setBreadCrumb(breadcrumbs);
    }

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    const initiateType = this.wpsPaymentService.initiateType;

    const applicationDate: string = this.userService.userDetails.applicationDate;

    if (initiateType == 'upload') {
      this.stepperDetails.isSaveDraftApplicable = false;
      this.stepperDetails.isSecondLastStepLabelAsReview = false;
      this.stepperDetails.headings = [''];

      this.formData = new WpsPaymentUpload();
      this.formData.valueDate = applicationDate;
    } else {
      this.formData = new WpsPaymentManual();
      this.formData.valueDate = applicationDate;

      this.formData.entryDateAndTime =
        applicationDate +
        ' ' +
        moment(this.userService.userDetails.currentServerTimeA, ['h:mm A']).format('HH:mm');

      this.formData.salaryMonth = applicationDate.substring(3, applicationDate.length);

      const date = new Date('15-' + this.formData.salaryMonth);
      this.minDateValue = moment(
        new Date(date.getFullYear(), date.getMonth(), 1).toDateString(),
      ).format('DD-MMM-yyyy');
      this.maxDateValue = moment(
        new Date(date.getFullYear(), date.getMonth() + 1, 0).toDateString(),
      ).format('DD-MMM-yyyy');

      this.setPayableCurrencyAndSalaryAmount();

      this.resetEDRForm();
    }

    this.formData.initiateType = this.wpsPaymentService.initiateType;

    this.stepperDetails.isSaveDraftApplicable = this.formData.initiateType == 'manual';

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'VIEW') {
      this.stepperDetails.currentStep = this.stepperDetails.headings.length;
    }

    if (this.mode == 'EDIT' || this.mode == 'RESUBMIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('payments/transactions/wpsPayment/private/view', data)
        .subscribe((formData: PaymentRequest) => {
          this.viewService.clearAll();

          this.formData = formData;

          this.resetEDRForm();

          this.loading = false;
        });
    } else if (this.mode == 'DRAFT') {
      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('payments/transactions/wpsPayment/private/viewDraft', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();

          this.formData = formData;
          this.resetEDRForm();

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onFileUpload(file: any) {
    this.formData.wpsFile = file;
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.formData.initiateType == 'upload') {
        return (
          this.agreeTermsAndConditions &&
          this.formData.molId &&
          this.formData.debitFromAccount &&
          this.formData.wpsFile.length > 0
        );
      } else {
        return (
          this.formData['edrList'].length > 0 &&
          this.formData.molId &&
          this.formData.routingCodeAgentId &&
          this.formData.debitFromAccount
        );
      }
    }
    return true;
  }

  beforeSubmit() {
    if (this.formData.initiateType == 'upload') {
      const formData = new FormData();
      formData.append('valueDate', this.formData.valueDate);
      formData.append('molId', this.formData.molId);
      formData.append('debitFromAccount', this.formData.debitFromAccount);
      formData.append('debitFromAccountTitle', this.formData.debitFromAccountTitle);
      formData.append('accountBalance', this.formData.accountBalance);
      formData.append('dataLayout', this.formData.dataLayout);
      formData.append('initiateType', this.formData.initiateType);
      formData.append('wpsFile', this.formData.wpsFile[0], this.formData.wpsFile[0].name);

      this.formData = formData;
    }
    return true;
  }

  afterSubmit(response: any) {
    this.successData = response.dataMap.data;
    this.successData.date = this.successData
      ? this.successData.modifiedSysOn.substring(0, 11)
      : this.maxDateValue;
    this.successData.time = this.successData
      ? this.successData.modifiedSysOn.substring(12, 20)
      : '13:24';
    this.showSuccessfulModal = true;
    return false;
  }

  onCLoseSuccessfulModal() {
    this.showSuccessfulModal = false;

    this.router.navigate(['../', 'listing'], { relativeTo: this.route });
  }

  onStepChange(stepNo: number) {
    // implement on step change method here
  }

  addEdr() {
    this.formData['edrList'].push(this.edrForm);
    this.resetEDRForm();
    this.formData.edrCount = this.formData['edrList'].length;
    this.setPayableCurrencyAndSalaryAmount();
  }

  onBackClick() {
    let url = 'payments/transactions/wpsPayment';

    if (this.mode == 'VIEW') {
      url = 'payments/transactions/wpsPayment/listing#PENDINGLIST';

      if (!this.listingService.getSelectedListCode()) {
        const listTypeCode = url.split('#').length > 1 ? url.split('#')[1] : null;
        this.listingService.setSelectedListCode(listTypeCode);
      }

      url = url.substring(0, url.indexOf('#'));
    }

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
    });
  }

  resetEDRForm() {
    this.edrForm = new EDR();
    this.edrForm.payStartDate = this.minDateValue;
    this.edrForm.payEndDate = this.maxDateValue;
    this.edrForm.noOfDaysInMonth = new Date(this.maxDateValue).getDate().toString();
  }

  setPayableCurrencyAndSalaryAmount() {
    this.setTotalSalaryAmount();
    this.formData.payableCurrencyAndSalaryAmount = this.currencyService.getFormattedCurrencyAmount(
      this.formData.totalAmount,
    );
  }

  onBicCodeSelection(record: any) {
    if (this.isShowEdrBicCodeModal) {
      this.edrForm.routingCodeAgentId = record.bicCode;
    } else {
      this.formData.routingCodeAgentId = record.bicCode;
    }
    this.isShowEdrBicCodeModal = false;
    this.isShowSdrBicCodeModal = false;
  }

  onEmployeeIdSelection(record: any) {
    this.edrForm.employeeId = record.employeeId;
    this.isShowEmployeeIdModal = false;
  }

  validateEdr() {
    const validation =
      this.edrForm.employeeId &&
      this.edrForm.creditAccount &&
      this.edrForm.routingCodeAgentId &&
      this.edrForm.payStartDate &&
      this.edrForm.payEndDate &&
      (this.edrForm.fixedSalary ||
        (this.edrForm.variableSalary &&
          (this.edrForm.housingAllowance ||
            this.edrForm.conveyanceAllowance ||
            this.edrForm.medicalAllowance ||
            this.edrForm.annualPassageAllowance ||
            this.edrForm.overtimeAllowance ||
            this.edrForm.allOtherAllowances ||
            this.edrForm.leaveEncashment)));

    return !validation;
  }

  deleteEdr(index: number) {
    this.formData['edrList'].splice(index, 1);
    this.formData.edrCount = this.formData['edrList'].length;
    this.setPayableCurrencyAndSalaryAmount();
  }

  editEdr(index: number) {
    this.editEdrIndex = index;
    this.edrForm = { ...this.formData['edrList'][this.editEdrIndex] };
    this.stepperDetails.currentStep = 1;
  }

  saveEdr() {
    this.formData['edrList'][this.editEdrIndex] = this.edrForm;
    this.resetEDRForm();
    this.editEdrIndex = -1;
  }

  setTotalSalaryAmount() {
    let totalSalary = 0;

    this.formData['edrList'].forEach((data: EDR) => {
      totalSalary += +data.fixedSalary + +data.variableSalary;
    });

    this.formData.totalAmount = totalSalary.toString();
  }

  ngOnDestroy(): void {
    this.wpsPaymentService.initiateType = '';
  }
}
