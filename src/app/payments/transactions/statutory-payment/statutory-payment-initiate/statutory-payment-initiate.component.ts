import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { StatutoryPaymentService } from '../@services/statutory-payment.service';

@Component({
  selector: 'app-statutory-payment-initiate',
  templateUrl: './statutory-payment-initiate.component.html',
  styleUrls: ['./statutory-payment-initiate.component.scss'],
})
export class StatutoryPaymentInitiateComponent implements OnInit, OnDestroy {
  @ViewChild('statutoryPaymentDetails') statutoryPaymentDetails: any;
  @ViewChild('statutoryPaymentReview') statutoryPaymentReview: any;

  loading: boolean = false;

  formData: any = {};
  mode: string;

  stepperDetails: Stepper = {
    masterName: 'Statutory Payment',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: false,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['Statutory Payment Details', 'Review Details & Confirm'],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private statutoryPaymentService: StatutoryPaymentService,
    private viewService: ViewService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loading = true;

    const actions: Actions = {
      heading: 'Statutory Payment',
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
      { label: 'Statutory Payment' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      if (this.mode == 'VIEW') {
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      }

      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/transactions/statutoryPayment/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();

          const statutoryPaymentDetails = {
            ...formData,
            institutionDetails: formData?.institutionDetails[0],
          };

          if (!statutoryPaymentDetails.isComplexData) {
            statutoryPaymentDetails.taxDetails = { ...formData?.taxDetails[0] };
          }

          this.statutoryPaymentService.statutoryPaymentDetails = statutoryPaymentDetails;

          this.statutoryPaymentService.institution = {
            displayName: statutoryPaymentDetails.institutionType,
            isComplexData: statutoryPaymentDetails.isComplexData,
          };

          this.formData = formData;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  validateForm(stepNo: number) {
    if (stepNo == 1) {
      return (
        this.statutoryPaymentDetails?.statutoryPaymentDetails?.institutionDetails
          ?.institutionType &&
        this.statutoryPaymentDetails?.statutoryPaymentDetails?.institutionDetails?.valueDate &&
        (
          (
            !this.statutoryPaymentDetails?.institution?.isComplexData
            && this.statutoryPaymentDetails?.statutoryPaymentDetails?.institutionDetails?.paymentId)
          ||
          (this.statutoryPaymentDetails?.institution?.isComplexData &&
            this.statutoryPaymentDetails?.statutoryPaymentDetails?.institutionDetails?.searchBy &&
            (
              (
                this.statutoryPaymentDetails?.statutoryPaymentDetails?.institutionDetails?.searchBy === 'Custdec Number'
                && this.statutoryPaymentDetails?.statutoryPaymentDetails?.institutionDetails?.custdecNumber

                || this.statutoryPaymentDetails?.statutoryPaymentDetails?.institutionDetails?.searchBy === 'IE Code'
                && this.statutoryPaymentDetails?.statutoryPaymentDetails?.institutionDetails?.ieCode
              )
              ||
              (
                this.statutoryPaymentDetails?.statutoryPaymentDetails?.institutionDetails
                  ?.searchBy === 'Container Number' &&
                this.statutoryPaymentDetails?.statutoryPaymentDetails?.institutionDetails
                  ?.containerNumber
                ||

                this.statutoryPaymentDetails?.statutoryPaymentDetails?.institutionDetails
                  ?.searchBy === 'IG Reference Number' &&
                this.statutoryPaymentDetails?.statutoryPaymentDetails?.institutionDetails
                  ?.igRefNo
              )
            )
          )
        )
        &&
        ((this.statutoryPaymentDetails?.statutoryPaymentDetails?.paymentDetails ===
          'Debit From Account' &&
          this.statutoryPaymentDetails?.statutoryPaymentDetails?.debitAccount) ||
          (this.statutoryPaymentDetails?.statutoryPaymentDetails?.paymentDetails ===
            'Merchant From Account' &&
            this.statutoryPaymentDetails?.statutoryPaymentDetails?.merchantAccount))
      );
    } else if (stepNo == 2) {
      return this.statutoryPaymentReview?.termsAndConditions;
    }
    return true;
  }

  beforeSubmit() {
    const statutoryPaymentDetails = this.statutoryPaymentService.statutoryPaymentDetails;

    const data = {
      ...statutoryPaymentDetails,
      ...statutoryPaymentDetails.institutionDetails,
      isComplexData: this.statutoryPaymentService.institution.isComplexData,
      institutionDetails: [statutoryPaymentDetails.institutionDetails],
    };

    // delete data.institutionDetails;

    if (!this.statutoryPaymentService.institution.isComplexData) {
      data.taxDetails = [{ ...data.taxDetails }];
    }

    this.formData = data;

    return true;
  }

  onBackClick() {
    this.router.navigate(['/payments/transactions/statutoryPayment/listing'], {
      relativeTo: this.route,
    });
  }

  ngOnDestroy() {
    this.statutoryPaymentService.institution = null;
    this.statutoryPaymentService.statutoryPaymentDetails = null;
  }
}
