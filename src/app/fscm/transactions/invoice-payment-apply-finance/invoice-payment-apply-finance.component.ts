import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { TransactionEnquiryService } from 'src/app/base/product-common/transaction-enquiry/@services/transaction-enquiry.service';
import { ListingAction } from 'src/app/shared/@components/ag-grid-listing/grid-action-renderer/listing-action.model';
import { InvoiceStatusRendererComponent } from 'src/app/shared/@components/ag-grid-listing/invoice-status-renderer/invoice-status-renderer.component';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ApplyFinanceDetails } from './@models/apply-finance-details.model';
import { Invoice } from './@models/invoice.model';
import { PayNowDetails } from './@models/pay-now-details.model';

@Component({
  selector: 'app-invoice-payment-apply-finance',
  templateUrl: './invoice-payment-apply-finance.component.html',
  styleUrls: ['./invoice-payment-apply-finance.component.scss'],
})
export class InvoicePaymentApplyFinanceComponent implements OnInit {
  mode: string;
  @ViewChild('dynamicSearch') dynamicSearch: any;
  @ViewChild('searchResults') searchResultsGrid: any;
  searchByEntityName: string = 'INVOICE_PAYMENT_BY_INVOICE';
  selectedFilters: Filter[] = [];

  dueInvoiceDuration: string = 'days';
  dueInvoiceList: Invoice[] = [];

  currentScreen: 'FILTERS' | 'LISTING' | 'PAYMENT' | 'FINANCE';
  searchColDefUrl: string =
    'fscm/transactions/invoicePaymentApplyFinance/private/searchResultsColDefs';
  searchRowDefUrl: string =
    'fscm/transactions/invoicePaymentApplyFinance/private/getSearchResultList';

  gridOptions = {
    rowSelection: 'multiple',
    paginationPageSize: 5,
    context: { componentParent: this },
  };

  frameworkComponents: any = {
    invoiceStatusCellRenderer: InvoiceStatusRendererComponent,
  };

  selectedInvoices: Invoice[] = [];

  selectedInvoiceForPartialReason: number;
  isShowPartialReasonModal: boolean;
  partialReasonColDefUrl: string =
    'fscm/transactions/invoicePaymentApplyFinance/invoicePayment/private/partialReasonColDef';
  partialReasonRowDefUrl: string =
    'fscm/transactions/invoicePaymentApplyFinance/invoicePayment/private/partialReasonRowDef';

  isShowCNDNModal: boolean;
  CNDNModalType: string;
  CNDNHeader: string;
  CNDNColDefUrl: string;
  CNDNRowDefUrl: string;
  CNDNSelectedIds: string[];
  CNDNSelectedInvoiceIndex: number;

  isOpenConfirm: boolean;
  confirmMessage: string;

  payNowDetails: PayNowDetails;
  applyFinanceDetails: ApplyFinanceDetails;

