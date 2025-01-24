import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { SendMoney } from './@model/send-money.model';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: []
})
export class SendMoneyComponent implements OnInit {
  @ViewChild('apsform') apsform: NgForm;

  searchBeneficiary = false;

  stepperDetails: Stepper = {
    masterName: 'Send Money',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  formData: SendMoney = new SendMoney();

  mode: string;

  constructor(
    private httpService: HttpService,
    private viewService: ViewService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private toasterService: ToasterService) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Send Money - Initiate',
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
      { label: 'UPI' },
      { label: 'Send Money' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/upi/sendMoney/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          if (formData) {
            this.formData = formData;
            if (this.mode == 'VIEW') {
              this.stepperDetails.currentStep = this.stepperDetails.headings.length;
            }
          }
        });
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return this.apsform && this.apsform.valid;
    }
    return true;
  }

  validateOTP() {
    this.toasterService.showToaster({
      severity: 'success',
      detail: 'UPI ID Validated Successfully',
    });
  }

  onBeneSelection(beneficiary: any) {
    this.formData.beneficiaryCode = beneficiary.beneficiaryCode
    this.formData.beneficiaryName = beneficiary.beneficiaryName
    this.formData.beneficiaryBankName = beneficiary.beneficiaryBank
    this.formData.country = beneficiary.country
    this.formData.beneficiaryAccountNumber = beneficiary.beneficiaryAccountNo
    this.formData.beneficiaryBankAddress1 = beneficiary.beneficiaryBankAddress
    this.formData.beneficiaryAddress1 = beneficiary.beneficiaryAddress
    this.formData.email = beneficiary.beneficiaryEmail
    this.formData.bankSwiftCode = beneficiary.id
  };

  resetBeneficiaryDetails() {
    this.formData.beneficiaryCode = ''
    this.formData.beneficiaryName = ''
    this.formData.beneficiaryBankName = ''
    this.formData.country = ''
    this.formData.beneficiaryAccountNumber = ''
    this.formData.beneficiaryBankAddress1 = ''
    this.formData.beneficiaryAddress1 = ''
    this.formData.email = ''
    this.formData.bankSwiftCode = ''
  }


  addBeneficiaryAddress() {
    if (!this.formData.beneficiaryAddress2show) {
      this.formData.beneficiaryAddress2show = true;
    } else if (!this.formData.beneficiaryAddress3show) {
      this.formData.beneficiaryAddress3show = true;
    }
  }

  addBeneficiaryBankAddress() {
    if (!this.formData.beneficiaryBankAddress2show) {
      this.formData.beneficiaryBankAddress2show = true;
    } else if (!this.formData.beneficiaryBankAddress3show) {
      this.formData.beneficiaryBankAddress3show = true;
    }
  }

}
