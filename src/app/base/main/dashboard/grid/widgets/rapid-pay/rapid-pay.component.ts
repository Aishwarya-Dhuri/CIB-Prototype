import { WidgetService } from 'src/app/base/main/@services/widget.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';
import { PaymentRequest } from 'src/app/payments/transactions/single-payment-request/@model/payment-request.model';
import { QuickPay } from 'src/app/payments/transactions/single-payment-request/@model/quick-pay.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';

@Component({
  selector: 'app-rapid-pay',
  templateUrl: './rapid-pay.component.html',
  styleUrls: ['./rapid-pay.component.scss'],
})
export class RapidPayComponent implements OnInit {
  @Input('index') index: any;
  @Input('title') title: any;
  @Input('id') id: any;
  @Input('serviceUrl') serviceUrl: any;
  @Input('showChangeChartOption') showChangeChartOption: any;

  step: number = 1;

  paymentMethodRecords: any[] = [];
  allPaymentMethodRecords: any[] = [];
  paymentMethods: any[] = [];

  debitAccounts: any = [
    {
      id: '60023737340023 - INR',
      enrichment: { balance: '123450' },
      displayName: '60023737340023 - INR',
    },
    {
      id: '10023737340563 - INR',
      enrichment: { balance: '345120' },
      displayName: '10023737340563 - INR',
    },
    {
      id: '34237373402301 - INR',
      enrichment: { balance: '345120' },
      displayName: '34237373402301 - INR',
    },
  ];



  quickPayDetails: QuickPay;
  onBeneficiarySearch() {
    this.widgetService.setSelectModalData({
      colDefUrl: 'payments/transactions/singlePaymentRequest/private/beneficiaryWidgetColDef',
      rowDefUrl: 'payments/masters/beneficiary/private/getBeneficiaryList',
    });
  }

  currencyList: any[] = [];

  @Output() action = new EventEmitter<{ type: string; i?: number }>();

  loading = true;

  constructor(
    private widgetService: WidgetService,
    private httpService: HttpService,
    private userService: UserService,
    private currencyService: CurrencyService,
  ) { }

  ngOnInit() {
    this.currencyService.getCurrencyList().subscribe((currencyList: any[]) => {
      this.currencyList = currencyList;
    });

    this.widgetService.getSelectModalResponse().subscribe((beneficiary: any) => {
      if (beneficiary) {
        this.quickPayDetails = {
          beneficiaryCode: beneficiary.beneficiaryCode,
          beneficiaryName: beneficiary.beneficiaryName,
          creditAccount: beneficiary.accountNo,
          bank: beneficiary.bank,
          currencyName: '',
          amount: '',
          debitAccountId: '',
          balance: '',
          paymentMethod: beneficiary.paymentMethod,
        };
        this.widgetService.setSelectModalResponse(null);
      }
    });

    this.resetQuickPayForm();

    this.httpService.httpPost('dashboard/widgets/private/getPaymentMethod').subscribe((response: any) => {
      this.allPaymentMethodRecords = response.data;
    });
  }

  resetQuickPayForm(): void {
    this.quickPayDetails = {
      beneficiaryId: '',
      beneficiaryCode: '',
      beneficiaryName: '',
      debitAccountId: '',
      debitAccount: '',
      currencyName: '',
      bank: '',
      balance: '',
      amount: '',
      creditAccount: '',
      paymentMethod: '',
    };
  }

  reset() {
    this.resetQuickPayForm();
    this.step = 1;
  }

  changeDebitAccount(debitAccount: any) {
    this.quickPayDetails.balance = debitAccount.enrichment.balance;
  }



  next() {
    if (this.step === 1) {

      var currencyName = this.currencyList.find(item => item.id === this.quickPayDetails.currencyName);
      var paymentMethodIndex = this.allPaymentMethodRecords.findIndex(item => item.hasOwnProperty(currencyName.displayName));

      if (paymentMethodIndex !== -1) {
        this.paymentMethods = Object.entries(this.allPaymentMethodRecords[paymentMethodIndex]);
        this.paymentMethodRecords = [];
        for (var i = 0; i < this.paymentMethods[0][1].length; i++) {
          this.paymentMethodRecords.push(this.paymentMethods[0][1][i]);
        }
      } else {
        this.paymentMethodRecords = [];
      }

      this.step++;
    } else if (this.step === 2) {
      let paymentRequestData: PaymentRequest = {
        channelName: 'WEB',
        valueDate: this.userService.getApplicationDate(),
        transactionDate: this.userService.getApplicationDate(),
        corporateProductId: '',
        debitAccountId: this.quickPayDetails.debitAccount,
        paymentMethodId: '',
        paymentMethodName: this.quickPayDetails.paymentMethod,
        debitCurrencyId: this.quickPayDetails.currencyId,
        debitCurrencyCode: this.quickPayDetails.currencyName,
        debitAmount: this.quickPayDetails.amount,
        totalRequest: '1',
        totalRequestAmount: this.quickPayDetails.amount,
        beneficiaryName: this.quickPayDetails.beneficiaryName,
        entryType: 'SINGLE',
        entryMode: 'MANUAL',
        requestBy: 'CORPORATE',
        initiateMode: 'PAYMENTMETHODWISE',
        accountTitle: this.quickPayDetails.beneficiaryName,
        status: 'Processing',
        paymentRequestDetails: [
          {
            beneficiaryId: this.quickPayDetails.beneficiaryId,
            beneficiaryCode: this.quickPayDetails.beneficiaryCode,
            beneficiaryName: this.quickPayDetails.beneficiaryName,
            debitCurrencyId: this.quickPayDetails.currencyId,
            debitAmount: this.quickPayDetails.amount,
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
          this.step++;
        });
    } else {
      this.resetQuickPayForm();
      this.step = 1;
    }
  }

  actionEvent(e: { type: string; event?: any }) {
    this.action.emit({ type: e.type, i: this.index });
  }
}
