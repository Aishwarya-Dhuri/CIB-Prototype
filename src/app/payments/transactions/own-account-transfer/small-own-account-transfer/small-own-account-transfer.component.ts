import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { OwnAccountTransfer } from '../@model/own-account-transfer.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { Router } from '@angular/router';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-small-own-account-transfer',
  templateUrl: './small-own-account-transfer.component.html',
  styleUrls: ['./small-own-account-transfer.component.scss'],
})
export class SmallOwnAccountTransferComponent implements OnInit {
  formDataList: OwnAccountTransfer[] = [];

  editingRecordIndex = -1;

  @ViewChild('recentTransferGrid') recentTransferGrid: any;

  stepperDetails: Stepper = {
    masterName: 'Own Account Transfer',
    currentStep: 1,
    isOnlyFooter: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  oatOtherBank: boolean = false;
  isInitiateScreen: boolean = false;

  totalAmount = 0;

  formData: OwnAccountTransfer;

  currencyList: Select[] = [];
  debitAccountList: Select[] = [];
  creditAccountList: Select[] = [];

  payableFxRate: string = '0.79';
  isLoading = true;
  mode: string = '';

  constructor(
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private currencyService: CurrencyService,
    private toasterService: ToasterService,
    private menuService: MenuService,
    private router: Router,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Own Account Transfer',
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
      { label: 'Own Account Transfer' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.resetForm();

    this.getAccountList();
    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/transactions/ownAccountTransfer/private/view', data)
        .subscribe((formData: OwnAccountTransfer) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.formDataList.push(formData);
          this.editingRecordIndex = 0;
          if (this.mode == 'VIEW')
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          this.isInitiateScreen = true;
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
    }
  }

  resetForm() {
    this.formData = {
      totalRequest: '1',
      channelName: 'WEB',
      isShow: false,
      corporateCode: this.userService.userDetails.corporateCode,
      status: 'Processing',
      entryType: 'SINGLE',
      entryMode: 'MANUAL',
      requestBy: 'CORPORATE',
      bank: '',
      paymentMethodId: '',
      debitAccountId: '',
      creditAccountId: '',
      corporateRefNo: '',
      valueDate: '',
      payableAmount: '',
      debitAmount: '',
      creditAmount: '',
      remark: '',
      paymentRequestDetails: [
        {
          amountType: 'PAYABLE',
          exchangeType: 'CARD',
          dealNo: '',
          paymentDetails1: '',
          paymentDetails2: '',
          paymentDetails3: '',
          paymentDetails4: '',
          corporateRefNo: '',
          enrichments: [
            { name: 'Value Date', value: '', type: 'DATE', required: true },
            { name: 'Invoice Number', value: '', type: 'STRING', required: false },
          ],
          supportingDocList: [],
        },
      ],
    };

    this.editingRecordIndex = -1;
  }

  addTransaction() {
    if (this.editingRecordIndex >= 0) {
      this.formDataList[this.editingRecordIndex] = this.formData;
      this.editingRecordIndex = -1;
    } else {
      this.formDataList.push(this.formData);
    }
    this.calculateTotalAmount();
    this.resetForm();
  }

  onDebitAccountChange() {
    if (!this.formData.debitAccountId) return;
    const value = this.debitAccountList.find((p: any) => p.id === this.formData.debitAccountId);
    this.formData.debitAccountNo = value.displayName;
    this.formData.debitAccountBalance = value.enrichments.balance;
    this.formData.accountTitle = value.enrichments.accountTitle;
    this.formData.paymentRequestDetails[0].debitAccountId = value.id;
  }

  onCreditAccountChange() {
    if (!this.formData.creditAccountId) return;
    const value = this.creditAccountList.find((p: any) => p.id === this.formData.creditAccountId);
    this.formData.creditAccountNo = value.displayName;
    this.formData.creditAccountBalance = value.enrichments.balance;
    this.formData.accountTitle = value.enrichments.accountTitle;
    this.formData.paymentRequestDetails[0].creditAccountId = value.id;
  }

  onPayableAmoutChange() {
    this.formData.totalRequestAmount = this.formData.payableAmount;
    this.formData.paymentRequestDetails[0].payableAmount = this.formData.payableAmount;
    const fxRate = +this.payableFxRate !== 0 ? +this.payableFxRate : 1;
    this.formData.debitAmount = (+this.formData.payableAmount / fxRate).toFixed(2).toString();
  }

  calculateTotalAmount() {
    let totalAmount = 0;

    this.formDataList.forEach((transaction: OwnAccountTransfer) => {
      totalAmount += +transaction.payableAmount;
    });

    this.totalAmount = totalAmount;
  }

  editRecord(index: number) {
    this.editingRecordIndex = index;
    this.formData = this.formDataList[index];
  }

  deleteRecord(index: number) {
    this.formDataList.splice(index, 1);
    this.calculateTotalAmount();
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return this.formDataList.length > 0;
    }
    return true;
  }

  beforeSubmit(): boolean {
    const api = `payments/transactions/ownAccountTransfer/private/${
      this.mode ? 'update' : 'create'
    }`;

    let count = 0;

    this.formDataList.forEach((formData: OwnAccountTransfer) => {
      this.httpService.httpPost(api, formData).subscribe((response: any) => {
        count = count + 1;
        if (count == this.formDataList.length) {
          const msg =
            this.stepperDetails.masterName +
            (this.mode ? ' updated successfully' : ' initiated successfully');
          this.toasterService.showToaster({ severity: 'success', detail: msg });
          this.resetForm();
          this.stepperDetails.currentStep = 1;
          this.totalAmount = 0;
          this.formDataList = [];
          this.isInitiateScreen = false;
        }
      });
    });
    return false;
  }

  getAccountList(): void {
    this.debitAccountList = [];
    this.currencyList = [];

    const data = { dataMap: { corporateId: this.userService.getCorporateId() } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        this.debitAccountList = response.dataList;
        this.creditAccountList = response.dataList;
      });

    this.currencyService.getCurrencyList().subscribe((currencyList: Select[]) => {
      this.currencyList = currencyList;
    });
  }
}
