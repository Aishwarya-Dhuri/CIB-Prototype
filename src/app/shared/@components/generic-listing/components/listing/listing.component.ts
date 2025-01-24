import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ListType } from '../../models/list-type.model';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
})
export class ListingComponent implements OnInit, OnDestroy {
  @Input() parentComponentRef: any;
  @Input() topTemplate: TemplateRef<any>;
  @Input() bottomTemplate: TemplateRef<any>;
  @Input() entityName?: string = '';
  @Input() showInitiate?: boolean = true;

  loadingList: boolean = false;

  viewport: string;
  listingTypes: ListType[];
  selectedList: ListType;
  selectedRows: any[];
  selectedRowIds: any[];

  isModalFromOtherComponent: boolean;
  tempSelectedRowIds: any[];

  rejectReason: string;

  rowData: any[] = [];

  gridOptions: any;
  @ViewChild('genericListing') genericListingGrid: any;

  isShowRejectReasonModal: boolean;

  isOpenConfirm: boolean;
  confirmMessage: string;
  confirmBtnCaption: string;
  confirmSubject: Subject<boolean>;

  constructor(
    private httpService: HttpService,
    private menuService: MenuService,
    private listingService: ListingService,
    private viewportService: ViewportService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
    });

    this.entityName = this.entityName ? this.entityName : this.menuService.getSelectedEntityName();

    this.gridOptions = {
      // rowModelType: 'clientSide',
      context: { componentParent: this.parentComponentRef },
    };

    if (!this.menuService.getSelectedServiceUrl()) {
      this.router.navigateByUrl('dashboard/consolidated');
    }
    this.getListingTypes();
  }

  getListingTypes() {
    const url = this.menuService.getSelectedServiceUrl() + '/private/getAllCount';
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
    });
  }

  onSelectAll(isSelectAll: boolean) {
    if (this.genericListingGrid) {
      if (isSelectAll) {
        this.genericListingGrid.selectAllRow();
      } else {
        this.genericListingGrid.deselectAllRow();
      }
    }
  }

  updateUrls(): void {
    if (this.parentComponentRef.updateUrls) {
      this.listingTypes = this.parentComponentRef.updateUrls(this.listingTypes);
    } else {
      this.listingTypes.forEach((listType) => {
        listType.colDefUrl = this.menuService.getSelectedServiceUrl() + '/private/getColDefs';
        listType.colDefReq = {
          dataMap: {
            listType: listType.code,
            loginType: this.userService.loginPreferenceDetails.loginType,
          },
        };
        listType.rowDataUrl =
          this.menuService.getSelectedServiceUrl() + '/private/' + listType.rowDataUrl;
      });
    }
  }

  onListTypeClick(listType: ListType) {
    /* if(this.selectedList === listType)
      this.selectedList = null;
    else {*/
    this.setSelectedList(listType);
    this.refresh(true);
    /* } */
  }

  refresh(isSkipListingType?: boolean) {
    if (!isSkipListingType) this.getListingTypes();
    this.resetRowSelections();
    this.genericListingGrid.refreshGridList();
  }

  setSelectedList(listType: ListType) {
    // this.loadingList = true;

    this.selectedList = null;
    this.resetRowSelections();

    setTimeout(() => {
      this.listingService.setSelectedList(listType);
      this.listingService.setSelectedListCode(listType.code);

      if (this.listingService.getSelectedListCode().indexOf('PENDINGLIST') != -1)
        this.gridOptions.rowSelection = 'multiple';
      else this.gridOptions.rowSelection = false;

      this.selectedList = listType;
      if (this.parentComponentRef.setSelectedList) {
        this.parentComponentRef.setSelectedList(listType);
      }

      // this.getRowData(listType.rowDataUrl);
    });
  }

  getRowData(rowDataUrl: string) {
    this.httpService.httpPost(rowDataUrl).subscribe((res: any) => {
      this.rowData = res.data;

      setTimeout(() => {
        this.loadingList = false;
      });
    });
  }

  onInitiateClick() {
    this.parentComponentRef.navigateToInitiate();
  }

  isBulkActionApplicable(): boolean {
    return (
      this.selectedList &&
      (this.selectedList.code.indexOf('PENDINGLIST') != -1 ||
        this.selectedList.code.indexOf('REJECTEDLIST') != -1) &&
      this.selectedRowIds.length > 0
    );
  }

  rowSelected($event: any): void {
    this.resetRowSelections();
    this.selectedRows = this.genericListingGrid.getSelectedRows();
    this.selectedRows.forEach((row) => {
      this.selectedRowIds.push(row[this.genericListingGrid.columnDefs[0].field]);
    });
  }

  resetRowSelections() {
    this.selectedRows = [];
    this.selectedRowIds = [];
    this.isModalFromOtherComponent = false;
    this.tempSelectedRowIds = [];
  }

  onAthorizedAllClick() {
    this.parentComponentRef
      .authorizeAll(this.selectedRowIds)
      .subscribe((responseStatus: number) => {
        if (responseStatus == 0) {
          this.refresh();
        }
      });
  }

  onDeleteAllClick() {
    this.showConfirmModal('Are you sure you want to delete All Selected Rows?', 'DELETE').subscribe(
      (isConfirm: boolean) => {
        if (isConfirm) {
          this.parentComponentRef.deleteAll([this.selectedRowIds]);
        }
      },
    );
  }

  onAcceptRejectAllClick() {
    this.parentComponentRef.acceptRejectAll(this.selectedRowIds);
  }

  processRejection(reason: string) {
    this.parentComponentRef
      .rejectAll(
        this.isModalFromOtherComponent ? this.tempSelectedRowIds : this.selectedRowIds,
        reason,
      )
      .subscribe((responseStatus: number) => {
        if (responseStatus == 0) {
          this.refresh();
        }
      });
  }

  onRejectAllClick() {
    this.showRejectReasonModal(false);
  }

  showRejectReasonModal(isModalFromOtherComponent: boolean, ids?: string[]): void {
    this.rejectReason = '';
    this.isShowRejectReasonModal = true;
    this.isModalFromOtherComponent = isModalFromOtherComponent;
    if (this.isModalFromOtherComponent) {
      this.tempSelectedRowIds = ids;
    }
  }

  showConfirmModal(confirmMessage: string, confirmBtnCaption?: string): Observable<boolean> {
    this.confirmSubject = new Subject<boolean>();
    this.confirmMessage = confirmMessage;
    this.confirmBtnCaption = confirmBtnCaption ? confirmBtnCaption : null;
    this.isOpenConfirm = true;
    return this.confirmSubject.asObservable();
  }

  onConfirm(isConfirm: boolean) {
    this.confirmSubject.next(isConfirm);
    this.confirmSubject.complete();
  }

  onGridReady(e: any) {}

  ngOnDestroy(): void {}
}
