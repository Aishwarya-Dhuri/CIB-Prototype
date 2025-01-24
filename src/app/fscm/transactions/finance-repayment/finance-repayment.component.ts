import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { TransactionEnquiryService } from 'src/app/base/product-common/transaction-enquiry/@services/transaction-enquiry.service';
import { ListingAction } from 'src/app/shared/@components/ag-grid-listing/grid-action-renderer/listing-action.model';
import { InvoiceStatusRendererComponent } from 'src/app/shared/@components/ag-grid-listing/invoice-status-renderer/invoice-status-renderer.component';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Invoice } from '../invoice-payment-apply-finance/@models/invoice.model';
import { FinanceRepaymentDetail } from './@models/finance-repayment-detail.model';

@Component({
  selector: 'app-finance-repayment',
  templateUrl: './finance-repayment.component.html',
  styleUrls: ['./finance-repayment.component.scss'],
})
export class FinanceRepaymentComponent implements OnInit {
  mode: string;
  currentScreen: 'FILTERS' | 'LISTING' | 'REPAY' = 'FILTERS';
  @ViewChild('dynamicSearch') dynamicSearch: any;
  selectedFilters: Filter[] = [];

  dueInvoiceDuration: string = 'weeks';
  dueInvoiceList: Invoice[] = [];

  @ViewChild('searchResults') searchResultsGrid: any;

  searchColDefUrl: string = 'fscm/transactions/financeRepayment/private/searchResultsColDefs';
  searchRowDefUrl: string = 'fscm/transactions/financeRepayment/private/getSearchResultList';


  gridOptions = {
    rowSelection: 'multiple',
    /* paginationPageSize: 5, */
    context: { componentParent: this },
  };

  frameworkComponents: any = {
    invoiceStatusCellRenderer: InvoiceStatusRendererComponent,
  };
  selectedInvoices: Invoice[] = [];

  stepperDetails: Stepper = {
    masterName: 'Finance Repayment',
    currentStep: 1,
    isCancelOnRight: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['Invoices Details', 'Payment Details', 'Review and Submit'],
  };
  formData: FinanceRepaymentDetail;
  accountNoList: Select[];

