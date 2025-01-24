import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { AccCurrencyRendererComponent } from '../acc-currency-renderer/acc-currency-renderer.component';
import { AccountSummaryListingComponent } from '../account-summary-listing/account-summary-listing.component';
import { AccountSummeryActionsRendererComponent } from '../account-summery-actions-renderer/account-summery-actions-renderer.component';
import { RenderAccountNoComponent } from '../render-account-no/render-account-no.component';
import { StatusWithStarRendererComponent } from '../status-with-star-renderer/status-with-star-renderer.component';

@Component({
  selector: 'app-account-summary-child-listing',
  templateUrl: './account-summary-child-listing.component.html',
  styleUrls: ['./account-summary-child-listing.component.scss'],
})
export class AccountSummaryChildListingComponent implements OnInit, ICellRendererAngularComp {
  cardData: any[] = [];

  @ViewChild('accountSummaryChild') accountSummaryChildGrid: any;

  @Input('listType') listType? = 'grid';

  currentPage: number = 1;
  itemPerPage: number = 6;

  numberOfPages = 1;

  loading = false;

  viewport: string;

  reqData!: any;

  rowData: any[] = [];

  parentRef!: AccountSummaryListingComponent;

  gridOptions = {
    rowModelType: 'clientSide',
    frameworkComponents: {
      renderAccountNumber: RenderAccountNoComponent,
      accCurrencyRenderer: AccCurrencyRendererComponent,
      statusWithStarRenderer: StatusWithStarRendererComponent,
      accountSummeryActions: AccountSummeryActionsRendererComponent,
    },
  };

  constructor(private viewportService: ViewportService, private httpService: HttpService) {}

  ngOnInit(): void {
    this.loading = true;
    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
      if (viewport == 'mobile') {
        this.listType = 'grid';
      }
    });
  }

  agInit(params: any): void {
    this.reqData = params.data;
    this.parentRef = params.context.componentParent;
    console.log(params.data);

    this.httpService;

    const data = { dataMap: { accountId: this.reqData.id } };

    this.httpService
      .httpPost('accountServices/services/accountSummary/private/getDebitCardData ', data)
      .subscribe((response: any) => {
        this.rowData = response.data.map((data: any) => {
          data['isShow'] = false;
          return data;
        });

        this.numberOfPages = Math.ceil(this.rowData.length / this.itemPerPage);

        this.setCardData();

        this.loading = false;
      });
  }

  refresh(params: any): boolean {
    return false;
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
    console.log(rowData);
    this.parentRef.showMoreActions(top, left, rowData);
  }
}
