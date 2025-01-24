import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Select } from 'src/app/shared/@models/select.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

import {
  BillPaymentAndApplyFinance,
  PaymentDetails,
} from '../@models/bill-payment-and-apply-finance.model';
import { BillPaymentAndApplyFinanceService } from '../@services/bill-payment-and-apply-finance.service';
import { Location } from '@angular/common';
import { data } from 'src/app/account-services/services/account-summary/@services/account-summery.data';

@Component({
  selector: 'app-bill-payment-and-apply-finance-initiate',
  templateUrl: './bill-payment-and-apply-finance-initiate.component.html',
  styleUrls: ['./bill-payment-and-apply-finance-initiate.component.scss'],
})
export class BillPaymentAndApplyFinanceInitiateComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  @ViewChild('paymentGrid') paymentGrid: any;

  rowIndex: number = -1;
  billDetails: any;

  paymentDetails: PaymentDetails = new PaymentDetails();

  isLcDetailsShow: boolean = false;
  colDefsUrl: string =
    'trade/importTransactions/billPaymentAndApplyFinance/private/paymentGridColDefs';

  isReview: boolean = false;
  mode: string = '';

  formData: BillPaymentAndApplyFinance = new BillPaymentAndApplyFinance();
  gridOptions = {
    rowModelType: 'clientSide',
  };

  totalPaymentAmount: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private viewService: ViewService,
    private billPaymentAndApplyFinanceService: BillPaymentAndApplyFinanceService,
    private currencyService: CurrencyService,
    private location: Location,
  ) {
    this.getBillDetails();
    this.getCurrency();
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Initiate',
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
      { label: 'Bill Payment And Apply Finance' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.currencyService.getCurrencyName().subscribe((res) => {
      this.formData.financeDetails[0].loanCurrency = res;
    });

    this.getViewData();
  }

  getBillDetails(): void {
    this.httpService
      .httpPost(
        'trade/importTransactions/billPaymentAndApplyFinance/private/getSearchResultDataList',
      )
      .subscribe((response: any) => {
        this.billDetails = response.data.find(
          (res: any) => res.id === this.billPaymentAndApplyFinanceService.billId,
        );
      });
  }

  getCurrency(): void {
    this.currencyService.getCurrencyId().subscribe((res: any) => {
      this.paymentDetails.paymentCurrency = res;
      this.paymentDetails.debitCurrency = res;
      this.formData.financeDetails[0].financeCurrency = res;
    });
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/importTransactions/billPaymentAndApplyFinance/private/view', data)
        .subscribe((formData: BillPaymentAndApplyFinance) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.isReview = true;
          }
        });
    }
  }

  addAccounts(): void {
    const paymentDetails = {
      ...this.paymentDetails,
      paymentDetailId: new Date().getTime().toString(),
      actions: [
        {
          index: 0,
          paramList: 'paymentDetailId',
          methodName: 'editData',
          type: 'ICON',
          displayName: 'Edit',
          icon: 'fa-pencil',
        },
        {
          index: 1,
          paramList: 'paymentDetailId',
          methodName: 'delete',
          type: 'ICON',
          displayName: 'Delete',
          icon: 'fa-trash-alt',
        },
      ],
    };

    this.formData.paymentDetails.push(paymentDetails);

    this.paymentDetails = new PaymentDetails();

    if (this.paymentGrid) {
      this.paymentGrid.setRowData(this.formData.paymentDetails);
      // this.paymentGrid.refreshGridList();
    }
  }

  editData(paymentDetailId: string): void {
    this.rowIndex = this.formData.paymentDetails.findIndex(
      (data: any) => data.paymentDetailId == paymentDetailId,
    );
    if (this.rowIndex >= 0) {
      this.paymentDetails = this.formData.paymentDetails[this.rowIndex];
    }
  }

  delete(paymentDetailId: string): void {
    const index = this.formData.paymentDetails.findIndex(
      (data: any) => data.paymentDetailId == paymentDetailId,
    );

    if (index >= 0) {
      this.formData.paymentDetails.splice(index, 1);

      if (this.rowIndex == index) {
        this.rowIndex = -1;
      }

      if (this.paymentGrid) {
        this.paymentGrid.setRowData(this.formData.paymentDetails);
      }
    }
  }

  saveEdit(): void {
    const paymentDetails = {
      ...this.paymentDetails,
    };

    this.formData.paymentDetails[this.rowIndex] = paymentDetails;
    this.rowIndex = -1;

    this.paymentDetails = new PaymentDetails();

    if (this.paymentGrid) {
      this.paymentGrid.setRowData(this.formData.paymentDetails);
      // this.paymentGrid.refreshGridList();
    }
  }

  prepareData(): void {
    this.formData.tradeBillNumber = this.billDetails.tradeBillNumber;
    this.formData.tradeBillDate = this.billDetails.tradeBillDate;
    this.formData.daDp = this.billDetails.daDp;
    this.formData.tradeBillDueDate = this.billDetails.tradeBillDueDate;
    this.formData.billAmount = this.billDetails.billAmount;
    this.formData.lcNumber = this.billDetails.lcNumber;
    this.formData.lcIssueDate = this.billDetails.lcIssueDate;
    this.formData.exporterBeneficiary = this.billDetails.beneficiaryName;
    this.formData.importerApplicantName = this.billDetails.applicantName;
    this.formData.usanceOrSight = 'USANCE';
    this.formData.lcExpiryDate = this.billDetails.lcExpiryDate;
    this.formData.discrepant = '';
    this.formData.billReject = '';
    this.formData.status = 'Accepted';
  }

  onSubmit(): void {
    this.prepareData();
    let url = 'trade/importTransactions/billPaymentAndApplyFinance/private/create';
    if (this.mode && this.mode === 'EDIT') {
      url = 'trade/importTransactions/billPaymentAndApplyFinance/private/update';
    }
    this.httpService.httpPost(url, this.formData).subscribe((res: any) => {
      if (res) {
        this.router.navigate(['./listing'], { relativeTo: this.route });
        this.toasterService.showToaster({
          severity: 'success',
          detail: 'Bill Payment And Apply Finance is successfully submitted',
        });
      }
    });
  }

  onLcNumberClick(lcNumber: string): void {
    this.isLcDetailsShow = true;
    this.viewService.setId(lcNumber);
    this.viewService.setMode('VIEW');
  }

  getTotalPaymentAmount(): string {
    let total = 0;
    let totalAmount: string;
    this.formData.paymentDetails.forEach((res) => {
      totalAmount = (total += +res.paymentAmount).toString();
    });
    return totalAmount;
  }

  cancel(): void {
    this.location.back();
  }

  back(): void {
    this.location.back();
  }
}
