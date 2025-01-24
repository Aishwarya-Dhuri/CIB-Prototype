import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { UserService } from 'src/app/shared/@services/user.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { MandateManagementRegistration } from './@model/mandate-management-registration.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  loading: boolean;
  mode: string;
  loginType: string = '';
  isSuppdoc = false;
  isMandateUpload = false;
  isOtherUpload = false;

  formData: MandateManagementRegistration = new MandateManagementRegistration();

  showCorporateList: boolean = false;
  showProductList: boolean = false;
  showIFSCList: boolean = false;

  corporateCode = '400401'
  corporateName = 'Toyota Automotive Div'

  chequeImageUrl: string = '';
  isChequeImage: boolean = false;

  onChequeSnippetClick(isChequeImage: any): void {
    this.isChequeImage = isChequeImage;
  }

  stepperDetails: Stepper = {
    masterName: 'Mandate Registration',
    currentStep: 1,
    isOnlyFooter: false,
    isSaveAsTemplateApplicable: false,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    lastStepTitle: 'FINISH',
    headings: [
      'Product & Payer Details',
      'Payment Setup',
      'Enrichment Details',
      'Review Details & Confirm',
    ],
  };

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private viewService: ViewService,
  ) { }

  ngOnInit(): void {
    this.loginType = this.userService.loginPreferenceDetails.loginType;
    const actions: Actions = {
      heading: 'Direct Debit Registration - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.chequeImageUrl = this.httpService.getAssetUrl('assets/cheque/demo-cheque.jpg');

    this.actionService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Direct Debit' },
      { label: 'Mandate Management' },
      { label: 'Registration' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      if (this.mode == 'VIEW') {
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      }

      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('directDebit/mandateManagement/registration/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  getSubHeading(stepNo: number) {
    if (stepNo == 1) {
      return `${this.formData.productName} | ${this.formData.payerName} | ${this.formData.payerBank}`;
    } else if (stepNo == 2) {
      return `${this.formData.mandateStartDate} | ${this.formData.amountType}`;
    } else if (stepNo == 3) {
      return `${this.formData.loanNumber} | ${this.formData.loanAccountNumber}`;
    } else {
      return `Step ${stepNo} Details`;
    }
  }

  onSelectProduct(product: any) {
    this.formData.productCode = product.productCode;
    this.formData.enrichmentProductCode = product.productCode;
    this.formData.productName = product.productName;
  }

  onSelectCorporate(corporate: any) {
    this.formData.corporateCode = corporate.corporateCode;
    this.formData.corporateName = corporate.corporateName;
  }

  onSelectIfsc(ifsc: any) {
    this.formData.payerSortCode = ifsc.bicCode;
    this.formData.payerBank = ifsc.bankName;
  }

  onChangeMandateFrequency(event: any) {
    this.formData.mandateDays = '';
  }

  onChangeSIMandateFrequency(event: any) {
    this.formData.paymentMandateDays = '';
  }

  validateForm(stepNo: number) {
    return true;
  }

  validateDraftForm(stepNo: number) {
    return true;
  }

  onStepChange(stepNo: number) {
    return true;
  }

  beforeSubmit() {
    return true;
  }

  beforeSaveDraft() {
    return true;
  }

  beforeSaveTemplate() {
    return true;
  }

  onCheckboxCheck(check: any) {
    console.log(check);
    if (check.checked === true) {
      this.formData.mandateEndDate = null;
    }
  }

  onChangeAmountType(amountType) {
    if (amountType == 'Variable') {
      this.formData.mandateType = null
    }
  }
}
