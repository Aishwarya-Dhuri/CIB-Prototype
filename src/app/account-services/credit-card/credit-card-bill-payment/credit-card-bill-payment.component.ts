import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Select } from '../../../shared/@models/select.model';
import { CurrencyService } from '../../../shared/@services/currency.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../shared/@services/http.service';
import { CreditCardService } from '../@services/credit-card.service';
import { MenuService } from '../../../base/main/@services/menu.service';
import { Stepper } from '../../../shared/@components/stepper/@model/stepper.model';
import { ViewService } from '../../../shared/services/view-service/view-service';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';

@Component({
  selector: 'app-credit-card-bill-payment',
  templateUrl: './credit-card-bill-payment.component.html',
  styleUrls: ['./credit-card-bill-payment.component.scss'],
})
export class CreditCardBillPaymentComponent implements OnInit {
  @ViewChild('paymentDetailsForm') paymentDetailsForm: NgForm;

  loading: boolean;

  review: boolean = false;
  isShowCreditCardModal: boolean = false;

  creditCardData: any;

  formData: any = {
    paymentDate: '',
    payableAmount: '',
    paymentAmount: 'Minimum Amount Due',
    payableCurrency: '',
    payableCurrencyId: '',
    debitAccount: '',
    debitAccountNo: '',
    accountBalance: '',
  };

  stepperDetails: Stepper = {
    masterName: 'Credit Card Bill Payment',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Credit Card Details', 'Review and Submit'],
    isOnlyFooter: true,
  };
  currencyList: any;
  URLs: any;
  showSubmitSuccess: boolean;
  submitResponse: any;
  viewMode: boolean;
  private mode: string;
  private URL_CONST: any = {
    VIEW: 'accountServices/creditCard/creditCardBillPayment/private/view',
  };
  accounts: any[] = [];

  constructor(
    private currencyService: CurrencyService,
    private creditCardService: CreditCardService,
    private menuService: MenuService,
    private httpService: HttpService,
    private viewService: ViewService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Credit Card Bill Payment',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
      favourite: true,
      help: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Services' },
      { label: 'Credit Card' },
      { label: 'Credit Card Bill Payment  ' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.URLs = this.creditCardService.URL_CONST;
    this.setSelectedCard();

    this.currencyService.getCurrencyList().subscribe((currencyList: Select[]) => {
      if (currencyList && currencyList.length > 0) {
        this.currencyList = currencyList;
      }
    });

    this.mode = this.viewService.getMode();

    this.viewMode = this.mode === 'VIEW';
    if (this.viewMode) {
      this.stepperDetails.currentStep = this.stepperDetails.headings.length;
    }

    this.getAccounts();
    if (this.mode == 'VIEW') {
      this.getViewData();
    } else {
      if (this.mode === 'PREFILLED') {
        const data = this.viewService.getExtraData();
        this.onCreditCardSelection(data);
        this.viewService.clearAll();
      }

      this.loading = false;
    }
  }

  cancel() {}

  fetchCreditCardDetails(creditCardForm: NgForm) {}

  selectCreditCardModal() {}

  onCreditCardSelection(data: any) {
    this.creditCardData = data;
  }

  onPayableCurrency(ccy: any) {
    this.formData.payableCurrency = ccy.displayName;
  }

  setSelectedCard() {
    try {
      const creditCardId = this.creditCardService.selectedCardDetails.id;
      if (creditCardId) {
        this.creditCardService
          .getCreditCardById(creditCardId)
          .subscribe((card) => this.onCreditCardSelection(card));
      }
    } catch (e) {
      console.error('creditCardId not found');
    }
  }

  private getAccounts() {
    this.creditCardService.getAccounts().subscribe((data) => (this.accounts = data));
    this.currencyService.getCurrency().subscribe((currency: Select) => {
      if (currency) {
        this.formData.payableCurrencyId = currency.id;
      }
    });
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url + '/listing');
  }

  beforeSubmit() {
    this.showSubmitSuccess = false;
    let data = { ...this.creditCardData, ...this.formData, paymentDetails: [this.formData] };
    data.status = 'Unauthorized';
    let url =
      this.menuService.getSelectedServiceUrl() ||
      'accountServices/creditCard/creditCardBillPayment';
    if (!this.mode) url = url + '/private/create';
    else url = url + '/private/update';
    this.httpService.httpPost(url, data).subscribe((response: any) => {
      this.showSubmitSuccess = true;
      this.submitResponse = response;
    });
    return false;
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return this.paymentDetailsForm && this.paymentDetailsForm.valid;
    }

    return true;
  }

  private getViewData() {
    try {
      const creditCardId = this.viewService.getId();
      this.viewService.clearAll();
      if (creditCardId) {
        this.getCardData(creditCardId);
      } else {
        console.error('credit Card Id not found');
        this.loading = false;
      }
    } catch (e) {
      console.error('credit Card data not found');
      this.loading = false;
    }
  }

  private getCardData(cardId: string) {
    this.creditCardService.getCreditCard(this.URL_CONST.VIEW, cardId).subscribe((data) => {
      let { paymentDetails, ...creditCardData } = data;
      this.formData = paymentDetails[0];
      this.creditCardData = creditCardData;
      this.loading = false;
    });
  }

  onChangeDebitAccount(account: any) {
    this.formData.debitAccountNo = account.displayName;
    this.formData.accountBalance = account.enrichments.balance;
  }

  resetAmount() {
    this.formData.payableAmount = '';
  }
}
