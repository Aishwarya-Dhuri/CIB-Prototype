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
  selector: 'app-send-to-bank-action',
  templateUrl: './send-to-bank-action.component.html',
  styleUrls: ['./send-to-bank-action.component.scss'],
})
export class SendToBankActionComponent implements OnInit {
  @ViewChild('sendToBankActionGrid') sendToBankActionGrid: any;

  showSinglePayment: boolean = false;
  showBulkPayment: boolean = false;
  showFdInitiation: boolean = false;
  showBillPayment: boolean = false;
  showWpsPayment: boolean = false;

  loading: boolean;

  acceptedOptionsData: any;
  rejectedOptionsData: any;
  options: any;

  acceptedRecords: number = 0;
  rejectedRecords: number = 0;

  activeListing: any;

  showBatchTransactions = false;

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

  chartCurrency: string = '';

  corporate: string = 'all';

  action: string = 'Accepted';

  selectedRows: any = [];
  selectedRowIds: any = [];
  isModalFromOtherComponent: any = false;
  tempSelectedRowIds: any = [];

  listType = 'getAllAuthorizedRejectedSendToBankList';

  rowDefUrl: string = '';

  listingTypes = [];

  frameworkComponents = { batchDetailCellRenderer: BatchDetailsRendererComponent };
  detailCellRenderer = 'batchDetailCellRenderer';

  isGroupUser: boolean = false;

  constructor(
    private httpService: HttpService,
    private viewService: ViewService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    /* remove below : starts */
    const actions: Actions = {
      heading: 'Send to Bank - Released / Rejected Entries',
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
      { label: 'Released / Rejected Entries' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.httpService
      .httpPost('payments/transactions/sendToBank/private/getActionDashboardData')
      .subscribe((response: any) => {
        this.listingTypes = response.listingTypes;
        this.activeListing = this.listingTypes[0];
        this.rowDefUrl = this.activeListing.serverUrl + 'private/' + this.listType;

        this.acceptedOptionsData = response.acceptedOptionData;
        this.rejectedOptionsData = response.rejectedOptionData;

        this.acceptedRecords = response.acceptedRecords;
        this.rejectedRecords = response.rejectedRecords;

        this.prepareOptions();

        this.loading = false;
      });

    const data = [
      {
        module: 'Payment Method',
        records: '2',
        amount: '12030499.5',
      },
      {
        module: 'Bill Payment',
        records: '2',
        amount: '15000000',
      },
      {
        module: 'FD Placement',
        records: '6',
        amount: '10000000',
      },
      {
        module: 'WPS Payment',
        records: '3',
        amount: '12530499.5',
      },
    ];

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

  onChangeAction() {
    this.prepareOptions();
  }

  prepareOptions() {
    let data = [];

    if (this.action == 'Accepted') {
      data = this.acceptedOptionsData;
    } else {
      data = this.rejectedOptionsData;
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

  onChangeCorporate(corporate: Select) {
    this.httpService
      .httpPost('payments/transactions/sendToBank/private/getCorporateWiseActionSummery', {
        dataMap: { corporateId: corporate.id },
      })
      .subscribe((response: any) => {
        this.acceptedOptionsData = response.acceptedOptionData;
        this.rejectedOptionsData = response.rejectedOptionData;

        this.prepareOptions();
      });
  }

  changeActiveListing(listing: any) {
    this.activeListing = listing;

    this.sendToBankActionGrid.refreshGridList();
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

  refresh(event?: any) {
    this.resetRowSelections();

    this.rowDefUrl = this.activeListing.serverUrl + 'private/' + this.listType;

    this.sendToBankActionGrid.refreshGridList();
  }

  resetRowSelections() {
    this.selectedRows = [];
    this.selectedRowIds = [];
    this.isModalFromOtherComponent = false;
    this.tempSelectedRowIds = [];
  }

  onInitiateSendToBankClick() {
    this.router.navigate(['../initiate'], { relativeTo: this.route });
  }
}
