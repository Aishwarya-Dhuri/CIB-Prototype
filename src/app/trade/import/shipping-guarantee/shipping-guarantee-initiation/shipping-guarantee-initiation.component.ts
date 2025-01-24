import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ShippingGuarantee } from '../@models/shipping-guarantee.model';
import { ShippingGuaranteeService } from '../@services/shipping-guarantee.service';

@Component({
  selector: 'app-shipping-guarantee-initiation',
  templateUrl: './shipping-guarantee-initiation.component.html',
  styleUrls: ['./shipping-guarantee-initiation.component.scss'],
})
export class ShippingGuaranteeInitiationComponent implements OnInit {
  @ViewChild('initiate') initiateComponent: any;
  @ViewChild('review') reviewComponent: any;

  @Input() isViewMode: boolean = false;

  loading: boolean;

  formData: ShippingGuarantee = new ShippingGuarantee();

  mode: string = '';

  submitMessage: string = '';

  stepperDetails: Stepper = {
    masterName: 'Shipping Guarantee',
    stepperType: 'vertical',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: true,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    isHideLastStep: true,
    headings: [
      'Applicant Details',
      'Shipping Guarantee Details',
      'Beneficiary Details',
      'Shipping Details',
      'Shipping Document Details',
      'Supporting Documents',
      'Clauses',
      'Terms And Conditions',
      'Review and Submit',
    ],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private shippingGuaranteeService: ShippingGuaranteeService,
    private viewService: ViewService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
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

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW' || this.mode == 'REPAIR') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/importTransactions/shippingGuarantee/private/view', data)
        .subscribe((formData: ShippingGuarantee) => {
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
        .httpPost('trade/importTransactions/shippingGuarantee/private/viewDraft', data)
        .subscribe((formData: ShippingGuarantee) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else if (this.mode == 'TEMPLATE') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/importTransactions/shippingGuarantee/private/viewTemplate', data)
        .subscribe((formData: ShippingGuarantee) => {
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
    if (stepNo < 9) {
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

  beforeSubmit(): boolean {
    this.httpService
      .httpPost(
        'trade/masters/shippingCompany/private/create',
        this.formData.shippingDocumentDetails[0].shippingCompany[0],
      )
      .subscribe((res) => {
        res;
      });
    this.httpService
      .httpPost(
        'trade/masters/consignee/private/create',
        this.formData.shippingDocumentDetails[0].consignee[0],
      )
      .subscribe((res) => {
        res;
      });
    this.httpService
      .httpPost(
        'trade/masters/notifyParty/private/create',
        this.formData.shippingDocumentDetails[0].notifyParty[0],
      )
      .subscribe((res) => {
        res;
      });

    this.prepareFormData();
    this.formData.status = 'Pending Authorization';
    return true;
  }

  afterSubmit(response: any) {
    this.submitMessage = 'The Shipping Guarantee Request has been successfully Submitted.';
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
    this.formData.typeOfShippingGuarantee =
      this.formData.shippingGuaranteeDetails[0].typeOfGuarantee;
    this.formData.shippingGuaranteeAmount = this.formData.shippingGuaranteeDetails[0].amount;
    this.formData.transactionDate = this.formData.shippingGuaranteeDetails[0].transactionDate;
    this.formData.applicantName = this.formData.applicantDetails[0].applicantName;
    this.formData.beneficiaryName = this.formData.beneficiaryDetails[0].beneficiaryName;
    this.formData.currency = this.formData.shippingGuaranteeDetails[0].currency;
    this.formData.amount = this.formData.shippingGuaranteeDetails[0].amount;
    this.formData.lcNumber = this.formData.shippingGuaranteeDetails[0].lcNumber;
    this.formData.sgExpiryDate = this.formData.shippingGuaranteeDetails[0].sgExpiryDate;
    this.formData.sgClaimExpiryDate = this.formData.shippingGuaranteeDetails[0].sgClaimExpiryDate;
  }

  ngOnDestroy() {
    this.shippingGuaranteeService.activeStepIndex = 0;
    this.shippingGuaranteeService.resetShippingGuarantee();
  }
}
