import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ManualReconciliation } from '../@models/manual-reconciliation.model';
import { ManualReconciliationService } from '../@services/manual-reconciliation.service';
import { EditCurrencyRendererComponent } from './@components/edit-currency-renderer/edit-currency-renderer.component';
import { PaymentRendererComponent } from './@components/payment-renderer/payment-renderer.component';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @ViewChild('invoiceDetails') invoiceDetails: any;
  @ViewChild('paymentDetails') paymentDetails: any;

  @Input() isMatched: boolean = false;
  @Input() selectedData: any;
  formData: ManualReconciliation;
  mode: string;
  showFilters = false;

  splitter = 'horizontal';

  gridOptions = {
    rowModelType: 'clientSide',
    pagination: false,
  };

  selectedInvoicesColDefs = [
    {
      headerName: 'Invoice No',
      field: 'id',
      sortable: false,
    },
    {
      headerName: 'Invoice Amt',
      field: 'amount',
      cellRenderer: 'currencyRenderer',
      sortable: false,
    },
    { headerName: 'Invoice Date', field: 'date', sortable: false },
    { headerName: 'Invoice Due Date', field: 'dueDate', sortable: false },
  ];

  selectedPaymentsColDefs = [
    {
      headerName: 'Payment Amount',
      field: 'outstandingAmount',
      cellRenderer: 'currencyRenderer',
      sortable: false,
    },
    { headerName: 'Payment Date', field: 'paymentDate', sortable: false },
    { headerName: 'Payment Method', field: 'paymentMethod', sortable: false },
  ];

  searchDetails = {
    corporateClientName: 'TATA Motors',
    program: 'PROG001',
    accountNumber: '1234345672682',
  };

  showInvoiceDetails = null;
  showPaymentDetails = null;

  selectedInvoices: any[] = [];
  selectedPayments: any[] = [];

  difference = 0;
  totalInvoiceAmount = 0;
  totalPaymentAmount = 0;

  invoiceColDefUrl = 'rms/transactions/invoiceEntry/private/invoiceColdef';
  invoiceRowDataUrl = 'rms/transactions/invoiceEntry/private/getInvoiceData';
  paymentColDefUrl = 'rms/transactions/payments/private/paymentColdef';
  paymentRowDataUrl = 'rms/transactions/payments/private/getAuthorizedList';

  context = {
    componentParent: this,
  };

  paymentFrameworkComponents = {
    editCurrencyRenderer: EditCurrencyRendererComponent,
    paymentRenderer: PaymentRendererComponent,
  };

  invoiceFrameworkComponents = {
    editCurrencyRenderer: EditCurrencyRendererComponent,
  };

  invoiceFilters: any;
  paymentFilters: any;
  searchFilters: any;

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private manualReconciliationService: ManualReconciliationService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Manual Reconciliation - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
      // actions: [
      //   {
      //     actionName: 'horizontal',
      //     icon: 'pi pi-sliders-h',
      //   },
      //   {
      //     actionName: 'vertical',
      //     icon: 'pi pi-sliders-v',
      //   },
      // ],
    };

    this.actionService.setActions(actions);

    this.actionService.getAction().subscribe((action: any) => {
      if (action) {
        this.splitter = action.actionName;
        setTimeout(() => {
          this.onResizeSplitter();
        });
      }
    });

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Receivables' },
      { label: 'Transactions' },
      { label: 'Manual reconciliation' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.searchFilters = this.manualReconciliationService.searchFilters;

    this.invoiceFilters = this.manualReconciliationService.invoiceFilters;

    this.paymentFilters = this.manualReconciliationService.paymentFilters;

    this.formData = {
      matchId: '',
      program: '',
      corporateName: '',
      corporateClientName: '',
      status: '',
      lastAction: '',
      totalInvoiceAmount: '',
      totalInvoices: '',
      totalPaymentAmount: '',
      totalPayments: '',
      invoiceDetails: [],
      paymentDetails: [],
    };
    this.getViewData();
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit(): void {
    this.searchFilters.forEach((element) => {
      if (element.name == 'matchId') {
        this.formData.matchId = element.displayValue;
      }
      if (element.name == 'program') {
        this.formData.program = element.displayValue;
      }
    });
    this.formData.corporateName = this.userService.userDetails.displayName;
    this.formData.corporateClientName = '';
    this.formData.status = '';
    this.formData.lastAction = '';
    this.formData.invoiceDetails = this.selectedInvoices;
    this.formData.paymentDetails = this.selectedPayments;
    this.formData.totalInvoices = this.selectedInvoices.length.toString();
    this.formData.totalPayments = this.selectedPayments.length.toString();
    this.formData.totalInvoiceAmount = this.totalInvoiceAmount.toString();
    this.formData.totalPaymentAmount = this.totalPaymentAmount.toString();
    this.httpService
      .httpPost('rms/transactions/manualReconciliation/private/create', this.formData)
      .subscribe((res: any) => {
        if (res) {
          this.getToListing();
        }
      });
  }

  getToListing() {
    this.router.navigate(['../listing'], { relativeTo: this.route });
  }

  getRowData() {
    const invoiceReqData = {
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {},
      sortModel: [],
      entityName: '',
    };
    const paymentReqData = {
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {},
      sortModel: [],
      entityName: '',
    };
    this.httpService.httpPost(this.invoiceRowDataUrl, invoiceReqData).subscribe((response: any) => {
      response.data.forEach((element) => {
        element.actions.splice(1, 2);
        element.actions[0].methodName === 'view'
          ? (element.actions[0].methodName = 'viewInvoice')
          : '';
      });
      setTimeout(() => {
        this.invoiceDetails.setRowData(response.data);
      }, 100);
    });
    this.httpService.httpPost(this.paymentRowDataUrl, paymentReqData).subscribe((response: any) => {
      response.data.forEach((element) => {
        element.actions.splice(1, 2);
        element.actions[0].methodName === 'view'
          ? (element.actions[0].methodName = 'viewPayment')
          : '';
      });
      setTimeout(() => {
        this.paymentDetails.setRowData(response.data);
      }, 100);
    });
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('rms/transactions/manualReconciliation/private/view', data)
        .subscribe((formData: ManualReconciliation) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'EDIT') {
            this.formData.invoiceDetails.map((res) => {
              res['actions'] = [
                {
                  color: null,
                  displayName: 'View',
                  icon: 'pi pi-eye',
                  index: 1,
                  methodName: 'viewInvoice',
                  paramList: 'id, amount, invOutstandingAmount, balance, date, dueDate',
                  type: 'ICON',
                  url: 'route~view',
                },
              ];
              return res;
            });
            this.invoiceDetails.setRowData(this.formData.invoiceDetails);
            this.formData.paymentDetails.map((res) => {
              res['actions'] = [
                {
                  color: null,
                  displayName: 'View',
                  icon: 'pi pi-eye',
                  index: 1,
                  methodName: 'viewPayment',
                  paramList:
                    'id, paymentAmount, reconciliatedAmount, paymentMethod, outstandingAmount, accountNo, paymentDate, transactionDesc',
                  type: 'ICON',
                  url: 'route~view',
                },
              ];
              return res;
            });
            this.paymentDetails.setRowData(this.formData.paymentDetails);
            this.isMatched = false;
          }
          if (this.mode == 'VIEW') {
            this.selectedInvoices = formData.invoiceDetails;
            this.selectedPayments = formData.paymentDetails;
            this.updateTotalInvoiceAmount();
            this.updateTotalPaymentAmount();
            this.isMatched = true;
          }
        });
    } else if (this.selectedData) {
      this.selectedInvoices = this.selectedData.invoiceDetails;
      this.selectedPayments = this.selectedData.paymentDetails;
      this.updateTotalInvoiceAmount();
      this.updateTotalPaymentAmount();
    } else {
      this.getRowData();
    }
  }

  viewInvoice(
    id: string,
    amount: string,
    invOutstandingAmount: string,
    balance: any,
    date: string,
    dueDate: string,
  ) {
    this.showInvoiceDetails = {
      id,
      amount,
      invOutstandingAmount,
      balance: balance,
      date,
      dueDate,
    };
  }

  viewPayment(
    id: any,
    paymentAmount: any,
    reconciliatedAmount: string,
    paymentMethod: string,
    outstandingAmount: any,
    accountNo: string,
    paymentDate: string,
    transactionDesc: string,
  ) {
    this.showPaymentDetails = {
      id,
      payment: paymentAmount,
      reconciliatedAmount,
      paymentMethod,
      outstandingAmount: outstandingAmount,
      accountNo,
      paymentDate,
      transactionDesc,
    };
  }

  invoiceBalanceUpdated(balance: number, id: any) {
    const i = this.selectedInvoices.findIndex((inv: any) => inv.id == id);
    if (i !== -1) {
      this.selectedInvoices[i].balance = balance;
    }
    this.updateTotalInvoiceAmount();
  }

  paymentOutstandingAmountUpdated(outstandingAmount: number, id: any) {
    const i = this.selectedPayments.findIndex((pmt: any) => pmt.id == id);
    if (i !== -1) {
      this.selectedPayments[i].outstandingAmount = outstandingAmount;
    }
    this.updateTotalPaymentAmount();
  }

  updateTotalInvoiceAmount() {
    let invAmt = 0;

    this.selectedInvoices.forEach((inv: any) => {
      invAmt += parseInt(inv.balance);
    });

    this.totalInvoiceAmount = invAmt;

    this.updateDifference();
  }

  updateTotalPaymentAmount() {
    let pmtAmt = 0;

    this.selectedPayments.forEach((pmt: any) => {
      pmtAmt += parseInt(pmt.outstandingAmount);
    });

    this.totalPaymentAmount = pmtAmt;

    this.updateDifference();
  }

  updateDifference() {
    this.difference = this.totalInvoiceAmount - this.totalPaymentAmount;
  }

  onInvoiceSelected(invoice: any) {
    if (invoice.node.selected) {
      const inv = {
        id: invoice.data.id,
        amount: invoice.data.amount,
        invOutstandingAmount: invoice.data.invOutstandingAmount,
        balance: invoice.data.amount,
        date: invoice.data.date,
        dueDate: invoice.data.dueDate,
      };
      this.selectedInvoices.push(inv);
    } else {
      const i = this.selectedInvoices.findIndex((inv: any) => inv.id == invoice.data.id);
      if (i !== -1) {
        this.selectedInvoices.splice(i, 1);
      }
    }
    this.updateTotalInvoiceAmount();
  }

  onPaymentSelected(payment: any) {
    if (payment.node.selected) {
      const pmt = {
        id: payment.data.id,
        paymentAmount: payment.data.outstandingAmount,
        reconciliatedAmount: payment.data.reconciledAmount,
        paymentMethod: payment.data.paymentMethod,
        outstandingAmount: payment.data.outstandingAmount,
        accountNo: payment.data.accountNo,
        paymentDate: payment.data.paymentDate,
        transactionDesc: payment.data.transactionDesc,
      };
      this.selectedPayments.push(pmt);
    } else {
      const i = this.selectedPayments.findIndex((pmt: any) => pmt.id == payment.data.id);

      if (i !== -1) {
        this.selectedPayments.splice(i, 1);
      }
    }
    this.updateTotalPaymentAmount();
  }

  onResizeSplitter(e?: any) {
    this.invoiceDetails.fitColumns();

    this.paymentDetails.fitColumns();
  }

  clearAll(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
    this.searchFilters = [
      {
        name: 'corporateClientName',
        displayName: 'Corporate Client Name',
        value: '',
        type: 'string',
      },
      {
        name: 'program',
        displayName: 'Program',
        value: '',
        type: 'string',
      },
      {
        name: 'accountNumber',
        displayName: 'Account Number',
        value: '',
        type: 'string',
      },
    ];

    this.invoiceFilters = [
      {
        name: 'invoiceNumber',
        displayName: 'Invoice Number',
        value: '',
        type: 'string',
      },
      {
        name: 'invoiceAmount',
        displayName: 'Invoice Amount',
        value: '',
        type: 'string',
      },
      {
        name: 'invoiceDate',
        displayName: 'Invoice Date',
        value: '',
        type: 'string',
      },
      {
        name: 'invoiceDueDate',
        displayName: 'Invoice Due Date',
        value: '',
        type: 'string',
      },
    ];

    this.paymentFilters = [
      {
        name: 'transactionRefNo',
        displayName: 'Transaction Ref No.',
        value: '',
        type: 'string',
      },
      {
        name: 'paymentAmount',
        displayName: 'Payment Amount',
        value: '',
        type: 'string',
      },
      {
        name: 'paymentDate',
        displayName: 'Payment Date',
        value: '',
        type: 'string',
      },
      {
        name: 'paymentMethod',
        displayName: 'Payment Method',
        value: '',
        type: 'string',
      },
    ];
  }
}
