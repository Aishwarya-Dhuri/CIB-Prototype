import { Component, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ChequeDetails, PositivePay } from './@models/positive-pay.model';

@Component({
  selector: 'app-cheque-entry',
  templateUrl: './cheque-entry.component.html',
  styleUrls: ['./cheque-entry.component.scss'],
})
export class ChequeEntryComponent implements OnInit {
  loading: boolean;
  mode: string = '';
  chequeData: ChequeDetails = new ChequeDetails();
  formData: PositivePay = new PositivePay();
  editIndex: number = -1;
  uploadedImageUrl: string = '';

  stepperDetails: Stepper = {
    masterName: 'Positive Pay',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Cheque Entry - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Positive Pay' },
      { label: 'Transactions' },
      { label: 'Cheque Entry' },
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
        .httpPost('positivePay/transactions/chequeEntry/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  addRemark() {
    if (this.chequeData.remarkCount <= 4) {
      this.chequeData.remarkCount++;
    }
  }

  deleteRemark(index: number) {
    if (index < this.chequeData.remarkCount) {
      for (let i = index; i < this.chequeData.remarkCount; i++) {
        this.chequeData['remark' + i] = this.chequeData['remark' + i + 1];
        console.log(i, this.chequeData['remark' + i], this.chequeData['remark' + i + 1]);
      }
    }
    this.chequeData.remarkCount--;
  }

  onSelectDrawee(drawee: any) {
    this.chequeData.draweeName = drawee.draweeName;
  }

  onSelectAccount(account: any) {
    this.chequeData.accountCurrency = account.enrichments.currencyCode;
    this.chequeData.accountName = account.displayName;
    this.chequeData.accountHolderName = account.enrichments.corporateAccountAlias;
  }

  calculateCharges() {
    this.chequeData.charges = this.chequeData.chequeAmount
      ? +this.chequeData.chequeAmount * 0.000005
      : 0;
  }

  clearChequeData() {
    this.editIndex = -1;
    this.chequeData = new ChequeDetails();
  }

  addChequeData() {
    this.formData.totalAmount += +this.chequeData.chequeAmount;
    this.formData.chequeData.push(this.chequeData);

    this.clearChequeData();
  }

  onEditCheque(i: number) {
    this.editIndex = i;
    this.chequeData = cloneDeep(this.formData.chequeData[i]);
  }

  onUploadChequeImage(file: any) {
    this.chequeData.chequeImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.chequeData.chequeImageUrl = reader.result.toString();
    };
    reader.readAsDataURL(file[0]);
  }

  deleteUploadedImage() {
    this.chequeData.chequeImageUrl = '';
    this.chequeData.chequeImage = [];
  }

  onSaveCheque() {
    if (this.editIndex >= 0) {
      this.formData.totalAmount -= +this.formData.chequeData[this.editIndex].chequeAmount;
      this.formData.totalAmount += +this.chequeData.chequeAmount;

      this.formData.chequeData[this.editIndex] = this.chequeData;
      this.editIndex = -1;
      this.clearChequeData();
    }
  }

  beforeSubmit() {
    this.formData.noOfCheques = this.formData.chequeData.length;
    return true;
  }

  onDeleteCheque(i: number) {
    if (i == this.editIndex) {
      this.editIndex = -1;
      this.clearChequeData();
    }

    this.formData.totalAmount -= +this.formData.chequeData[i].chequeAmount;
    this.formData.chequeData.splice(i, 1);
  }

  onShowCheckImage(uploadedImageUrl: string) {
    this.uploadedImageUrl = uploadedImageUrl;
  }
}
