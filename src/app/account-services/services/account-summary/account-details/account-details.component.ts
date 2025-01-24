import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Country } from '../@models/country';
import { AccountSummaryService } from '../@services/account-summary.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit {
  loading: boolean;
  corporate: any;
  country: Country;

  summary: any;

  isGroupUser: boolean = false;

  currencies: any[];
  selectedCurrency: any;

  accounts: any[];
  selectedAccount: any;

  selectAccountOptions: any[] = [];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
    private menuService: MenuService,
    private router: Router,
    private route: ActivatedRoute,
    public accountSummaryService: AccountSummaryService,
    public currencyService: CurrencyService,
    public userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    const actions: Actions = {
      heading: 'Account Details',
      subHeading: null,

      refresh: true,

      download: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
      backBtn: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Summary' },
      { label: 'Account Details' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.summary = this.accountSummaryService.getSummary();

    this.corporate = this.accountSummaryService.getCorporate();

    this.currencies = this.accountSummaryService.getCurrencies();

    if (this.currencies.length == 0) {
      const currencies = [];
      this.currencyService.getCurrencyList().subscribe((currencyList: any) => {
        currencyList.forEach((currency: any) => {
          currencies.push({
            currency: currency.displayName,
            flag: currency.enrichments.flag,
          });
        });
      });

      this.currencies = currencies;
    }

    this.selectedCurrency = this.accountSummaryService.getSelectedCurrency();

    if (!this.selectedCurrency) {
      this.selectedCurrency = this.currencies[0];
    }

    this.country = this.accountSummaryService.getCountry();

    if (!this.country) {
      this.country = this.userService.country;
    }

    this.accounts = this.accountSummaryService.getAccounts();

    this.selectedAccount = this.accountSummaryService.getSelectedAccount();

    if (this.summary.displayName == 'Virtual Account') {
      this.accounts = this.accounts.map((account: any) => {
        return {
          accountNo: account.virtualAccountNumber,
          ...account,
        };
      });
    } else if (this.summary.displayName == 'FD Summary') {
      this.accounts = this.accounts.map((account: any) => {
        return {
          accountNo: account.depositNumber,
          ...account,
        };
      });
    } else if (this.summary.displayName == 'Credit Card') {
      this.accounts = this.accounts.map((account: any) => {
        return {
          accountNo: account.creditCardNumber,
          ...account,
        };
      });
    } else if (this.summary.displayName == 'Debit Card') {
      this.accounts = this.accounts.map((account: any) => {
        return {
          accountNo: account.cardNo,
          ...account,
        };
      });
    }

    this.loading = false;
  }

  changeCurrency(currency: string) {
    this.selectedCurrency = this.currencies.find((cur: any) => cur.currency === currency);
    this.accountSummaryService.setSelectedCurrency(this.selectedCurrency);
  }

  changeAccount(account: any) {
    this.selectedAccount = this.accounts.find((acc: any) => acc.accountNo === account);
  }

  onSinglePaymentInitiation() {
    this.viewService.setExtraData({
      id:
        this.summary.displayName == 'Virtual Account'
          ? this.selectedAccount.accountId
          : this.selectedAccount.id,
    });
    this.viewService.setMode('PREFILLED');

    this.menuService.setSelectedServiceUrl('payments/transactions/singlePaymentRequest');

    this.router.navigate(['/payments/transactions/singlePaymentRequest/initiate'], {
      relativeTo: this.route,
    });
  }

  onPlaceSI() {
    this.viewService.setExtraData({
      id:
        this.summary.displayName == 'Virtual Account'
          ? this.selectedAccount.accountId
          : this.selectedAccount.id,
    });
    this.viewService.setMode('PREFILLED');

    this.menuService.setSelectedServiceUrl('payments/transactions/siManagement');

    this.router.navigate(['/payments/transactions/siManagement'], {
      relativeTo: this.route,
    });
  }

  onChequeBookRequest() {
    this.viewService.setExtraData({
      id:
        this.summary.displayName == 'Virtual Account'
          ? this.selectedAccount.accountId
          : this.selectedAccount.id,
    });
    this.viewService.setMode('PREFILLED');

    this.menuService.setSelectedServiceUrl('accountServices/chequeServices/chequeBookRequest');

    this.router.navigate(['/accountServices/chequeServices/chequeBookRequest'], {
      relativeTo: this.route,
    });
  }

  onFdInitiation() {
    this.viewService.setExtraData({
      id:
        this.summary.displayName == 'Virtual Account'
          ? this.selectedAccount.accountId
          : this.selectedAccount.id,
    });
    this.viewService.setMode('PREFILLED');

    this.menuService.setSelectedServiceUrl('accountServices/fixedDeposit/fdInitiation');
    this.router.navigate(['/accountServices/fixedDeposit/fdInitiation'], {
      relativeTo: this.route,
    });
  }

  onStatementDownload() {
    this.viewService.setExtraData({
      id:
        this.summary.displayName == 'Virtual Account'
          ? this.selectedAccount.accountId
          : this.selectedAccount.id,
    });
    this.viewService.setMode('PREFILLED');

    this.menuService.setSelectedServiceUrl('accountServices/services/accountStatement');
    this.router.navigate(['/accountServices/services/accountStatement'], {
      relativeTo: this.route,
    });
  }

  onCreditCardPayment() {
    this.viewService.setExtraData({
      ...this.selectedAccount,
      cardNo: this.selectedAccount.creditCardNumber,
      currency: this.selectedAccount.currency,
      cardType: this.selectedAccount.cardType,
      embossedName: this.selectedAccount.embossedName,
    });
    this.viewService.setMode('PREFILLED');

    this.menuService.setSelectedServiceUrl('accountServices/creditCard/creditCardBillPayment');
    this.router.navigate(['/accountServices/creditCard/creditCardBillPayment'], {
      relativeTo: this.route,
    });
  }

  onCreditCardStatementDownload() {
    this.viewService.setExtraData({
      ...this.selectedAccount,
      cardNo: this.selectedAccount.creditCardNumber,
      currency: this.selectedAccount.currency,
      cardType: this.selectedAccount.cardType,
      embossedName: this.selectedAccount.embossedName,
    });
    this.viewService.setMode('PREFILLED');

    this.menuService.setSelectedServiceUrl(
      'accountServices/creditCard/creditCardStatementDownload',
    );
    this.router.navigate(['/accountServices/creditCard/creditCardStatementDownload'], {
      relativeTo: this.route,
    });
  }

  onDownloadAccountDetails() {
    this.httpService.httpDownload('accountDetails/account-details.pdf');
  }

  onEmailAccountDetails() {}
}
