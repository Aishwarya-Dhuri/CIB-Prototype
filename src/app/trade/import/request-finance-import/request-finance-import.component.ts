import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { RequestFinanceImport } from './@models/request-finance-import.model';

@Component({
  selector: 'app-request-finance-import',
  templateUrl: './request-finance-import.component.html',
  styleUrls: ['./request-finance-import.component.scss'],
})
export class RequestFinanceImportComponent implements OnInit {
  @ViewChild('initiate') initiateComponent: any;
  @ViewChild('review') reviewComponent: any;
  @Input() isViewMode: boolean;

  loading: boolean;
  formData: RequestFinanceImport = new RequestFinanceImport();
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
      { label: 'Import Transactions' },
      { label: 'Request Finance' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW' || this.mode == 'REPAIR') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/importTransactions/requestFinance/private/view', data)
        .subscribe((formData: RequestFinanceImport) => {
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
    this.submitMessage = 'Your Finance - Import request Has been submitted successfully.';
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
    this.formData.purposeCode = this.formData.financeDetails[0].purposeCode;
    this.formData.loanAppliedFor = this.formData.financeDetails[0].loanAppliedFor;
    this.formData.selectedDueDate = this.formData.financeDetails[0].selectedDueDate;
    this.formData.accountToBeCredited = this.formData.financeDetails[0].accountToBeCredited;
    this.formData.accountToBeCreditedCurrency =
      this.formData.financeDetails[0].accountToBeCreditedCurrency;
    this.formData.applicantName = this.formData.applicantDetails[0].applicantName;
    this.formData.loanCurrency = this.formData.financeDetails[0].loanCurrency;
    this.formData.loanCurrencyCode = this.formData.financeDetails[0].loanCurrencyCode;
    this.formData.loanAmount = this.formData.financeDetails[0].loanAmount;
    this.formData.status = 'Requested for financing';
  }
}
