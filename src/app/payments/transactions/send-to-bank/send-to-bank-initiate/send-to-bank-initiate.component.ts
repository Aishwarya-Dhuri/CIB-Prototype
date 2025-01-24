import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BatchDetailsRendererComponent } from '../@components/batch-details-renderer/batch-details-renderer.component';

@Component({
  selector: 'app-send-to-bank-initiate',
  templateUrl: './send-to-bank-initiate.component.html',
  styleUrls: ['./send-to-bank-initiate.component.scss'],
})
export class SendToBankInitiateComponent implements OnInit {
  @ViewChild('sendToBankInitGrid') sendToBankInitGrid: any;

  loading: boolean;

  showSinglePayment: boolean = false;
  showBulkPayment: boolean = false;
  showFdInitiation: boolean = false;
  showBillPayment: boolean = false;
  showWpsPayment: boolean = false;

  withRightsAccessOptionsData: any;
  withoutRightsAccessOptionsData: any;
  options: any;

  topFiveDetails: any[] = [];

  activeListing: any;
  showBatchTransactions = false;
  totalRecords: number = 0;
  criticalRecords: number = 0;

  corporate: string = 'all';

  transactionColDefs: any[] = [
    { headerName: 'Beneficiary Name', field: 'beneficiaryName' },
    { headerName: 'Total Amount', field: 'totalAmount' },
    { headerName: 'Payment Method', field: 'paymentMethod' },
    { headerName: 'Account Number', field: 'accNumber' },
  ];
  transactionRowData: any[] = [
    {
      beneficiaryName: 'Manmohan Das',
      totalAmount: '1000000',
      paymentMethod: 'Initial Fund Transfer',
      accNumber: '12349051345',
    },
    {
      beneficiaryName: 'Manmohan Das',
      totalAmount: '1000000',
      paymentMethod: 'Initial Fund Transfer',
      accNumber: '12349051345',
    },
    {
      beneficiaryName: 'Manmohan Das',
      totalAmount: '1000000',
      paymentMethod: 'Initial Fund Transfer',
      accNumber: '12349051345',
    },
    {
      beneficiaryName: 'Manmohan Das',
      totalAmount: '1000000',
      paymentMethod: 'Initial Fund Transfer',
      accNumber: '12349051345',
    },
    {
      beneficiaryName: 'Manmohan Das',
      totalAmount: '1000000',
      paymentMethod: 'Initial Fund Transfer',
      accNumber: '12349051345',
    },
    {
      beneficiaryName: 'Manmohan Das',
      totalAmount: '1000000',
      paymentMethod: 'Initial Fund Transfer',
      accNumber: '12349051345',
    },
    {
      beneficiaryName: 'Manmohan Das',
      totalAmount: '1000000',
      paymentMethod: 'Initial Fund Transfer',
      accNumber: '12349051345',
    },
  ];

  rightsAccess: string = 'With Rights Access';
  rightsAccessForListing: string = 'With Rights Access';

  selectedRows: any = [];
  selectedRowIds: any = [];
  isModalFromOtherComponent: any = false;
  tempSelectedRowIds: any = [];
  chartCurrency: string = '';

  isGroupUser: boolean = false;
  showAccountDebitDetails: boolean = false;

  listingTypes = [
    {
      id: 'PAYMENTMETHOD',
      displayName: 'Payment Method',
      serverUrl: 'payments/transactions/sendToBank/paymentMethod/',
      colDefsUrl: 'payments/transactions/sendToBank/paymentMethod/private/colDefs',
      rowDefUrl: 'payments/transactions/sendToBank/paymentMethod/private/getPendingList',
      count: 10,
    },
    {
      id: 'BILLPAYMENT',
      displayName: 'BIll Payment',
      serverUrl: 'payments/transactions/sendToBank/billPayment/',
      colDefsUrl: 'payments/transactions/sendToBank/billPayment/private/colDefs',
      rowDefUrl: 'payments/transactions/sendToBank/billPayment/private/getPendingList',
      count: 5,
    },
    {
      id: 'FDPLACENMENT',
      displayName: 'FD Placement',
      serverUrl: 'payments/transactions/sendToBank/fdPlacement/',
      colDefsUrl: 'payments/transactions/sendToBank/fdPlacement/private/colDefs',
      rowDefUrl: 'payments/transactions/sendToBank/fdPlacement/private/getPendingList',
      count: 0,
    },
    {
      id: 'WPSPAYMENT',
      displayName: 'WPS Payment',
      serverUrl: 'payments/transactions/sendToBank/wpsPayment/',
      colDefsUrl: 'payments/transactions/sendToBank/wpsPayment/private/colDefs',
      rowDefUrl: 'payments/transactions/sendToBank/wpsPayment/private/getPendingList',
      count: 1,
    },
  ];

  frameworkComponents = { batchDetailCellRenderer: BatchDetailsRendererComponent };
  detailCellRenderer = 'batchDetailCellRenderer';

