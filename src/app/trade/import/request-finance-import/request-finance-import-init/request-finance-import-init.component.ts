import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { RequestFinanceImportComponent } from '../request-finance-import.component';
import * as moment from 'moment';

@Component({
  selector: 'app-request-finance-import-init',
  templateUrl: './request-finance-import-init.component.html',
  styleUrls: ['./request-finance-import-init.component.scss'],
})
export class RequestFinanceImportInitComponent implements OnInit {
  @ViewChild('form') form: any;
  @Input('parentRef') parentRef: RequestFinanceImportComponent;

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

  isDealNoModalShow: boolean = false;
  isForwardNoModalShow: boolean = false;

  gridOptionsForExchangeDetails: any = {
    pagination: false,
    rowSelection: 'multiple',
    rowModelType: 'clientSide',
  };

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
