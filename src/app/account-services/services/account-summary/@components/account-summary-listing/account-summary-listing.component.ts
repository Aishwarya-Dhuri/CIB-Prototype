import {
  Component,
  Output,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { ApsTranslatePipe } from 'src/app/shared/@pipes/aps-translate.pipe';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { AccCurrencyRendererComponent } from '../../@components/acc-currency-renderer/acc-currency-renderer.component';
import { AccountSummaryService } from '../../@services/account-summary.service';
import { AccountSummaryChildListingComponent } from '../account-summary-child-listing/account-summary-child-listing.component';
import { AccountSummeryActionsRendererComponent } from '../account-summery-actions-renderer/account-summery-actions-renderer.component';
import { RenderAccountNoComponent } from '../render-account-no/render-account-no.component';
import { StatusWithStarRendererComponent } from '../status-with-star-renderer/status-with-star-renderer.component';

@Component({
  selector: 'app-account-summary-listing',
  templateUrl: './account-summary-listing.component.html',
  styleUrls: ['./account-summary-listing.component.scss'],
})
export class AccountSummaryListingComponent implements OnInit, OnChanges {
  cardData: any[] = [];

  optionList: any[] = [];

  @ViewChild('accountSummary') accountSummaryGrid: any;

  @Input('listType') listType? = 'grid';

  currentPage: number = 1;
  itemPerPage: number = 6;

  totalAmount: string = '';
  totalLabel: string = '';

  numberOfPages = 1;

  loading = false;
  isShowMoreOptions = false;
  showExternalAccountDetails = false;
  showFDAdditionalDetails = false;
  showContractDetails = false;
  showRateChangeHistory = false;
  showArrearsStatement = false;
  showInterestCalculation = false;
  moreActionsStyle: any = {};
  moreActionsRowData: any;

  viewport: string;

  colDefs: any[] = [];
  rowData: any[] = [];

  @Input('summary') summary: any;
  @Input('corporate') corporate: any;
  @Output() changeSummery = new EventEmitter<any>();
  selectedSummary: string = '';

  @Input('summaryList') summaryList = [];

  gridOptions = {
    rowModelType: 'clientSide',
    frameworkComponents: {
      renderAccountNumber: RenderAccountNoComponent,
      accCurrencyRenderer: AccCurrencyRendererComponent,
      statusWithStarRenderer: StatusWithStarRendererComponent,
      accountSummeryActions: AccountSummeryActionsRendererComponent,
    },
  };

  debitCardGridOptions = {
    rowModelType: 'clientSide',
    masterDetail: true,
    detailRowHeight: 350,
    detailCellRenderer: 'accountSummaryChildListing',
    groupDefaultExpanded: 0,
    frameworkComponents: {
      accountSummaryChildListing: AccountSummaryChildListingComponent,
      renderAccountNumber: RenderAccountNoComponent,
      accCurrencyRenderer: AccCurrencyRendererComponent,
      statusWithStarRenderer: StatusWithStarRendererComponent,
      accountSummeryActions: AccountSummeryActionsRendererComponent,
    },
  };

  constructor(
    private accountSummaryService: AccountSummaryService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private httpService: HttpService,
    private viewportService: ViewportService,
    private apsTranslatePipe: ApsTranslatePipe,
    private viewService: ViewService,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
      if (viewport == 'mobile') {
        this.listType = 'grid';
      }
    });

    this.summaryList = this.summaryList.map((summary: any) => {
      return { ...summary, displayName: this.apsTranslatePipe.transform(summary.displayName) };
    });

    this.selectedSummary = this.summary ? this.summary.id : '';
  }

  changeSummarySelect(id: string) {
    const summary = this.summaryList.find((s: any) => s.id === id);
    this.changeSummery.emit(summary);
  }

  onLinkClick(account: any) {
    this.accountSummaryService.setSelectedAccount(account);

    this.accountSummaryService.setAccounts(this.rowData);

    this.router.navigate(['./accountDetails'], { relativeTo: this.route });
  }

  ngOnChanges() {
    if (this.summary) {
      this.accountSummaryService.setSummary(this.summary);

      this.selectedSummary = this.summary.id;
      this.totalAmount = this.summary.totalAmount ? this.summary.totalAmount : '';
      this.totalLabel = this.summary.totalLabel ? this.summary.totalLabel : 'Total Balance';
      this.optionList = this.summary.moreOptionsList;

      this.loading = true;

      this.currentPage = 1;

      this.httpService.httpPost(this.summary.colDefUrl).subscribe((colDefs: any[]) => {
        this.colDefs = colDefs;

        let corporateId = this.userService.userDetails.corporateId;

        if (this.corporate) {
          corporateId = this.corporate.corporateId;
        }

        const data = { dataMap: { corporateId } };

        this.httpService.httpPost(this.summary.rowDefUrl, data).subscribe((response: any) => {
          this.rowData = response.data.map((data: any) => {
            data['isShow'] = false;
            return data;
          });

          this.numberOfPages = Math.ceil(this.rowData.length / this.itemPerPage);

          this.setCardData();

          this.loading = false;
        });
      });
    }
  }

  setCardData() {
    const pageNo = this.currentPage;
    const dataLength = this.rowData.length;

    const currentIndex = (pageNo - 1) * this.itemPerPage;

    const firstIndex = pageNo === 1 ? 0 : currentIndex;

    const lastIndex =
      firstIndex + this.itemPerPage > dataLength ? dataLength : firstIndex + this.itemPerPage;

    this.cardData = this.rowData.slice(firstIndex, lastIndex);
  }

  next() {
    if (this.currentPage < this.numberOfPages) {
      this.currentPage++;
      this.setCardData();
    }
  }

  previous() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setCardData();
    }
  }

  showMoreActions(top: number, left: number, rowData: any) {
    this.moreActionsStyle = {
      position: 'absolute',
      top: top + 'px',
      left: left - 88 + 'px',
      width: 'auto',
      'z-index': '11',
      padding: '0.5rem',
      'box-shadow': '0 0 10px #999',
    };

    this.moreActionsRowData = rowData;

    this.isShowMoreOptions = true;
  }

  onClickAction(method: string) {
    if (this[method]) {
      this[method]();
    } else {
      console.error('Kindly implement ' + method + '()');
    }
    this.isShowMoreOptions = false;
  }

  onSinglePaymentInitiation() {
    this.viewService.setExtraData({
      id:
        this.selectedSummary == 'casa'
          ? this.moreActionsRowData.id
          : this.moreActionsRowData.accountId,
    });
    this.viewService.setMode('PREFILLED');

    this.menuService.setSelectedServiceUrl('payments/transactions/singlePaymentRequest');

    this.router.navigate(['/payments/transactions/singlePaymentRequest/initiate'], {
      relativeTo: this.route,
    });
  }

  onFdInitiation() {
    this.viewService.setExtraData({
      id:
        this.selectedSummary == 'casa'
          ? this.moreActionsRowData.id
          : this.moreActionsRowData.accountId,
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
        this.selectedSummary == 'casa'
          ? this.moreActionsRowData.id
          : this.moreActionsRowData.accountId,
    });
    this.viewService.setMode('PREFILLED');

    this.menuService.setSelectedServiceUrl('accountServices/services/accountStatement');
    this.router.navigate(['/accountServices/services/accountStatement'], {
      relativeTo: this.route,
    });
  }

  onFavouriteClick(data: any) {}

  onViewContractDetails() {
    this.showContractDetails = true;
  }

  onRateChangeHistory() {
    this.showRateChangeHistory = true;
  }

  onArrearsStatement() {
    this.showArrearsStatement = true;
  }

  onMiniStatement() {}

  onRepaymentSchedule() {}

  onInterestCalculation() {
    this.showInterestCalculation = true;
  }

  onCreditCardPayment() {
    this.viewService.setExtraData({
      ...this.moreActionsRowData,
      cardNo: this.moreActionsRowData.creditCardNumber,
      currency: this.moreActionsRowData.currency,
      cardType: this.moreActionsRowData.cardType,
      embossedName: this.moreActionsRowData.embossedName,
    });
    this.viewService.setMode('PREFILLED');

    this.menuService.setSelectedServiceUrl('accountServices/creditCard/creditCardBillPayment');
    this.router.navigate(['/accountServices/creditCard/creditCardBillPayment'], {
      relativeTo: this.route,
    });
  }

  onCreditCardStatementDownload() {
    this.viewService.setExtraData({
      ...this.moreActionsRowData,
      cardNo: this.moreActionsRowData.creditCardNumber,
      currency: this.moreActionsRowData.currency,
      cardType: this.moreActionsRowData.cardType,
      embossedName: this.moreActionsRowData.embossedName,
    });
    this.viewService.setMode('PREFILLED');

    this.menuService.setSelectedServiceUrl(
      'accountServices/creditCard/creditCardStatementDownload',
    );
    this.router.navigate(['/accountServices/creditCard/creditCardStatementDownload'], {
      relativeTo: this.route,
    });
  }

  onAdditionalDetails() {
    this.showFDAdditionalDetails = true;
  }

  onFdAdvices() {
    // adcb
  }

  onChangeMaturityInstructions() {
    this.viewService.setExtraData({
      id: this.moreActionsRowData.id,
    });
    this.viewService.setMode('PREFILLED');

    this.menuService.setSelectedServiceUrl('accountServices/fixedDeposit/maturityInstructions');
    this.router.navigate(['/accountServices/fixedDeposit/maturityInstructions'], {
      relativeTo: this.route,
    });
  }

  onDebitCardControl() {
    this.viewService.setId(this.moreActionsRowData.id);
    this.viewService.setMode('EDIT');
    this.viewService.setExtraData({ displayName: 'Card List', link: 'cardLimitControl' });
    this.menuService.setSelectedServiceUrl('accountServices/debitCard/debitCardControl');
    this.router.navigate(['/accountServices/debitCard/debitCardControl'], {
      relativeTo: this.route,
    });
  }

  onDebitCardReissue() {
    this.viewService.setId(this.moreActionsRowData.id);
    this.viewService.setMode('REISSUE');
    this.menuService.setSelectedServiceUrl('accountServices/debitCard/reIssueDebitCard');
    this.router.navigate(['/accountServices/debitCard/reIssueDebitCard'], {
      relativeTo: this.route,
    });
  }

  onDebitCardCancellation() {
    this.viewService.setId(this.moreActionsRowData.id);
    this.viewService.setMode('CANCELLATION');
    this.menuService.setSelectedServiceUrl('accountServices/debitCard/debitCardCancellation');
    this.router.navigate(['/accountServices/debitCard/debitCardCancellation'], {
      relativeTo: this.route,
    });
  }

  onViewAccountDetails() {
    this.showExternalAccountDetails = true;
  }

  onDownloadAccountDetails() {
    this.httpService.httpDownload('accountDetails/account-details.pdf');
  }

  onEmailAccountDetails() {}
}
