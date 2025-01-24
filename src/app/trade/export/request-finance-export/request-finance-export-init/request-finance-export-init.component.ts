import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { RequestFinanceExportComponent } from '../request-finance-export.component';
import * as moment from 'moment';

@Component({
  selector: 'app-request-finance-export-init',
  templateUrl: './request-finance-export-init.component.html',
  styleUrls: ['./request-finance-export-init.component.scss'],
})
export class RequestFinanceExportInitComponent implements OnInit {
  @ViewChild('form') form: any;
  @ViewChild('dealNoGrid') dealNoGrid: any;
  @ViewChild('forwardNoGrid') forwardNoGrid: any;

  @Input('parentRef') parentRef: RequestFinanceExportComponent;

  limitDetails: any[] = [
    {
      limitId: 'PARENT-LIMITNODE',
      sanctionedLimit: '2030000',
      utilizedLimit: '1000000',
      availableLimit: '1030000',
    },
    {
      limitId: 'CHILD-LIMITNODE',
      sanctionedLimit: '2030000',
      utilizedLimit: '1000000',
      availableLimit: '1030000',
    },
  ];

  isSearchBuyer: boolean = false;
  isSearchLcNumber: boolean = false;
  isDealNoModalShow: boolean = false;
  isForwardNoModalShow: boolean = false;

  exchangeDetailsColumnDefs: string =
    'trade/exportTransactions/requestFinance/private/exchangeDetailsColDefs';

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
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
      { label: 'Import' },
      { label: 'Request Finance' },
      { label: 'Initiate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.parentRef.formData.financeDetails[0].transactionDate = this.userService.applicationDate;
  }

  onLoanCurrency(event: any): void {
    this.parentRef.formData.financeDetails[0].loanCurrencyCode = event.displayName;
    this.validateExchangeDetails();
  }

  onAccountToBeCredited(event: any): void {
    this.parentRef.formData.financeDetails[0].accountToBeCreditedCurrency =
      event.enrichments.currencyCode;
    this.validateExchangeDetails();
  }

  validateExchangeDetails() {
    if (
      this.parentRef.formData.financeDetails[0].accountToBeCreditedCurrency !=
      this.parentRef.formData.financeDetails[0].loanCurrencyCode
    ) {
      this.parentRef.formData.isExchangeDetailsShow = true;
    } else {
      this.parentRef.formData.isExchangeDetailsShow = false;
    }
  }

  changeApplicant(value: any): void {
    if (value) {
      this.parentRef.formData.applicantDetails[0].applicantName = value.displayName;
      this.parentRef.formData.applicantDetails[0].applicantEmail =
        'info.' + value.id.toLowerCase() + '@pepsico.in';
      this.parentRef.formData.applicantDetails[0].applicantMobileNo =
        value.id == 'Pepsico' ? '+91 7000000000' : '+91 7004332211';
      this.parentRef.formData.applicantDetails[0].applicantAddress =
        '7th Street, Near Stadium Metro Station';
      this.parentRef.formData.applicantDetails[0].ieCode = value.id.toUpperCase() + '12345';
      this.parentRef.formData.applicantDetails[0].cifId = '1234' + value.id.toUpperCase();
    }
  }

  onTypeOfPackingCredit() {
    this.onChangeBuyerSearchType();
    this.onResetLcDetails();
  }