  constructor(
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    /* remove below : starts */
    const actions: Actions = {
      heading: 'Send to Bank - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
      favourite: true,
      help: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Payments' },
      { label: 'Transactions' },
      { label: 'Send to Bank' },
      { label: 'Initiate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.httpService
      .httpPost('payments/transactions/sendToBank/private/getDashboardData')
      .subscribe((response: any) => {
        this.listingTypes = response.listingTypes;
        this.activeListing = this.listingTypes[0];

        this.withRightsAccessOptionsData = response.withRightsAccessOptionData;
        this.withoutRightsAccessOptionsData = response.withoutRightsAccessOptionData;

        this.topFiveDetails = response.topFiveDetails;

        this.totalRecords = response.totalRecords;
        this.criticalRecords = response.criticalRecords;

        this.prepareOptions();

        this.loading = false;
      });
  }

  onChangeRightAccess() {
    this.prepareOptions();
  }

  prepareOptions() {
    let data = [];

    if (this.rightsAccess == 'With Rights Access') {
      data = this.withRightsAccessOptionsData;
    } else {
      data = this.withoutRightsAccessOptionsData;
    }

    this.options = {
      data: data,
      formatter: (params: any) => {
        return `${data[params.itemId].module}`;
      },
      padding: {
        left: 12,
        right: 12,
        top: 12,
        bottom: 12,
      },
      labelKey: 'module',
      angleKey: 'records',
      legend: {
        spacing: 10,
        layoutHorizontalSpacing: 10,
        layoutVerticalSpacing: 10,
      },
    };
  }

  changeActiveListing(listing: any) {
    this.activeListing = listing;

    this.sendToBankInitGrid.refreshGridList();
  }

  refresh() {
    this.resetRowSelections();
    this.sendToBankInitGrid.refreshGridList();
  }

  rowSelected(event: any): void {
    this.resetRowSelections();
    this.selectedRows = this.sendToBankInitGrid.getSelectedRows();
    this.selectedRows.forEach((row: any) => {
      this.selectedRowIds.push({ id: row.id, recordType: row.recordType });
    });
  }

  onLinkClick(id: string) {}

  view(id: string, recordType: string) {
    this.viewService.setId(id);
    this.viewService.setMode('VIEW');

    if (recordType == 'singlePayment') {
      this.showSinglePayment = true;
    } else if (recordType == 'bulkPayment') {
      this.showBulkPayment = true;
    } else if (recordType == 'billPayment') {
      this.showBillPayment = true;
    } else if (recordType == 'fdPlacement') {
      this.showFdInitiation = true;
    } else if (recordType == 'wpsPayment') {
      this.showWpsPayment = true;
    }

    // this.showBatchTransactions = true;
  }

  resetRowSelections() {
    this.selectedRows = [];
    this.selectedRowIds = [];
    this.isModalFromOtherComponent = false;
    this.tempSelectedRowIds = [];
  }

  onAthorizedAllClick() {
    this.authorizeAll(this.selectedRowIds).subscribe((responseStatus: number) => {
      if (responseStatus == 0) {
        this.refresh();
      }
    });
  }

  onChangeCorporate(corporate: Select) {
    this.httpService
      .httpPost('payments/transactions/sendToBank/private/getCorporateWiseDashboardSummery', {
        dataMap: { corporateId: corporate.id },
      })
      .subscribe((response: any) => {
        this.withRightsAccessOptionsData = response.withRightsAccessOptionData;
        this.withoutRightsAccessOptionsData = response.withoutRightsAccessOptionData;

        this.prepareOptions();

        this.loading = false;
      });
  }

  processRejection(reason: string) {
    this.rejectAll(
      this.isModalFromOtherComponent ? this.tempSelectedRowIds : this.selectedRowIds,
      reason,
    ).subscribe((responseStatus: number) => {
      if (responseStatus == 0) {
        this.refresh();
      }
    });
  }

  authorize(id: any, recordType: string): void {
    const selectedRows = [{ id, recordType }];
    this.authorizeAll(selectedRows).subscribe((responseStatus: number) => {
      if (responseStatus == 0) {
        this.refresh();
      }
    });
  }

  authorizeAll(selectedRows: any[]): Observable<number> {
    let response = new Subject<number>();
    let data = { dataMap: { selectedRows: selectedRows, listingTypeId: this.activeListing.id } };
    this.httpService
      .httpPost(this.activeListing.serverUrl + 'private/sendToBankAuthorize', data)
      .subscribe((res) => {
        response.next(res.responseStatus.status);
        response.complete();
      });
    return response.asObservable();
  }

  onRejectAllClick() {
    this.rejectAll(
      this.isModalFromOtherComponent ? this.tempSelectedRowIds : this.selectedRowIds,
      '',
    ).subscribe((responseStatus: number) => {
      if (responseStatus == 0) {
        this.refresh();
      }
    });
  }

  reject(id: string, recordType: string): void {
    const selectedRows = [{ id, recordType }];
    this.rejectAll(selectedRows, '').subscribe((responseStatus: number) => {
      if (responseStatus == 0) {
        this.refresh();
      }
    });
  }

  onActionListClick() {
    this.router.navigate(['../action'], { relativeTo: this.route });
  }

  rejectAll(selectedRows: any[], rejectReason: string): Observable<number> {
    let response = new Subject<number>();
    let data = {
      dataMap: { selectedRows, rejectReason: rejectReason, listingTypeId: this.activeListing.id },
    };
    this.httpService
      .httpPost(this.activeListing.serverUrl + 'private/sendToBankReject', data)
      .subscribe((res) => {
        response.next(res.responseStatus.status);
        response.complete();
      });
    return response.asObservable();
  }
}
