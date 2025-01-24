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
import { BillPresentment } from '../@models/bill-presentment.model';
import { BillPresentmentService } from '../@services/bill-presentment.service';

@Component({
  selector: 'app-bill-presentment-initiation',
  templateUrl: './bill-presentment-initiation.component.html',
  styleUrls: ['./bill-presentment-initiation.component.scss'],
})
export class BillPresentmentInitiationComponent implements OnInit, OnDestroy {
  @ViewChild('initiate') initiateComponent: any;
  @ViewChild('review') reviewComponent: any;

  @Input() isViewMode: boolean;

  loading: boolean;

  formData: BillPresentment = new BillPresentment();

  mode: string = '';

  submitMessage: string = '';

  stepperDetails: Stepper = {
    masterName: 'Bill Presentment',
    stepperType: 'vertical',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: true,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    isHideLastStep: true,
    headings: [
      'Beneficiary / Exporter Details',
      'Trade Bill Details',
      'Payment Details',
      'Shipping Details',
      'Bill Presentment Documents',
      'Collection Instruction',
      'Clauses',
      'Terms And Conditions',
      'Review and Submit',
    ],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private billPresentmentService: BillPresentmentService,
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
    }

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW' || this.mode == 'REPAIR') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/exportTransactions/billPresentment/private/view', data)
        .subscribe((formData: BillPresentment) => {
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
        .httpPost('trade/exportTransactions/billPresentment/private/viewDraft', data)
        .subscribe((formData: BillPresentment) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else if (this.mode == 'TEMPLATE') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/exportTransactions/billPresentment/private/viewTemplate', data)
        .subscribe((formData: BillPresentment) => {
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

  prepareFormData() {
    this.formData.typeOfBillPresentment = this.formData.tradeBillDetails[0].typeOfBillPresentment;
    this.formData.type = this.formData.tradeBillDetails[0].type;
    this.formData.lcNumber = this.formData.tradeBillDetails[0].lcNumber;
    this.formData.lcIssueDate = this.formData.tradeBillDetails[0].lcIssueDate;
    this.formData.buyerName = this.formData.tradeBillDetails[0].buyerName;
    this.formData.billDate = this.formData.tradeBillDetails[0].billDate;
    this.formData.billCurrency = this.formData.tradeBillDetails[0].billCurrency;
    this.formData.billAmount = this.formData.tradeBillDetails[0].billAmount;
    this.formData.status = 'Unauthorized';
    this.formData.clauses[0].documentMappingList = this.clausesService.clausesDataList;
  }

  ngOnDestroy() {
    this.billPresentmentService.activeStepIndex = 0;
    this.billPresentmentService.resetBillPresentment();
  }
}
