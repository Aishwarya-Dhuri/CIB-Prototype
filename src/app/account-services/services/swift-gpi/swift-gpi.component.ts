import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { GenericListingComponent } from 'src/app/shared/@components/generic-listing/generic-listing.component';
import { ListType } from 'src/app/shared/@components/generic-listing/models/list-type.model';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { SearchBy, UploadFile } from './@models/swift-gpi.model';

@Component({
  selector: 'app-swift-gpi',
  templateUrl: './swift-gpi.component.html',
  styleUrls: ['./swift-gpi.component.scss'],
})
export class SwiftGpiComponent implements OnInit {
  @ViewChild('swiftGpiListing') swiftGpiListingGrid!: AgGridListingComponent;

  loading: boolean = false;
  loadingListing: boolean = false;
  isShowUploadedSearchResult: boolean = false;
  selectedTab: string = 'Manual';
  swiftPaymentSummaryTab: string = 'Incoming';
  swiftCurrencyPaymentSummaryTab: string = 'Incoming';
  paymentSummaryDuration: string = 'This Week';
  currencyPaymentSummaryDuration: string = 'This Week';
  searchBy: SearchBy = new SearchBy();
  uploadFormData: UploadFile = new UploadFile();
  formData: any;
  viewData: any = {};

  swiftPaymentSummaryCompleted: number = 40;
  swiftPaymentSummaryInProgress: number = 20;
  swiftPaymentSummaryOnHold: number = 10;
  swiftPaymentSummaryRejected: number = 5;

  isShowAdvanceSearch: boolean = false;
  isShowViewManualSearchModal: boolean = false;
  isViewAllCurrencyWiseSwiftPaymentSummary: boolean = false;

  currencyWiseSwiftPaymentSummary = [
    { currency: 'INR', count: '20', amount: '40000', chargePaid: '350' },
    { currency: 'GBR', count: '10', amount: '14000', chargePaid: '350' },
    { currency: 'BHD', count: '12', amount: '300', chargePaid: '350' },
    { currency: 'USD', count: '5', amount: '2000', chargePaid: '50' },
  ];

  searchByCriteriaData!: any;

  gridOptions: any = {
    context: { componentParent: this },
  };

  listingTypes: ListType[] = [];
  selectedList: ListType;

  constructor(
    protected actionsService: ActionService,
    protected breadcrumbService: BreadcrumbService,
    protected menuService: MenuService,
    protected userService: UserService,
    protected router: Router,
    protected httpService: HttpService,
    protected listingService: ListingService,
    private toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.updateActionsAndBreadcrumbs();

    this.getListingTypes();
  }

  private updateActionsAndBreadcrumbs() {
    let actions: Actions = {
      heading: 'SWIFT GPI',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    let breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Services' },
      { label: 'Service' },
      { label: 'SWIFT GPI' },
      { label: 'Progress Tracker' },
    ];
    if (this.isShowUploadedSearchResult) {
      actions = {
        heading: 'SWIFT GPI',
        subHeading: null,

        refresh: true,

        download: false,
        print: true,
        backBtn: true,
        relationshipManager: true,
        quickLinks: true,
        componentRef: this,
      };
      breadcrumbs = [
        { icon: 'fa-home' },
        { label: 'Account Services' },
        { label: 'Service' },
        { label: 'SWIFT GPI' },
        { label: 'Progress Tracker' },
        { label: 'Uploaded Search Result' },
      ];
    }

    this.actionsService.setActions(actions);
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }

  back() {
    this.isShowUploadedSearchResult = false;

    this.updateActionsAndBreadcrumbs();
  }

  getListingTypes() {
    const url = 'accountServices/services/swiftGpi/private/getAllCount';
    this.listingTypes = [];
    const data = {};
    this.httpService.httpPost(url, data).subscribe((response) => {
      this.listingTypes = response.dataList;
      this.updateUrls();

      if (this.listingService.getSelectedListCode()) {
        this.listingTypes.forEach((listType) => {
          if (listType.code === this.listingService.getSelectedListCode()) {
            this.setSelectedList(listType);
          }
        });
      } else if (this.listingTypes.length > 0) {
        this.setSelectedList(this.listingTypes[0]);
      }

      this.loading = false;
    });
  }

