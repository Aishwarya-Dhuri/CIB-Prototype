import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { GenericListingComponent } from 'src/app/shared/@components/generic-listing/generic-listing.component';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { MerchantPayment } from './@model/merchant-payment.model';

@Component({
  selector: 'app-merchant-payment',
  templateUrl: './merchant-payment.component.html',
  styleUrls: ['./merchant-payment.component.scss'],
})
export class MerchantPaymentComponent extends GenericListingComponent implements OnInit {
  loading: boolean = false;
  loadingList: boolean = false;

  periodForMerchantsList = [
    { id: 'This Week', displayName: 'This Week' },
    { id: 'This Month', displayName: 'This Month' },
    { id: 'Previous Month', displayName: 'Previous Month' },
  ];
  selectedPeriodForMerchants: string = 'This Month';
  selectedPeriodForCategoryWiseAnalysis: string = 'This Month';

  topMerchatChartType: string = 'transactionCount';

  topMerchantsCountWiseDataList = [
    {
      xLabel: 'Amazon',
      yLabel0: 40,
      yLabel1: 20,
      yLabel2: 15,
    },
    {
      xLabel: 'Filpkart',
      yLabel0: 20,
      yLabel1: 15,
      yLabel2: 10,
    },
    {
      xLabel: 'eBay',
      yLabel0: 50,
      yLabel1: 10,
      yLabel2: 14,
    },
  ];
  topMerchantsAmountWiseDataList = [
    {
      xLabel: 'Amazon',
      yLabel0: 4000,
      yLabel1: 2000,
      yLabel2: 1500,
    },
    {
      xLabel: 'Filpkart',
      yLabel0: 2000,
      yLabel1: 1500,
      yLabel2: 1000,
    },
    {
      xLabel: 'eBay',
      yLabel0: 5000,
      yLabel1: 1000,
      yLabel2: 1400,
    },
  ];
  categoryWiseSpendAnalysisData = [
    {
      spendType: 'Travel',
      spend: 2000,
      currency: 'INR',
    },
    {
      spendType: 'Food',
      spend: 5000,
      currency: 'INR',
    },
    {
      spendType: 'Medical',
      spend: 2000,
      currency: 'INR',
    },
    {
      spendType: 'Other',
      spend: 1000,
      currency: 'INR',
    },
  ];
  topMerchantOptions: any;
  categoryWiseSpendOptions: any;
  columnDefs: any[] = [];
  rowDataUrl: string = '';
  selectedFilter: string = 'Review List';
  colDefReqBody: any = {
    dataMap: {
      listType: 'REVIEWLIST',
      loginType: this.userService.loginPreferenceDetails.loginType,
    },
  };

  filters = [];
  gridOptions = {
    // rowModelType: 'clientSide',
    context: { componentParent: this },
  };
  formData: MerchantPayment = new MerchantPayment();
  isShowViewModal: boolean = false;

  constructor(
    protected actionsService: ActionService,
    protected breadcrumbService: BreadcrumbService,
    protected menuService: MenuService,
    protected router: Router,
    protected viewService: ViewService,
    protected httpService: HttpService,
    protected listingService: ListingService,
    private currencyPipe: CurrencyPipe,
    private userService: UserService,
  ) {
    super(actionsService, breadcrumbService, menuService, router, viewService, httpService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loading = true;
    this.getTopMerchants();
    this.getAllCount();
    this.getSelectedListing('REVIEWLIST', 'getAuthorizedList');
    this.categoryWiseSpendOptions = {
      data: this.categoryWiseSpendAnalysisData,
      labelKey: 'spendType',
      angleKey: 'spend',
      formatter: (params: any) => {
        return `${
          this.categoryWiseSpendAnalysisData[params.itemId].spendType
        }\t\t Amount : ${this.currencyPipe.transform(
          this.categoryWiseSpendAnalysisData[params.itemId].spend,
          this.categoryWiseSpendAnalysisData[params.itemId].currency + ' ',
        )}`;
      },
      legend: {
        position: 'bottom',
      },
    };
    this.loading = false;
  }

  changeFilter(selectedFilter: any, event: any): void {
    this.selectedFilter = selectedFilter.displayName;
    this.getSelectedListing(selectedFilter.code, selectedFilter.rowDataUrl);
  }

  getSelectedListing(selectedListing: string, rowDataUrl: string): void {
    this.loadingList = true;
    this.colDefReqBody = {
      dataMap: {
        listType: selectedListing,
        loginType: this.userService.loginPreferenceDetails.loginType,
      },
    };
    this.rowDataUrl = 'accountServices/services/merchantPayment/private/' + rowDataUrl;
    setTimeout(() => {
      this.loadingList = false;
    }, 100);
  }

  getAllCount(): void {
    this.httpService
      .httpPost('accountServices/services/merchantPayment/private/getAllCount', {})
      .subscribe((res) => {
        this.filters = res.dataList;
      });
  }

  view(id: string): void {
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('accountServices/services/merchantPayment/private/view', data)
      .subscribe((formData: MerchantPayment) => {
        this.viewService.clearAll();
        this.formData = formData;
        this.isShowViewModal = true;
      });
  }
  getTopMerchants() {
    this.topMerchantOptions = {
      data:
        this.topMerchatChartType === 'transactionCount'
          ? this.topMerchantsCountWiseDataList
          : this.topMerchantsAmountWiseDataList,
      chartType: 'column',
      xKey: 'xLabel',
      xLabel: 'Account',
      yKeys: ['yLabel0', 'yLabel1', 'yLabel2'],
      yLabels: ['Processing', 'Rejected', 'Successful'],
      chartShadow: false,
      categoryAxesPosition: 'bottom',
      categoryAxesTitle: '',
      categoryAxesRotationAngle: '',
      numberAxesPosition: ['left'],
      numberAxesTitle: [''],
      numberAxesRotationAngle: [''],
      legendPosition: 'bottom',
      legendItemMarkerShape: 'circle',
      legendItemMarkerSize: 8,
      legendItemLabelSize: 12,
      legendItemLabelFormatterMethodname: '',
    };
  }
}
