import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Select } from 'src/app/shared/@models/select.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { PaymentRequest } from '../@model/payment-request.model';
import { QuickPay } from '../@model/quick-pay.model';

@Component({
  selector: 'app-large-single-payment-request',
  templateUrl: './large-single-payment-request.component.html',
  styleUrls: ['./large-single-payment-request.component.scss'],
})
export class LargeSinglePaymentRequestComponent implements OnInit {
  overallCardData: any;
  showQuickPayModal: boolean = false;

  quickPay: QuickPay = new QuickPay();

  debitAccountReqBody: any = { dataMap: { corporateId: this.userService.corporateId } };

  currencyName: string;

  isShowBeneficiaryModal: boolean;
  beneficiaryColDefUrl: string =
    'payments/transactions/singlePaymentRequest/private/beneficiaryColDef';
  beneficiaryRowDefUrl: string = 'payments/masters/beneficiary/private/getBeneficiaryList';

  isShowQuickPaySuccess: boolean;
  quickPaySuccessData: any;

  transactionsListTypes: any[] = [];
  showCorporateAccounts: boolean = false;
  groupData!: any;
  loading!: boolean;
  isGroupUser: boolean = false;
  corporateAccountsData: any[] = [];

  corporateAccountGridOptions: any = {
    rowModelType: 'clientSide',
    treeData: true,
    autoGroupColumnDef: {
      headerName: 'Corporate Name',
      cellRendererParams: { suppressCount: true },
    },
    getDataPath: function (data: any) {
      return data.corporateName;
    },
  };

  constructor(
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private currencyService: CurrencyService,
    private userService: UserService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    /* remove below : starts */
    const actions: Actions = {
      heading: 'Single Payment Request',
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
      { label: 'Single Payment Request' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    if (this.viewService.getMode() && this.viewService.getId()) {
      this.router.navigateByUrl(this.router.url + '/initiate', {
        state: { initiateMode: 'PAYMENTMETHODWISE' },
      });
      return;
    }

    this.resetQuickPayForm();

    this.currencyService.getCurrency().subscribe((currency: Select) => {
      if (currency) {
        this.quickPay.currencyId = currency.id;
        this.quickPay.currencyName = currency.displayName;
        this.currencyName = currency.displayName + ' ';
      }
    });

    this.overallCardData = {
      totalValue: '30000000',
      totalNumber: '109',
      completed: '101',
      pending: '20',
      rejected: '10',
    };

    this.httpService
      .httpPost('payments/transactions/singlePaymentRequest/private/getTransactionListTypes')
      .subscribe((response: any) => {
        this.transactionsListTypes = response.data;
        this.loading = false;
      });

    if (this.isGroupUser) {
      this.httpService
        .httpPost('payments/transactions/ownAccountTransfer/private/getGroupCorporateAccounts')
        .subscribe((response: any) => {
          this.corporateAccountsData = response.data;
        });

      this.httpService
        .httpPost('payments/transactions/ownAccountTransfer/private/getGroupDashboardData')
        .subscribe((response: any) => {
          this.groupData = response.data;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onBeneSelection(beneficiary: any) {
    this.quickPay.beneficiaryId = beneficiary.id;
    this.quickPay.beneficiaryCode = beneficiary.beneficiaryCode;
    this.quickPay.beneficiaryName = beneficiary.beneficiaryName;
    this.quickPay.creditAccount = beneficiary.accountNo;
    this.quickPay.paymentMethod = beneficiary.paymentMethod;
  }

  resetQuickPayForm(): void {
    this.quickPay = new QuickPay();
  }

  onDebitAccountSelection(account: Select): void {
    this.quickPay.debitAccount = account.displayName;
  }

  onQuickPaySubmit() {
    let paymentRequestData: PaymentRequest = {
      channelName: 'WEB',
      valueDate: this.userService.getApplicationDate(),
      transactionDate: this.userService.getApplicationDate(),
      corporateProductId: '',
      debitAccountId: this.quickPay.debitAccountId,
      paymentMethodId: '',
      paymentMethodName: this.quickPay.paymentMethod,
      debitCurrencyId: this.quickPay.currencyId,
      debitCurrencyCode: this.quickPay.currencyName,
      debitAmount: this.quickPay.amount,
      totalRequest: '1',
      totalRequestAmount: this.quickPay.amount,
      beneficiaryName: this.quickPay.beneficiaryName,
      entryType: 'SINGLE',
      entryMode: 'MANUAL',
      requestBy: 'CORPORATE',
      initiateMode: 'PAYMENTMETHODWISE',
      accountTitle: this.quickPay.beneficiaryName,
      status: 'Processing',
      paymentRequestDetails: [
        {
          beneficiaryId: this.quickPay.beneficiaryId,
          beneficiaryCode: this.quickPay.beneficiaryCode,
          beneficiaryName: this.quickPay.beneficiaryName,
          debitCurrencyId: this.quickPay.currencyId,
          debitAmount: this.quickPay.amount,
          valueDate: this.userService.getApplicationDate(),
          transactionDate: this.userService.getApplicationDate(),
          enrichments: [],
          supportingDocList: [],
          paymentRequestAdditionalDetail: [
            {
              beneficiaryAccountNo: '',
              dispatchTo: 'BENEFICIARY',
              instrumentDispatchMode: 'EMAIL',
            },
          ],
        },
      ],
    };
    this.httpService
      .httpPost('payments/transactions/singlePaymentRequest/private/create', paymentRequestData)
      .subscribe(() => {
        this.isShowQuickPaySuccess = true;
      });
  }

  copy() {
    const copyText: any = document.querySelector('#quickPayResponse');
    copyText.select();
    document.execCommand('copy');
  }

  onPaymentMethodWiseClick() {
    this.router.navigateByUrl(this.router.url + '/initiate', {
      state: { initiateMode: 'PAYMENTMETHODWISE' },
    });
  }

  onBeneficiartWiseClick() {
    this.router.navigateByUrl(this.router.url + '/initiate', {
      state: { initiateMode: 'BENEFICIARYWISE' },
    });
  }
}
