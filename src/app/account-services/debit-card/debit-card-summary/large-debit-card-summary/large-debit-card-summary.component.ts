import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { DebitCardService } from '../@services/debit-card.service';

@Component({
  selector: 'app-large-debit-card-summary',
  templateUrl: './large-debit-card-summary.component.html',
  styleUrls: ['./large-debit-card-summary.component.scss'],
})
export class LargeDebitCardSummaryComponent implements OnInit {
  accountNumber: string;
  accountList$: Observable<any[]>;
  allDebitCardList: any[] = [];
  totalRecords: number;
  debitCardData: any[] = [];
  isCardUtilizationModalShow: boolean = false;
  isDebitInstructionsModalShow: boolean = false;
  isShowDebitInstructionsDetails: boolean = false;
  widgetType: string = 'grid';

  colDefUrl = 'accountServices/debitCard/private/allDebitInstructionsColDef';
  dataUrl = 'accountServices/debitCard/private/allDebitInstructionsData';

  gridOptions = {
    context: { componentParent: this },
  };

  allCardUtilizationList: any[];
  cardUtilizationColDefsUrl = 'accountServices/debitCard/private/allCardUtilizationColDef';

  allDebitIntructionsColDefs = 'accountServices/debitCard/private/allDebitInstructionsColDef';

  responsiveOptions: any[];
  chartOptions: any;
  chartData = [
    { itemId: '1', label: 'Total Spends', count: '90' },
    { itemId: '2', label: 'Total Available', count: '10' },
  ];
  options: any;

  constructor(
    private debitCardService: DebitCardService,
    private router: Router,
    private viewService: ViewService,
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnInit(): void {
    const chartData = [
      { itemId: '1', label: 'Total Spends', count: '90' },
      { itemId: '2', label: 'Total Available', count: '10' },
    ];
    this.getAccountList();
    this.getAllDebitCards();
    this.getFilteredDebitCards();
    this.chartOptions = {
      autoSize: true,
      data: chartData,
      legend: {
        enabled: false,
      },
      labelKey: 'label',
      angleKey: 'count',
    };
  }

  private getFilteredDebitCards(paginationData?: any) {
    this.debitCardService.getDebitCardList(paginationData).subscribe((response: any) => {
      this.debitCardData = response.data;
      this.totalRecords = response.lastRow;
    });
  }

  getAccountList(): void {
    this.accountList$ = this.debitCardService.getAccounts().pipe(
      map((accountList: any[]) => {
        accountList.unshift({ id: 'All', displayName: 'Select All' });
        return accountList;
      }),
    );
  }

  getAllDebitCards(): void {
    this.debitCardService.getAllDebitCards().subscribe((res) => {
      this.allDebitCardList = res;
      this.options = {
        data: this.allDebitCardList.slice(0, 5),
        labelKey: 'cardNumber',
        angleKey: 'totalAmountDebited',
        formatter: (params: any) => {
          return `${this.allDebitCardList[params.itemId].cardNumber}\t\t Amount : ${
            this.allDebitCardList[params.itemId].totalAmountDebited
          }`;
        },
        padding: {
          left: 12,
          right: 12,
          top: 12,
          bottom: 12,
        },
        legend: {
          spacing: 6,
          layoutHorizontalSpacing: 0,
          layoutVerticalSpacing: 6,
        },
      };
    });
  }

  viewAllCardUtilizationModal(): void {
    this.isCardUtilizationModalShow = true;
  }

  onPageChange(data: any) {
    this.getFilteredDebitCards(data);
  }

  onAccountChange(selectedAccount: any): void {}

  applyNewCard(): void {}

  viewTxnDetails(x): void {}

  cardClick(debitCard) {
    this.debitCardData.map((a) => {
      a === debitCard ? (debitCard.isOpen = !debitCard.isOpen) : (a.isOpen = false);
    });
  }
  onQuickLinkClick(selectedLink: string, id: any): void {
    if (selectedLink === 'reIssueDebitCard') {
      this.router.navigateByUrl('accountServices/debitCard/reIssueDebitCard');
      this.viewService.setId(id);
      this.viewService.setMode('REISSUE');
    } else {
      this.router.navigateByUrl('accountServices/debitCard/debitCardControl');
      this.viewService.setId(id);
      this.viewService.setMode('EDIT');
      const x = { displayName: 'Card List', link: selectedLink };
      this.viewService.setExtraData(x);
    }
  }
}
