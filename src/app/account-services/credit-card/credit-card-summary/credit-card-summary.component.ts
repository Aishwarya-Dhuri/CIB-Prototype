import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../shared/@services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../shared/@services/http.service';
import { CreditCardService } from '../@services/credit-card.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { Actions } from 'src/app/base/@models/actions';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { AccountSummaryService } from '../../services/account-summary/@services/account-summary.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { lowerCase } from 'lodash';

@Component({
  selector: 'app-credit-card-summary',
  templateUrl: './credit-card-summary.component.html',
  styleUrls: ['./credit-card-summary.component.scss'],
})
export class CreditCardSummaryComponent implements OnInit, OnDestroy {
  corporateType: string;

  topDueTransactions: any[] = [];
  creditCardData: any[] = [];
  todayDate: string;
  URL_CONSTS: any = {
    GET_CREDITCARDS: 'accountServices/creditCard/private/getCreditCards',
  };
  unSub$ = new Subject();

  userDetails: any;
  isShowSupplementaryCard: boolean;
  supplementaryCardsData: any;

  isShowNearestDueModal: boolean;
  nearestDueData: any;

  topUnbilledData: any;
  isShowTopUnbilledModal: boolean;

  isShowRecentCreditsModal: boolean;
  recentCreditsData: any = {};
  categoryWiseSpendChartData: any;
  options: any;

  totalRecords;

  nearestDueObj: Observable<any>;