  isOpenConfirm: boolean;
  confirmData: any = {};

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
    private listingService: ListingService,
    private userService: UserService,
    private menuService: MenuService,
    private router: Router,
    private transactionEnquiryService: TransactionEnquiryService,
  ) {
    if (this.viewService.getMode() == 'VIEW' || this.viewService.getMode() == 'EDIT') {
      this.getViewData(this.viewService.getMode(), this.viewService.getId());
    } else if (this.transactionEnquiryService.getActionName() == 'onBack') {
      this.backFromTransactionEnquiry();
    } else {
      this.currentScreen = 'FILTERS';
    }
  }

  getViewData(mode: string, id: string): void {
    this.mode = mode;
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('fscm/transactions/financeRepayment/private/view', data)
      .subscribe((viewResponse: any) => {
        delete viewResponse.responseStatus;
        viewResponse.isReview = mode == 'VIEW';
        this.viewService.clearAll();
        this.formData = new FinanceRepaymentDetail();
        this.formData = viewResponse;
        this.stepperDetails.currentStep = mode == 'VIEW' ? 3 : 1;
        this.getAccountNoList();
        this.currentScreen = 'REPAY';
      });
  }

  backFromTransactionEnquiry(): void {
    const transactionEnqData = this.transactionEnquiryService.getTransactionEnquiryData();
    this.mode = transactionEnqData.mode;
    this.stepperDetails = transactionEnqData.stepperDetails;
    this.dueInvoiceList = transactionEnqData.dueInvoiceList;
    this.selectedFilters = transactionEnqData.selectedFilters;
    this.selectedInvoices = transactionEnqData.selectedInvoices;
    this.selectSearchListingRows();
    this.formData = transactionEnqData.formData;
    this.accountNoList = transactionEnqData.accountNoList;
    this.currentScreen = transactionEnqData.currentScreen;
    this.transactionEnquiryService.clearAll();
  }

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Finance Repayment',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'pi pi-home' },
      { label: 'FSCM' },
      { label: 'Transactions' },
      { label: 'Finance Repayment' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    if (this.currentScreen == 'FILTERS') {
      this.onChangeDueInvoiceDuration();
    }
  }

  onDynamicFiltersReady(): void {
    this.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }

  onChangeDueInvoiceDuration(): void {
    this.dueInvoiceList = [];
    const url = 'fscm/transactions/financeRepayment/private/getDueInvoices';
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

  singleRePay(id: string): void {
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('fscm/transactions/invoiceEntry/private/view', data)
      .subscribe((invoiceMst: any) => {
        delete invoiceMst.responseStatus;
        invoiceMst.invoiceDetails[0].status =
          invoiceMst.invoiceDetails[0].status == 'OVERDUE' ? 'Overdue' : 'Normal';
        this.selectedFilters = [];
        this.rePay([invoiceMst.invoiceDetails[0]]);
      });
  }

  getRecords(filters: Filter[]): void {
    this.selectedFilters = filters;
    this.currentScreen = 'LISTING';
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
    const invoices =
      this.currentScreen == 'LISTING' ? this.selectedInvoices : this.formData.invoices;
    let total = 0;
    invoices.forEach((invoice: Invoice) => {
      total = total + parseFloat(invoice.repaymentAmt.toString());
    });
    return total;
  }

  getTotalPayableCurrency(): string {
    return this.selectedInvoices.length > 0 ? this.selectedInvoices[0].currencyName : '';
  }

  rePay(invoices: Invoice[]): void {
    this.selectedInvoices = invoices;
    this.formData = new FinanceRepaymentDetail();
    this.formData.invoices = this.selectedInvoices;
    this.formData.applicantId = this.formData.invoices[0].applicantId;
    this.formData.applicantCode = this.formData.invoices[0].applicantCode;
    this.formData.applicantName = this.formData.invoices[0].applicantName;
    this.formData.sellerBuyerId = this.formData.invoices[0].sellerBuyerId;
    this.formData.sellerBuyerCode = this.formData.invoices[0].sellerBuyerCode;
    this.formData.sellerBuyerName = this.formData.invoices[0].sellerBuyerName;
    this.formData.currencyName = this.formData.invoices[0].currencyName;
    this.formData.paymentDate = this.userService.applicationDate;
    this.formData.fxRate = '7.90';

    this.formData.invoices.forEach((invoice: Invoice) => {
      invoice.amountBeingPaid = invoice.repaymentAmt;
      invoice.showDetails = false;
    });

    this.formData.sponsorAccountNo = '1000001200011';
    this.formData.sponsorIntrestAccountNo = '1000001200012';
    this.formData.sellerIntrestAccountNo = '1000001200021';

    this.getAccountNoList();
    this.stepperDetails.currentStep = 1;
    this.currentScreen = 'REPAY';
  }

  getAccountNoList(): void {
    const data = { dataMap: { corporateId: this.userService.userDetails.corporateId } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        this.accountNoList = response.dataList;
        if (this.accountNoList.length > 0) {
          this.formData.sponsorAccountNo = this.accountNoList[0].displayName;
        }
        if (this.accountNoList.length > 1) {
          this.formData.sponsorIntrestAccountNo = this.accountNoList[1].displayName;
        }
        if (this.accountNoList.length > 2) {
          this.formData.sellerIntrestAccountNo = this.accountNoList[2].displayName;
        }
      });
  }

  onAccountSelection(): void {
    const account = this.accountNoList.find((a: any) => a.id === this.formData.debitAccountId);
    if (!account) return;
    this.formData.debitAccountNo = account.displayName;
    this.formData.accountBalance = account.enrichments.balance;
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return true;
    } else if (stepNo == 2) {
      return true;
    }
    return true;
  }

  getSubHeading(stepNo: number): string {
    if (stepNo == 1) {
      return (
        this.formData.invoices.length +
        ' Invoices, TOTAL - ' +
        this.formData.currencyName +
        ' ' +
        this.getTotalPayable().toFixed(2)
      );
    } else if (stepNo == 2) {
      return this.formData.paymentMethod;
    }
    return 'Step' + stepNo + ' Details';
  }

  viewInvoice(id: string): void {
    //show transaction enquiry screen here
    this.transactionEnquiryService.setActionName('onView');
    this.transactionEnquiryService.setId(id);
    this.transactionEnquiryService.setTransactionEnquiryData({
      mode: this.mode,
      stepperDetails: this.stepperDetails,
      currentScreen: this.currentScreen,
      dueInvoiceList: this.dueInvoiceList,
      selectedFilters: this.selectedFilters,
      selectedInvoices: this.selectedInvoices,
      formData: this.formData,
      accountNoList: this.accountNoList,
    });
    this.router.navigateByUrl('fscm/process/transactionEnquiry/viewTransaction');
  }

  deleteInvoice(i: number): void {
    this.formData.invoices.splice(i, 1);
    if (this.formData.invoices.length == 0 && !this.mode) {
      this.currentScreen = 'FILTERS';
    } else if (this.formData.invoices.length == 0 && this.mode) {
      this.navigateToListing();
    }
  }

  showHideInvoiceDetails(i: number): void {
    if (!this.formData.invoices[i].showDetails) {
      this.formData.invoices.forEach((invoice: any) => {
        invoice.showDetails = false;
      });
    }
    this.formData.invoices[i].showDetails = !this.formData.invoices[i].showDetails;
  }

  beforeSubmit(): boolean {
    this.formData.totalInvoiceAmount = 0.0;
    this.formData.totalFinanceAmt = 0.0;
    this.formData.noIfInvoices = this.formData.invoices.length;
    this.formData.totalRepaymentAmt = this.getTotalPayable();
    this.formData.invoices.forEach((invoice: Invoice) => {
      this.formData.totalInvoiceAmount = this.formData.totalInvoiceAmount + invoice.totPayment;
      this.formData.totalFinanceAmt = this.formData.totalFinanceAmt + invoice.financeProcessedAmt;
    });
    return true;
  }

  afterSubmit(response: any): boolean {
    this.formData.invoices.forEach((invoice: any) => {
      invoice.showDetails = false;
    });
    this.isOpenConfirm = true;
    this.confirmData = {
      batchNo: response.dataMap.id,
      date: moment().format('DD-MMM-YYYY'),
      time: moment().format('h:mm a'),
    };
    return false;
  }

  navigateToListing(): void {
    this.isOpenConfirm = false;
    this.listingService.setSelectedListCode('PENDINGLIST');
    this.router.navigateByUrl(this.menuService.getSelectedServiceUrl() + '/listing');
  }
}