  onChangeBuyerSearchType(): void {
    this.parentRef.formData.packingCreditDetails[0].buyerName = '';
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].buyerCode = '';
    this.parentRef.formData.packingCreditDetails[0].buyerAddress = '';
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].country = '';
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].pinCode = '';
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].mobileNumber = '';
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].email = '';
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].bankSwiftCode = '';
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].bankName = '';
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].bankAddress = '';
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].buyerAccountNo = '';
  }

  onBuyerSelection(value: any): void {
    this.parentRef.formData.packingCreditDetails[0].buyerName = value.buyerName;
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].buyerCode = value.buyerCode;
    this.parentRef.formData.packingCreditDetails[0].buyerAddress = value.buyerAddress;
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].country = value.country;
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].pinCode = value.pinCode;
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].mobileNumber =
      value.mobileNumber;
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].email = value.email;
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].bankSwiftCode =
      value.bankSwiftCode;
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].bankName = value.bankName;
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].bankAddress = value.bankAddress;
    this.parentRef.formData.packingCreditDetails[0].buyerDetails[0].buyerAccountNo =
      value.buyerAccountNo;
  }

  onResetLcDetails(): void {
    this.parentRef.formData.packingCreditDetails[0].buyerName = '';
    this.parentRef.formData.packingCreditDetails[0].buyerAddress = '';
    this.parentRef.formData.packingCreditDetails[0].lcNumber = '';
    this.parentRef.formData.packingCreditDetails[0].lcDetails[0].lcIssuanceDate = '';
    this.parentRef.formData.packingCreditDetails[0].lcDetails[0].lcCurrency = '';
    this.parentRef.formData.packingCreditDetails[0].lcDetails[0].lcAmount = '';
    this.parentRef.formData.packingCreditDetails[0].lcDetails[0].lcIssuingBank = '';
    this.parentRef.formData.packingCreditDetails[0].lcDetails[0].lcIssuingBankAddress = '';
  }

  onLCSelection(value: any): void {
    this.parentRef.formData.packingCreditDetails[0].buyerName = value.beneficiaryName;
    this.parentRef.formData.packingCreditDetails[0].buyerAddress = value.beneficiaryName;
    this.parentRef.formData.packingCreditDetails[0].lcNumber = value.id;
    this.parentRef.formData.packingCreditDetails[0].lcDetails[0].lcIssuanceDate =
      value.effectiveDate;
    this.parentRef.formData.packingCreditDetails[0].lcDetails[0].lcCurrency = value.currency;
    this.parentRef.formData.packingCreditDetails[0].lcDetails[0].lcAmount = value.amount;
    this.parentRef.formData.packingCreditDetails[0].lcDetails[0].lcIssuingBank =
      value.beneficiaryBankName;
    this.parentRef.formData.packingCreditDetails[0].lcDetails[0].lcIssuingBankAddress =
      value.beneficiaryBankName;
  }

  changeLoanAppliedFor(value: any): void {
    const transactionDate = new Date(this.parentRef.formData.financeDetails[0].transactionDate);
    const dueDate = new Date(
      transactionDate.setDate(transactionDate.getDate() + +value),
    ).toLocaleDateString();
    this.parentRef.formData.financeDetails[0].selectedDueDate =
      moment(dueDate).format('DD-MMM-YYYY');
  }

  changeDueDate(value: any): void {
    const transactionDate: any = moment(
      this.parentRef.formData.financeDetails[0].transactionDate,
      'DD-MMM-YYYY',
    );
    const dueDate: any = moment(value, 'DD-MMM-YYYY');
    const difference = dueDate.diff(transactionDate, 'days');
    this.parentRef.formData.financeDetails[0].loanAppliedFor = difference.toString();
  }

  onDealSelected(): void {
    if (this.parentRef.formData.exchangeDetails[0].isDealNo) {
      this.isDealNoModalShow = true;
    } else {
      this.parentRef.formData.exchangeDetails[0].selectedDealNoRows = 0;
      this.parentRef.formData.exchangeDetails[0].selectedDealData = [];
    }
  }

  onForwardSelected(): void {
    if (this.parentRef.formData.exchangeDetails[0].isForward) {
      this.isForwardNoModalShow = true;
    } else {
      this.parentRef.formData.exchangeDetails[0].selectedForwardNoRows = 0;
      this.parentRef.formData.exchangeDetails[0].selectedForwardData = [];
    }
  }

  setDealNoData(dealNos: any[]): void {
    this.parentRef.formData.exchangeDetails[0].selectedDealNoRows = dealNos.length;
    this.parentRef.formData.exchangeDetails[0].selectedDealData = dealNos;
  }

  setForwardNoData(dealNos: any[]): void {
    this.parentRef.formData.exchangeDetails[0].selectedForwardNoRows = dealNos.length;
    this.parentRef.formData.exchangeDetails[0].selectedForwardData = dealNos;
  }
}