  isShowPaymentHistoryModal: boolean;
  paymentHistoryData: any = {};

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private accountSummaryService: AccountSummaryService,
    private httpService: HttpService,
    private currencyService: CurrencyService,
    private creditCardService: CreditCardService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.corporateType = this.userService.userDetails.corporateType;
    const actions: Actions = {
      heading: 'Credit Card Summery',
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
      { label: 'Account Services' },
      { label: 'Credit Card' },
      { label: 'Credit Card Summery' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.userDetails = this.userService.userDetails;
    this.todayDate = this.userDetails.applicationDate.replaceAll('-', ' ');

    this.getCreditCards();
    this.nearestDueObj = this.creditCardService
      .getCreditCardList()
      .pipe(map((response: any): any[] => response.data));
  }

  private getCreditCards(paginationData?: any) {
    this.creditCardService.getCreditCardList(paginationData).subscribe((response: any) => {
      this.creditCardData = response.data;
      this.totalRecords = response.lastRow;
      this.creditCardData.map((a) => {
        this.createOptionsDataForData(a, a.categoryWiseSpendChartData);
        return a;
      });
    });
  }

  registerNewCard(event: Event) {
    this.redirectToPage(event, 'creditCardRegistration');
  }

  createOptionsDataForData(obj: any, data: any) {
    obj.options = {
      data: data,
      formatter: (params: any) => {
        return `${data[params.itemId].displayName} ${obj.currency} ${data[params.itemId].amount}`;
      },
      padding: {
        left: 0,
        right: 0,
        top: 12,
        bottom: 12,
      },
      labelKey: 'displayName',
      angleKey: 'amount',
      legend: {
        spacing: 10,
        layoutHorizontalSpacing: 10,
        layoutVerticalSpacing: 10,
      },
    };
  }
  applyNewCard() {}

  toggleSelectedCorporate(card: any) {}

  manageAutoPay(event: MouseEvent, url: string, creditCard: any) {
    const cardObj: any = {};
    cardObj.id = creditCard.manageAutoPayId;
    this.redirectToPage(event, url, cardObj);
  }

  redirectToPage(event: Event, url: string, cardObj?: any) {
    event.stopPropagation();
    const cardData = cardObj ? { cardNo: cardObj.cardNo, id: cardObj.id } : '';

    this.creditCardService.selectedCardDetails = cardObj;

    this.router.navigate([`../${url}`], { state: { cardData }, relativeTo: this.route });
  }

  viewTxnDetails(creditCard: any) {
    this.accountSummaryService.setSummary({
      accounts: [],
      colDefUrl: 'accountServices/services/accountSummary/private/creditCardColDefs',
      creditAmount: creditCard.totalAmountDue,
      debitAmount: creditCard.outStandingAmount,
      displayName: 'Credit Card',
      id: 'creditCard',
      label1: 'Total Amount Due',
      label2: 'Total Outstanding Amount',
      limitOrBalance: 'Limit',
      mainLabel: 'Total Credit Limit',
      moreOptionsList: [
        {
          label: 'Card Payment',
          method: 'onCardPayment',
        },
        {
          label: 'Statement Download',
          method: 'onStatementDownload',
        },
      ],
      rowDefUrl: 'accountServices/services/accountSummary/private/getCreditCardData',
      totalAccounts: 1,
      totalAmount: creditCard.cardLimit,
      totalLabel: 'Total Available Limit',
    });

    this.accountSummaryService.setCorporate({
      availableBalance: creditCard.cardLimit,
      availableLimit: creditCard.cardLimit,
      corporateId: this.userService.userDetails.corporateId,
      logo: this.userService.userDetails.corporateImage,
      name: this.userService.userDetails.corporateName,
    });

    const currencies = [];

    this.currencyService.getCurrencyList().subscribe((currencyList: any[]) => {
      currencyList.forEach((currency: any) => {
        currencies.push({
          currency: currency.displayName,
          flag: currency.enrichments.flag,
        });
      });
    });

    this.accountSummaryService.setCurrencies(currencies);

    this.accountSummaryService.setSelectedCurrency(currencies[0]);

    this.accountSummaryService.setSelectedAccount({
      accountNo: creditCard.cardNo,
      ...creditCard,
    });

    this.router.navigateByUrl('/accountServices/services/accountSummary/accountDetails');
  }

  viewSupplementaryCard($event: MouseEvent, id: any) {
    $event.stopPropagation();
    this.creditCardService
      .getSupplementaryCards()
      .pipe(takeUntil(this.unSub$))
      .subscribe((data) => {
        this.supplementaryCardsData = data;
        this.isShowSupplementaryCard = true;
      });
  }

  viewNearestDueModal($event: MouseEvent) {
    $event.stopPropagation();
    this.creditCardService
      .getNearestDueData()
      .pipe(takeUntil(this.unSub$))
      .subscribe((data) => {
        this.nearestDueData = data;
        this.isShowNearestDueModal = true;
      });
  }

  viewTopUnbilledModal($event: MouseEvent) {
    $event.stopPropagation();
    this.creditCardService
      .getTopUnbilledData()
      .pipe(takeUntil(this.unSub$))
      .subscribe((data) => {
        this.topUnbilledData = data;
        this.isShowTopUnbilledModal = true;
      });
  }

  viewRecentCreditsModal($event: MouseEvent, id) {
    $event.stopPropagation();
    this.recentCreditsData = this.creditCardData.find((a) => a.id === id);
    this.recentCreditsData.colDataURL =
      this.creditCardService.URL_CONST.VIEWRECENTCREDITS_COLDEF_URL;
    this.recentCreditsData.rowData = this.creditCardData.find(
      (a) => a.id === id,
    )?.recentCreditsData;
    this.isShowRecentCreditsModal = true;
  }

  ngOnDestroy(): void {
    this.unSub$.next();
    this.unSub$.complete();
  }

  cardClick(creditCard) {
    this.creditCardData.map((a) => {
      a === creditCard ? (creditCard.isOpen = !creditCard.isOpen) : (a.isOpen = false);
    });
  }
  paymentHistory($event: MouseEvent, id) {
    // this.isShowMoreOptions = false;

    $event.stopPropagation();
    this.paymentHistoryData = this.creditCardData.find((a) => a.id === id);
    this.paymentHistoryData.colDataURL =
      this.creditCardService.URL_CONST.VIEWRECENTCREDITS_COLDEF_URL;
    const rowData = this.creditCardData.find((a) => a.id === id)?.recentCreditsData;
    this.paymentHistoryData.rowData = rowData.filter(
      (a) => lowerCase(a.creditType) != 'cashback' && lowerCase(a.creditType) != 'refund',
    );
    this.isShowPaymentHistoryModal = true;
  }

  onPageChange(data: any) {
    this.getCreditCards(data);
  }
}