  updateUrls(): void {
    this.listingTypes.forEach((listType) => {
      listType.colDefUrl = 'accountServices/services/swiftGpi/private/getColDefs';
      listType.colDefReq = {
        dataMap: {
          listType: listType.code,
          loginType: this.userService.loginPreferenceDetails.loginType,
        },
      };
      listType.rowDataUrl = 'accountServices/services/swiftGpi/private/' + listType.rowDataUrl;
    });
  }

  setSelectedList(listType: ListType) {
    this.listingService.setSelectedList(listType);
    this.listingService.setSelectedListCode(listType.code);

    this.gridOptions.rowSelection = false;

    this.selectedList = listType;

    this.refresh();
  }

  onListTypeClick(listType: ListType) {
    this.setSelectedList(listType);
  }

  onFileUploaded(file: any[]): void {
    this.uploadFormData.document = file;
  }

  reset(): void {
    if (this.selectedTab === 'Manual') {
      this.searchBy = new SearchBy();
    } else {
      this.uploadFormData = new UploadFile();
    }
  }

  onReportClick(): void {
    this.router.navigateByUrl('reports/payments/generic/initiate');
  }

  search(): void {
    this.setSearchList(0);
  }

  onAdvanceSearch() {
    this.httpService
      .httpPost('accountServices/services/swiftGpi/private/getSearchResultsCount', {
        dataMap: this.searchBy,
      })
      .subscribe((response: any) => {
        const listType = {
          ...response.listType,
          rowDataReq: this.searchBy,
        };

        const listingTypeIndex: number = this.listingTypes.findIndex(
          (listType: ListType) => listType.code == response.code,
        );

        if (listingTypeIndex >= 0) {
          this.listingTypes[listingTypeIndex] = listType;
        } else {
          this.listingTypes.push(listType);
        }

        this.setSearchList(2);

        this.closeAdvanceSearch();
      });
  }

  closeAdvanceSearch() {
    this.isShowAdvanceSearch = false;
  }

  clearSearch() {
    this.listingTypes.splice(2, 1);
    this.setSearchList(0);
    this.searchBy = new SearchBy();
  }

  upload(): void {
    const uploadFormData = new FormData();

    uploadFormData.append('batchNo', this.uploadFormData.batchNo);
    uploadFormData.append('channel', this.uploadFormData.channel);
    uploadFormData.append('uploadDate', this.uploadFormData.uploadDate);
    uploadFormData.append('uploadStatus', this.uploadFormData.uploadStatus);
    uploadFormData.append('uploadedBy', this.uploadFormData.uploadedBy);
    uploadFormData.append(
      'uploadFile',
      this.uploadFormData.document[0],
      this.uploadFormData.document[0].name,
    );
    this.formData = uploadFormData;
    this.httpService
      .httpPost('accountServices/services/swiftGpi/private/create', this.formData)
      .subscribe((response) => {
        this.toasterService.showToaster({
          severity: 'success',
          detail: 'File Uploaded Successfully',
        }),
          this.setSearchList(1);
        this.uploadFormData = new UploadFile();
      });
  }

  setSearchList(index: number): void {
    this.selectedList = this.listingTypes[index];
  }

  manualSearchView(id: string): void {
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('accountServices/services/swiftGpi/private/manualSearchView', data)
      .subscribe((viewData: any) => {
        this.viewData = viewData;
        this.isShowViewManualSearchModal = true;
      });
  }

  uploadSearchView(
    id: string,
    uploadedFileName: string,
    uploadDate: string,
    channel: string,
    uploadedBy: string,
  ): void {
    this.searchByCriteriaData = {
      uploadedFileName: uploadedFileName,
      batchNo: id,
      uploadDate: uploadDate,
      channel: channel,
      uploadedBy: uploadedBy,
    };

    this.isShowUploadedSearchResult = true;

    this.updateActionsAndBreadcrumbs();
  }

  uploadedSearchView(id: string): void {
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('accountServices/services/swiftGpi/private/uploadedSearchView', data)
      .subscribe((viewData: any) => {
        this.viewData = viewData;
        this.isShowViewManualSearchModal = true;
      });
  }

  dataflow(): void {
    this.router.navigateByUrl('accountServices/services/swiftGpi/dataflow');
  }

  refresh(): void {
    this.loadingListing = true;

    setTimeout(() => {
      this.loadingListing = false;
    }, 100);
  }

  download(filePath: string): void {
    var URL = filePath
      .replace('./dummyServer', '')
      .replace('uploadedFiles', '')
      .replace(/\//g, '/');
    this.httpService.httpDownload(URL);
  }
}
