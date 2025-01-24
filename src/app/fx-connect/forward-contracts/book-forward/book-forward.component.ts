import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
// import { bookForward } from '../@models/book-forward.model';

@Component({
  selector: 'app-book-forward',
  templateUrl: './book-forward.component.html',
  styleUrls: ['./book-forward.component.scss']
})
export class BookForwardComponent implements OnInit {
  @ViewChild('letterOfCreditGrid') letterOfCreditGrid: any;

  letterOfCreditOverview: any;
  viewport: any;
  listType: any;

  constructor(private viewportService: ViewportService,
    private viewService: ViewService,
    private router: Router,
    private route: ActivatedRoute,

  ) { }


  options: any;
  // formData: bookForward = new bookForward();
  billPayment: any[] = [
    {
      madeBy: 'Forward Contract',
      value: 40,
    },
    {
      madeBy: 'Cash',
      value: 24,
    },
    {
      madeBy: 'TOM',
      value: 28,
    },
    {
      madeBy: 'Spot',
      value: 14,
    },
    // {
    //   madeBy: 'By Negotiation (SIGHT)',
    //   value: 4,
    // },
    // {
    //   madeBy: 'By Negotiation (USANCE)',
    //   value: 2,
    // },
  ];

  listingTypes = [
    {
      id: 'forward',
      displayName: 'Forward',
      colDefsUrl: 'trade/importTransactions/letterOfCredit/private/forwardContractColDefs',
      rowDefUrl: 'trade/importTransactions/letterOfCredit/private/getDraftList',
      count: 1,
    },
    {
      id: 'cash',
      displayName: 'Cash',
      colDefsUrl: 'trade/importTransactions/letterOfCredit/private/forwardContractColDefs',
      rowDefUrl: 'trade/importTransactions/letterOfCredit/private/getRecentList',
      count: 2,
    },
    {
      id: 'tom',
      displayName: 'TOM',
      colDefsUrl: 'trade/importTransactions/letterOfCredit/private/forwardContractColDefs',
      rowDefUrl: 'trade/importTransactions/letterOfCredit/private/getTemplateList',
      count: 1,
    },
    {
      id: 'spot',
      displayName: 'Spot',
      colDefsUrl: 'trade/importTransactions/letterOfCredit/private/forwardContractColDefs',
      rowDefUrl: 'trade/importTransactions/letterOfCredit/private/getRepairList',
      count: 1,
    },
  ];
  activeListing: any = this.listingTypes[0];


  ngOnInit(): void {

    if (this.viewService.getMode() && this.viewService.getId()) {
      this.router.navigate(['./initiate'], { relativeTo: this.route });
      return;
    }
    this.letterOfCreditOverview = {
      corporateAuthorized: 120,
      bankAuthorized: 24,
      toRepair: 24,
    };
    this.options = {
      formatter: (params: any) => {
        return `${this.billPayment[params.itemId].madeBy}\t\t\t\t${this.billPayment[params.itemId].value
          }`;
      },
      data: this.billPayment,
      labelKey: 'madeBy',
      angleKey: 'value',
    };
    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });

  }

  onChangeLetterOfCreditOverview(duration: any) {
    if (duration.id == 'Today') {
      this.letterOfCreditOverview = {
        corporateAuthorized: 120,
        bankAuthorized: 24,
        toRepair: 24,
      };
    } else if (duration.id == 'This Month') {
      this.letterOfCreditOverview = {
        corporateAuthorized: 420,
        bankAuthorized: 130,
        toRepair: 104,
      };
    } else {
      this.letterOfCreditOverview = {
        corporateAuthorized: 7600,
        bankAuthorized: 1450,
        toRepair: 1254,
      };
    }
  }

  onListTypeChange(listType: string) {
    this.listType = listType;
  }

  changeActiveListing(listingType: any) {
    this.activeListing = listingType;

    if (this.listType === 'grid') {
      this.letterOfCreditGrid.refreshGridList();
    }
  }


}
