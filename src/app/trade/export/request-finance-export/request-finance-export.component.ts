import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { RequestFinanceExport } from './@models/request-finance-export.model';

@Component({
  selector: 'app-request-finance-export',
  templateUrl: './request-finance-export.component.html',
  styleUrls: ['./request-finance-export.component.scss'],
})
export class RequestFinanceExportComponent implements OnInit {
  @ViewChild('initiate') initiateComponent: any;
  @ViewChild('review') reviewComponent: any;
  @Input() isViewMode: boolean;

  loading: boolean;
  formData: RequestFinanceExport = new RequestFinanceExport();
  mode: string = '';

  submitMessage: string;

  stepperDetails: Stepper = {
    masterName: 'Request Finance',
    currentStep: 1,
    isOnlyFooter: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['Request Finance', 'Review and Submit'],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Request Finance - Initiate',
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
      { label: 'Export Transactions' },
      { label: 'Request Finance' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW' || this.mode == 'REPAIR') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/exportTransactions/requestFinance/private/view', data)
        .subscribe((formData: RequestFinanceExport) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (
        this.initiateComponent &&
        this.initiateComponent.form &&
        this.initiateComponent.form.invalid
      ) {
        return false;
      }
      return true;
    }
    if (stepNo == 2) {
      return this.formData.acceptTermsAndConditions;
    }
    return true;
  }

  beforeSubmit() {
    this.prepareFormData();
    return true;
  }

  afterSubmit(response: any) {
    console.log(response);
    this.submitMessage = 'Your Finance - Export request Has been submitted successfully.';
    this.formData['id'] = response.dataMap.id;
    return false;
  }

  onSubmitPopupClose() {
    this.submitMessage = '';
    this.goToListing();
  }

  goToListing() {
    this.router.navigate(['./listing'], { relativeTo: this.route });
  }

  private prepareFormData() {
    this.formData.corporateReferenceNo = this.formData.financeDetails[0].corporateReferenceNo;
    this.formData.transactionDate = this.formData.financeDetails[0].transactionDate;
    this.formData.typeOfPackingCredit = this.formData.packingCreditDetails[0].typeOfPackingCredit;
    this.formData.lcNumber = this.formData.packingCreditDetails[0].lcNumber;
    this.formData.buyerName = this.formData.packingCreditDetails[0].buyerName;
    this.formData.applicantName = this.formData.applicantDetails[0].applicantName;
    this.formData.invoiceDate = this.formData.packingCreditDetails[0].invoiceDate;
    this.formData.loanCurrency = this.formData.financeDetails[0].loanCurrency;
    this.formData.loanCurrencyCode = this.formData.financeDetails[0].loanCurrencyCode;
    this.formData.loanAppliedFor = this.formData.financeDetails[0].loanAppliedFor;
    this.formData.loanAmount = this.formData.financeDetails[0].loanAmount;
    this.formData.status = 'Requested for financing';
  }
}
