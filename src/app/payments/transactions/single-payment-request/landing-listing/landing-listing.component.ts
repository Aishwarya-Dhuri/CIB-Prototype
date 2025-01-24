import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-landing-listing',
  templateUrl: './landing-listing.component.html',
  styleUrls: ['./landing-listing.component.scss'],
})
export class LandingListingComponent implements OnInit {
  @Input('listTypes') transactionsListTypes: any = [];

  showSelectedTab = false;
  viewport: string;
  selectedList: any;
  listType = 'grid';
  searchText: string;

  @ViewChild('listing') listing: any;
  listingContext: any = { componentParent: this };

  allCardListData: any = [];
  cardListData: any = [];
  currentCardPage: number = 1;

  constructor(
    private httpService: HttpService,
    private viewportService: ViewportService,
    private viewService: ViewService,
    private router: Router,
    private menuService: MenuService,
    private toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
      this.showSelectedTab = false;

      if (viewport == 'web') {
        this.listType = 'grid';
      } else {
        this.listType = 'card';
      }
    });

    this.selectedList = this.transactionsListTypes[0];
    this.onListTypeChange(this.listType);
  }

  selectListing(list: any) {
    this.selectedList = list;
    this.onListTypeChange(this.listType);
  }

  onListTypeChange(listType: string, paginationData?) {
    //TODO:Remove other API for card view same API should be use OR proper pagination should be thr in existing API
    this.listType = listType;
    paginationData = paginationData || {};
    this.currentCardPage = 1;
    if (this.listType === 'card') {
      this.cardListData = [];
      this.httpService.httpPost(this.selectedList.cardDataUrl).subscribe((response) => {
        this.allCardListData = response.data;
        if (response.totalRecords > 0) {
          /*startRow: 0,endRow: 10,*/
          this.cardListData = this.allCardListData.slice(
            paginationData.startRow || 0,
            paginationData.endRow || 8,
          );
        } else {
          this.cardListData = this.allCardListData;
        }
      });
    } else if (this.listing) {
      this.listing.refreshGridList();
    }
  }
  changeCardPage(pageNumber) {
    const start = (pageNumber - 1) * 8;
    if (pageNumber < 1 || start > this.allCardListData.length) return;
    const last =
      pageNumber * 8 > this.allCardListData.length ? this.allCardListData.length : pageNumber * 8;
    this.cardListData = this.allCardListData.slice(start, last);
    this.currentCardPage = pageNumber;
  }
  /*nextPage(pageNumber) {
    const start = (pageNumber) * 8;
    if (pageNumber < 1 || start > this.allCardListData.length) return;
    const last =
      (pageNumber * 8)+8 > this.allCardListData.length ? this.allCardListData.length : (pageNumber * 8)+8;
    this.cardListData = this.allCardListData.slice(start, last);
    this.currentCardPage = pageNumber;
  };

  previousPage(pageNumber){
    const start = (pageNumber) * 8;
    if (pageNumber < 0 || start > this.allCardListData.length) return;
    const last =
      (pageNumber * 8)+8 > this.allCardListData.length ? this.allCardListData.length : (pageNumber * 8)+8;
    this.cardListData = this.allCardListData.slice(start, last);
    this.currentCardPage = pageNumber;
  }*/

  performGridOperation(actionName: string, id: string) {
    alert('Performing ' + actionName + ' with id : ' + id);
  }

  onPageChange(data) {
    this.onListTypeChange(this.listType, data);
  }

  navigateInitiate(): void {
    this.router.navigateByUrl(this.menuService.getSelectedServiceUrl() + '/initiate');
  }

  useDraft(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('DRAFT');
    this.navigateInitiate();
  }

  useTemplate(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('TEMPLATE');
    this.navigateInitiate();
  }

  intiateFrequentPayment(id: string, initiateMode: string): void {
    this.router.navigateByUrl(this.router.url + '/initiate', {
      state: {
        id: id,
        initiateMode: initiateMode,
      },
    });
  }

  // deleteFrequentPayment(id: string): void {
  //   const reqData = { dataMap: { ids: id } };
  //   this.httpService
  //     .httpPost('payments/transactions/singlePaymentRequest/private/delete', reqData)
  //     .subscribe((response) => {
  //       this.toasterService.showToaster({
  //         severity: 'success',
  //         detail: 'Deleted Sucessfully',
  //       });
  //     });
  // }

  intiateRecentPayment(id: string, initiateMode: string): void {
    this.router.navigateByUrl(this.router.url + '/initiate', {
      state: {
        id: id,
        initiateMode: initiateMode,
      },
    });
  }

  initiateUpcomingPayment(id: string, initiateMode: string): void {
    this.router.navigateByUrl(this.router.url + '/initiate', {
      state: {
        id: id,
        initiateMode: initiateMode,
      },
    });
  }

  editUpcomingPayment(id: string, initiateMode: string): void {
    this.router.navigateByUrl(this.router.url + '/initiate', {
      state: {
        id: id,
        initiateMode: initiateMode,
      },
    });
    this.viewService.setMode('EDIT');
  }

  disableUpcomingPayment(id: string): void {
    const reqData = { dataMap: { id: id } };
    this.httpService
      .httpPost('payments/transactions/singlePaymentRequest/private/disable', reqData)
      .subscribe((response) => {
        this.listing.refreshGridList();
      });
  }

  deleteDraft(id: string): void {
    let data = { dataMap: { id: id } };
    this.httpService
      .httpPost('payments/transactions/singlePaymentRequest/private/deleteDraft', data)
      .subscribe((res) => {
        this.listing.refreshGridList();
      });
  }

  deleteTemplate(id: string): void {
    let data = { dataMap: { id: id } };
    this.httpService
      .httpPost('payments/transactions/singlePaymentRequest/private/deleteTemplate', data)
      .subscribe((res) => {
        this.listing.refreshGridList();
      });
  }
}