  isShowAttachmentModal: boolean;
  selectedAttachmentIndex: number;
  selectedAttachments: any;
  accountNoList: Select[];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private userService: UserService,
    private viewService: ViewService,
    private location: Location,
    private router: Router,
    private transactionEnquiryService: TransactionEnquiryService,
  ) {
    if (this.viewService.getMode() == 'VIEW' || this.viewService.getMode() == 'EDIT') {
      if (this.viewService.getExtraData() == 'IP') {
        this.getViewData(
          this.viewService.getMode(),
          this.viewService.getId(),
          'invoicePayment',
        ).subscribe((payNowDetails: PayNowDetails) => {
          this.payNowDetails = payNowDetails;
          this.currentScreen = 'PAYMENT';
        });
      } else {
        this.applyFinanceDetails = new ApplyFinanceDetails();
        this.getViewData(
          this.viewService.getMode(),
          this.viewService.getId(),
          'applyFinance',
        ).subscribe((applyFinanceDetails: ApplyFinanceDetails) => {
          this.applyFinanceDetails = applyFinanceDetails;
          this.currentScreen = 'FINANCE';
        });
      }
    } else if (this.transactionEnquiryService.getActionName() == 'onBack') {
      this.backFromTransactionEnquiry();
    } else {
      this.currentScreen = 'FILTERS';
    }
  }

  getViewData(mode: string, id: string, subServiceUrl: string): Observable<any> {
    let response = new Subject<any>();
    this.mode = mode;
    const url = 'fscm/transactions/invoicePaymentApplyFinance/' + subServiceUrl + '/private/view';
    const data = { dataMap: { id: id } };
    this.httpService.httpPost(url, data).subscribe((viewResponse: any) => {
      delete viewResponse.responseStatus;
      viewResponse.isReview = mode == 'VIEW';
      this.viewService.clearAll();
      response.next(viewResponse);
      response.complete();
    });
    return response.asObservable();
  }

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Invoice Payment/Finance',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'FSCM' },
      { label: 'Transactions' },
      { label: 'Invoice Payment/Finance' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    if (this.currentScreen == 'FILTERS') {
      this.onChangeDueInvoiceDuration();
    }
  }

  onChangeDueInvoiceDuration(): void {
    this.dueInvoiceList = [];
    const url = 'fscm/transactions/invoicePaymentApplyFinance/private/getDueInvoices';
    const data = { dataMap: { duration: this.dueInvoiceDuration } };
    this.httpService.httpPost(url, data).subscribe((response: any) => {
      this.dueInvoiceList = response.data;
    });
  }

  invokeActionMethod(invoice: Invoice, action: ListingAction): void {
    const paramList = action.paramList ? action.paramList.split(',') : [];
    let paramListValues = [];
    paramList.forEach((param) => {
      paramListValues.push(invoice[param.trim()]);
    });
    this[action.methodName](...paramListValues);
  }

  onDynamicFiltersReady(): void {
    this.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }

  generateFilters(): void {
    setTimeout(() => {
      this.dynamicSearch.getGenericFilters();
    }, 10);
  }

  getRecords(filters: Filter[]): void {
    this.selectedFilters = filters;
    this.currentScreen = 'LISTING';
    console.log(filters);
  }

  onSearchResultRowSelected(e: any) {
    this.selectedInvoices = this.searchResultsGrid.getSelectedRows();
  }

  selectSearchListingRows(): void {
    setTimeout(() => {
      if (this.searchResultsGrid && this.selectedInvoices.length > 0) {
        this.selectedInvoices.forEach((invoice: Invoice) => {
          this.searchResultsGrid.selectRow(invoice, 'id');
        });
      }
    }, 1200);
  }

  getTotalPayable(): number {
    let total = 0;
    this.selectedInvoices.forEach((invoice: any) => {
      total = total + parseFloat(invoice.totPayment.toString());
    });
    return total;
  }

  getTotalPayableCurrency(): string {
    return this.selectedInvoices.length > 0 ? this.selectedInvoices[0].currencyName : '';
  }

  singlePayNow(id: string): void {
    console.log(this.selectedFilters);
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('fscm/transactions/invoiceEntry/private/view', data)
      .subscribe((invoiceMst: any) => {
        delete invoiceMst.responseStatus;
        // this.selectedFilters = [];
        this.payNow([invoiceMst.invoiceDetails[0]]);
      });
  }

  payNow(invoices: Invoice[]): void {
    console.log(this.selectedFilters);
    this.selectedInvoices = invoices;
    this.payNowDetails = new PayNowDetails();
    this.payNowDetails.invoices = this.selectedInvoices;
    this.payNowDetails.noIfInvoices = this.payNowDetails.invoices.length;
    this.payNowDetails.trackingId = this.payNowDetails.invoices[0].trackingId;
    this.payNowDetails.applicantId = this.payNowDetails.invoices[0].applicantId;
    this.payNowDetails.applicantCode = this.payNowDetails.invoices[0].applicantCode;
    this.payNowDetails.applicantName = this.payNowDetails.invoices[0].applicantName;
    this.payNowDetails.sellerBuyerId = this.payNowDetails.invoices[0].sellerBuyerId;
    this.payNowDetails.sellerBuyerCode = this.payNowDetails.invoices[0].sellerBuyerCode;
    this.payNowDetails.sellerBuyerName = this.payNowDetails.invoices[0].sellerBuyerName;
    this.payNowDetails.currencyName = this.payNowDetails.invoices[0].currencyName;
    this.payNowDetails.invoices.forEach((invoice: Invoice) => {
      invoice.netPayable = invoice.totPayment;
      invoice.partialReason = '';
      invoice.status = moment(invoice.dueDate, 'DD-MMM-YYYY').isBefore(moment())
        ? 'Overdue'
        : 'Normal';
    });
    this.getTotalInvoiceAmount(this.payNowDetails);
    this.getAccountNoList();
    this.currentScreen = 'PAYMENT';
  }

  getTotalInvoiceAmount(IPorAFObj: any): number {
    IPorAFObj.totalInvoiceAmount = 0;
    IPorAFObj.invoices.forEach((invoice: Invoice) => {
      IPorAFObj.totalInvoiceAmount =
        IPorAFObj.totalInvoiceAmount + parseFloat(invoice.totPayment.toString());
    });

    return IPorAFObj.totalInvoiceAmount;
  }

  getAccountNoList(): void {
    const data = { dataMap: { corporateId: this.userService.userDetails.corporateId } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        this.accountNoList = response.dataList;
      });
  }

  showPartialReasonModal(i: number): void {
    this.selectedInvoiceForPartialReason = i;
    this.isShowPartialReasonModal = true;
  }

  onPartialReasonSelected(row: any): void {
    this.payNowDetails.invoices[this.selectedInvoiceForPartialReason].partialReason =
      row.reasonName;
  }

  deleteInvoice(i: number, isPayment: boolean): void {
    if (isPayment) {
      this.payNowDetails.invoices.splice(i, 1);
      this.payNowDetails.noIfInvoices = this.payNowDetails.invoices.length;
      this.getTotalInvoiceAmount(this.payNowDetails);
      if (this.payNowDetails.noIfInvoices == 0) {
        this.currentScreen = 'FILTERS';
      }
    } else {
      this.applyFinanceDetails.invoices.splice(i, 1);
      this.applyFinanceDetails.noIfInvoices = this.applyFinanceDetails.invoices.length;
      this.getTotalInvoiceAmount(this.applyFinanceDetails);
      if (this.applyFinanceDetails.noIfInvoices == 0) {
        this.currentScreen = 'FILTERS';
      }
    }
  }

  viewInvoice(id: string): void {
    //show transaction enquiry screen here
    this.transactionEnquiryService.setActionName('onView');
    this.transactionEnquiryService.setId(id);
    this.transactionEnquiryService.setTransactionEnquiryData({
      mode: this.mode,
      searchByEntityName: this.searchByEntityName,
      currentScreen: this.currentScreen,
      dueInvoiceList: this.dueInvoiceList,
      selectedFilters: this.selectedFilters,
      selectedInvoices: this.selectedInvoices,
      payNowDetails: this.payNowDetails,
      accountNoList: this.accountNoList,
      applyFinanceDetails: this.applyFinanceDetails,
    });
    this.router.navigateByUrl('fscm/process/transactionEnquiry/viewTransaction');
  }

  backFromTransactionEnquiry(): void {
    const transactionEnqData = this.transactionEnquiryService.getTransactionEnquiryData();
    this.mode = transactionEnqData.mode;
    this.searchByEntityName = transactionEnqData.searchByEntityName;
    this.dueInvoiceList = transactionEnqData.dueInvoiceList;
    this.selectedFilters = transactionEnqData.selectedFilters;
    this.selectedInvoices = transactionEnqData.selectedInvoices;
    this.selectSearchListingRows();
    this.payNowDetails = transactionEnqData.payNowDetails;
    this.accountNoList = transactionEnqData.accountNoList;
    this.applyFinanceDetails = transactionEnqData.applyFinanceDetails;
    this.currentScreen = transactionEnqData.currentScreen;
    this.transactionEnquiryService.clearAll();
  }

  showHideInvoiceDetails(i: number, isPayment: boolean): void {
    let invoices = isPayment ? this.payNowDetails.invoices : this.applyFinanceDetails.invoices;
    if (!invoices[i].showDetails) {
      invoices.forEach((invoice: any) => {
        invoice.showDetails = false;
      });
    }
    invoices[i].showDetails = !invoices[i].showDetails;
  }

  showCNDNModal(isCN: boolean, isGeneric: boolean, i?: number): void {
    const isReview =
      this.currentScreen == 'PAYMENT'
        ? this.payNowDetails.isReview
        : this.applyFinanceDetails.isReview;
    if (isReview) return;
    if (isGeneric && isCN) {
      this.CNDNModalType = 'GCN';
      this.CNDNHeader = 'Generic Credit Notes';
      this.CNDNColDefUrl = 'fscm/transactions/invoicePaymentApplyFinance/private/CNDNColDef';
      this.CNDNRowDefUrl = 'fscm/transactions/creditDebitNoteAcceptance/private/getCreditNotes';
      this.CNDNSelectedIds =
        this.currentScreen == 'PAYMENT'
          ? this.payNowDetails.genericCNIds
          : this.applyFinanceDetails.genericCNIds;
    } else if (isGeneric && !isCN) {
      this.CNDNModalType = 'GDN';
      this.CNDNHeader = 'Generic Debit Notes';
      this.CNDNColDefUrl = 'fscm/transactions/invoicePaymentApplyFinance/private/CNDNColDef';
      this.CNDNRowDefUrl = 'fscm/transactions/creditDebitNoteAcceptance/private/getDebitNotes';
      this.CNDNSelectedIds = this.payNowDetails.genericDNIds;
    } else if (!isGeneric && isCN) {
      this.CNDNSelectedInvoiceIndex = i;
      this.CNDNModalType = 'CN';
      this.CNDNHeader = 'Credit Notes';
      this.CNDNColDefUrl = 'fscm/transactions/invoicePaymentApplyFinance/private/CNDNColDef';
      this.CNDNRowDefUrl = 'fscm/transactions/creditDebitNoteAcceptance/private/getCreditNotes';
      this.CNDNSelectedIds =
        this.currentScreen == 'PAYMENT'
          ? this.payNowDetails.invoices[i].CNIds
          : this.applyFinanceDetails.invoices[i].CNIds;
    } else if (!isGeneric && !isCN) {
      this.CNDNSelectedInvoiceIndex = i;
      this.CNDNModalType = 'DN';
      this.CNDNHeader = 'Debit Notes';
      this.CNDNColDefUrl = 'fscm/transactions/invoicePaymentApplyFinance/private/CNDNColDef';
      this.CNDNRowDefUrl = 'fscm/transactions/creditDebitNoteAcceptance/private/getDebitNotes';
      this.CNDNSelectedIds = this.payNowDetails.invoices[i].DNIds;
    }
    this.isShowCNDNModal = true;
  }

  onCNDNSelection(rows: any): void {
    let ids = [];
    let total = 0;
    rows.forEach((row: any) => {
      ids.push(row.id.toString());
      total = total + parseFloat(row.netApplicableAmount.toString());
    });

    if (this.CNDNModalType == 'GCN') {
      if (this.currentScreen == 'PAYMENT') {
        this.payNowDetails.genericCNIds = ids;
        this.payNowDetails.genericCNAmount = total;
      } else {
        this.applyFinanceDetails.genericCNIds = ids;
        this.applyFinanceDetails.genericCNAmount = total;
      }
    } else if (this.CNDNModalType == 'GDN') {
      this.payNowDetails.genericDNIds = ids;
      this.payNowDetails.genericDNAmount = total;
    } else if (this.CNDNModalType == 'CN') {
      if (this.currentScreen == 'PAYMENT') {
        this.payNowDetails.invoices[this.CNDNSelectedInvoiceIndex].CNIds = ids;
        this.payNowDetails.invoices[this.CNDNSelectedInvoiceIndex].linkCN = total;
      } else {
        this.applyFinanceDetails.invoices[this.CNDNSelectedInvoiceIndex].CNIds = ids;
        this.applyFinanceDetails.invoices[this.CNDNSelectedInvoiceIndex].linkCN = total;
      }
    } else if (this.CNDNModalType == 'DN') {
      this.payNowDetails.invoices[this.CNDNSelectedInvoiceIndex].DNIds = ids;
      this.payNowDetails.invoices[this.CNDNSelectedInvoiceIndex].linkDN = total;
    }
  }

  getPayNowSubTotal(): number {
    this.payNowDetails.subTotal = 0;
    this.payNowDetails.invoices.forEach((invoice: Invoice) => {
      this.payNowDetails.subTotal =
        this.payNowDetails.subTotal + parseFloat(invoice.netPayable.toString());
    });
    return this.payNowDetails.subTotal;
  }

  getPayNowTotalPayable(): number {
    this.payNowDetails.totalPayableAmount =
      this.getPayNowSubTotal() -
      this.payNowDetails.genericCNAmount +
      this.payNowDetails.genericDNAmount -
      this.payNowDetails.discount +
      this.payNowDetails.taxCharges;
    return this.payNowDetails.totalPayableAmount;
  }

  onPaymentSubmit(): void {
    const url = this.mode
      ? 'fscm/transactions/invoicePaymentApplyFinance/invoicePayment/private/update'
      : 'fscm/transactions/invoicePaymentApplyFinance/invoicePayment/private/create';
    this.httpService.httpPost(url, this.payNowDetails).subscribe((response: any) => {
      this.confirmMessage = 'The invoice payment is successfully initiated!';
      this.isOpenConfirm = true;
    });
  }

  // FInance Methods Starts
  singleApplyFinance(id: string): void {
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('fscm/transactions/invoiceEntry/private/view', data)
      .subscribe((invoiceMst: any) => {
        delete invoiceMst.responseStatus;
        // this.selectedFilters = [];
        this.applyFinance([invoiceMst.invoiceDetails[0]]);
      });
  }

  applyFinance(invoices: Invoice[]): void {
    this.applyFinanceDetails = new ApplyFinanceDetails();
    this.applyFinanceDetails.invoices = invoices;
    this.applyFinanceDetails.appliedDate = this.userService.applicationDate;
    this.applyFinanceDetails.applicantId = this.applyFinanceDetails.invoices[0].applicantId;
    this.applyFinanceDetails.applicantCode = this.applyFinanceDetails.invoices[0].applicantCode;
    this.applyFinanceDetails.applicantName = this.applyFinanceDetails.invoices[0].applicantName;
    this.applyFinanceDetails.sellerBuyerId = this.applyFinanceDetails.invoices[0].sellerBuyerId;
    this.applyFinanceDetails.sellerBuyerCode = this.applyFinanceDetails.invoices[0].sellerBuyerCode;
    this.applyFinanceDetails.sellerBuyerName = this.applyFinanceDetails.invoices[0].sellerBuyerName;
    this.applyFinanceDetails.currencyName = this.applyFinanceDetails.invoices[0].currencyName;
    this.applyFinanceDetails.invoices.forEach((invoice: Invoice) => {
      invoice.financeDate = this.userService.applicationDate;
      invoice.status = moment(invoice.dueDate, 'DD-MMM-YYYY').isBefore(moment())
        ? 'Overdue'
        : 'Normal';
      invoice.financeRequired = invoice.totPayment;
      invoice.attachments = [];
      invoice.financePercent = 95.0;
      invoice.interestRate = 12.0;
      invoice.reqInterestRate = '';
      invoice.maxFinance = invoice.totPayment;
      invoice.showDetails = false;
    });

    this.getSellerBuyerLimitDetails();
    this.getTotalInvoiceAmount(this.applyFinanceDetails);
    this.currentScreen = 'FINANCE';
  }

  getSellerBuyerLimitDetails(): void {
    this.httpService
      .httpPost(
        'fscm/transactions/invoicePaymentApplyFinance/applyFinance/private/getSellerBuyerLimitDetails',
        {},
      )
      .subscribe((response: any) => {
        this.applyFinanceDetails.sellerDetail = [response.sellerDetails];
        this.applyFinanceDetails.sellerDetail[0].name =
          this.applyFinanceDetails.invoices[0].sellerBuyerName;
        this.applyFinanceDetails.buyerDetail = [response.buyerDetails];
        this.applyFinanceDetails.buyerDetail[0].name =
          this.applyFinanceDetails.invoices[0].applicantName;
      });
  }

  showAttachmentModal(i: number): void {
    this.selectedAttachmentIndex = i;
    this.selectedAttachments =
      this.applyFinanceDetails.invoices[this.selectedAttachmentIndex].attachments;
    this.isShowAttachmentModal = true;
  }

  onAttachmentSelected(files: any): void {
    this.applyFinanceDetails.invoices[this.selectedAttachmentIndex].attachments = files;
  }

  deleteAttachment(invoiceIndex: number, attachmentIndex: number): void {
    this.applyFinanceDetails.invoices[invoiceIndex].attachments.splice(attachmentIndex, 1);
  }

  getsubTotalFinanceRequired(): number {
    this.applyFinanceDetails.totalFinanceAppliedAmount = 0.0;
    this.applyFinanceDetails.invoices.forEach((invoice: Invoice) => {
      this.applyFinanceDetails.totalFinanceAppliedAmount =
        this.applyFinanceDetails.totalFinanceAppliedAmount +
        parseFloat(invoice.financeRequired.toString());
    });
    return this.applyFinanceDetails.totalFinanceAppliedAmount;
  }

  getFinanceTotal(): number {
    return this.getsubTotalFinanceRequired() - this.applyFinanceDetails.genericCNAmount;
  }

  onFinanceSubmit(): void {
    const url = this.mode
      ? 'fscm/transactions/invoicePaymentApplyFinance/applyFinance/private/update'
      : 'fscm/transactions/invoicePaymentApplyFinance/applyFinance/private/create';
    this.httpService.httpPost(url, this.applyFinanceDetails).subscribe((response: any) => {
      this.confirmMessage = 'The finance application has been successfully initiated.';
      this.isOpenConfirm = true;
    });
  }

  onConfirm(): void {
    if (this.mode) {
      this.navigateToListing();
    } else {
      this.currentScreen = 'FILTERS';
    }
  }

  navigateToListing(): void {
    this.location.back();
  }

  onCancelClick(): void {
    if (this.mode) {
      this.router.navigateByUrl(this.userService.dashboardRouteUrl);
    } else {
      this.selectedFilters = [];
      this.currentScreen = 'FILTERS';
    }
  }
}
