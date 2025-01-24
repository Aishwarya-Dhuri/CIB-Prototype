import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import {
  InvoiceDetails,
  InvoiceEntry,
  ItemDetails,
  PurchaseOrder,
} from './@model/invoice-entry.model';

@Component({
  selector: 'app-invoice-entry',
  templateUrl: './invoice-entry.component.html',
  styleUrls: ['./invoice-entry.component.scss'],
})
export class InvoiceEntryComponent implements OnInit {
  @ViewChild('itemDetailsGrid') itemDetailsGrid: any;

  loading: boolean;
  formData: any = new InvoiceEntry();

  poColDefs: any[] = [];

  purchaseOrderDetailColDefs: any[] = [
    { headerName: 'PO Number', field: 'poNumber' },
    { headerName: 'PO Date', field: 'poDate' },
    { headerName: 'PO Amount', field: 'poAmount' },
    { headerName: 'PO Due Date', field: 'poDueDate' },
  ];

  itemDetailColDefs: any[] = [
    {
      headerName: 'Product Id',
      field: 'productId',
    },
    { headerName: 'Product Description', field: 'productDescription' },
    { headerName: 'Quantity', field: 'quantity' },
    { headerName: 'UM', field: 'um' },
    { headerName: 'Unit Price', field: 'unitPrice' },
    { headerName: 'Amount', field: 'amount' },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: 'actionCellRenderer',
    },
  ];
  itemDetailReviewColDefs: any[] = [
    {
      headerName: 'Product Id',
      field: 'productId',
    },
    { headerName: 'Product Description', field: 'productDescription' },
    { headerName: 'Quantity', field: 'quantity' },
    { headerName: 'UM', field: 'um' },
    { headerName: 'Unit Price', field: 'unitPrice' },
    { headerName: 'Amount', field: 'amount' },
  ];

  itemDetails: ItemDetails = new ItemDetails();

  mode: string = '';

  showSearchModal: boolean = false;
  searchModelHeader: string = '';
  searchModelColDefsUrl: string = '';
  searchModelRowDataUrl: string = '';
  searchModelRowDataReq: any = {};

  stepperDetails: Stepper = {
    masterName: 'Invoice Entry',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isSaveAsTemplateApplicable: true,
    isSaveDraftApplicable: true,
    isOnlyFooter: true,
    headings: [
      'Entity Selection',
      'Invoice Details',
      'Other Details',
      'Item Details',
      'Review and Submit',
    ],
  };

  constructor(
    public breadcrumbService: BreadcrumbService,
    public actionService: ActionService,
    public viewService: ViewService,
    public httpService: HttpService,
    public toasterService: ToasterService,
    public userService: UserService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const breadcrumb: Breadcrumb[] = [
      {
        icon: 'fa-home',
      },
      {
        label: 'FSCM',
      },
      {
        label: 'Transactions',
      },
      {
        label: 'Invoice Entry',
      },
      {
        label: 'Initiate',
      },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumb);

    const actions: Actions = {
      heading: 'Invoice ENtry - Initiate',
      print: true,
      download: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionService.setActions(actions);

    this.formData.invoiceDetails[0].invoiceEntryDate = this.userService.userDetails.applicationDate;
    this.formData.invoiceDetails[0].invoiceDate = this.userService.userDetails.applicationDate;

    this.mode = this.viewService.getMode();

    if (this.mode && (this.mode == 'EDIT' || this.mode == 'VIEW')) {
      if (this.mode == 'VIEW') {
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      }

      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('fscm/transactions/invoiceEntry/private/view', data)
        .subscribe((response: any) => {
          this.formData = response;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onSponsorCode(data: any) {
    this.formData.sponsorId = data.id;
    this.formData.sponsorCode = data.sponsorCode;
    this.formData.sponsorName = data.sponsorName;
  };

  onSellerCode(data: any) {
    this.formData.sellerBuyerId = data.id;
    this.formData.sellerBuyerCode = data.sellerBuyerCode;
    this.formData.sellerBuyerName = data.sellerBuyerName;
  };

  onEntityCode(data: any) {
    this.formData.entitySubCodeId = data.id;
    this.formData.entitySubCode = data.entitySubCode;
    this.formData.entitySubCodeDescription = data.entitySubCodeDescription;
  };


  onChangeInvoiceDueDays() {
    if (this.formData.invoiceDetails[0].invoiceDueDays) {
      this.formData.invoiceDetails[0].invoiceDueDate = moment(
        this.formData.invoiceDetails[0].invoiceDate,
        'DD-MMM-YYYY',
      )
        .add(this.formData.invoiceDetails[0].invoiceDueDays, 'days')
        .format('DD-MMM-YYYY');
    }
  }

  onChangeInvoiceDueDate() {
    if (this.formData.invoiceDetails[0].invoiceDueDate) {
      const startDate = moment(this.formData.invoiceDetails[0].invoiceDate, 'DD-MMM-YYYY');
      const endDate = moment(this.formData.invoiceDetails[0].invoiceDueDate, 'DD-MMM-YYYY');
      this.formData.invoiceDetails[0].invoiceDueDays = endDate.diff(startDate, 'days');
    }
  }

  onChangeInvoiceAmount() {
    this.formData.invoiceDetails[0].invoiceOutstandingAmount =
      this.formData.invoiceDetails[0].invoiceAmount;

    this.formData.invoiceDetails[0].totalPayableAmount =
      this.formData.invoiceDetails[0].invoiceOutstandingAmount;
  }

  onChangeVatPercentage() {
    this.formData.invoiceDetails[0].vatAmount =
      (this.formData.invoiceDetails[0].invoiceAmount / 100) *
      +this.formData.invoiceDetails[0].vatPercentage;

    this.formData.invoiceDetails[0].invoiceOutstandingAmount =
      +this.formData.invoiceDetails[0].invoiceAmount + +this.formData.invoiceDetails[0].vatAmount;

    this.formData.invoiceDetails[0].totalPayableAmount =
      this.formData.invoiceDetails[0].invoiceOutstandingAmount;
  }

  onChangeWhtPercentage() {
    this.formData.invoiceDetails[0].whtAmount =
      ((this.formData.invoiceDetails[0].whtCalculatedOn &&
      this.formData.invoiceDetails[0].whtCalculatedOn != 'Invoice Amount'
        ? this.formData.invoiceDetails[0].invoiceOutstandingAmount
        : this.formData.invoiceDetails[0].invoiceAmount) /
        100) *
      +this.formData.invoiceDetails[0].whtPercentage;

    this.formData.invoiceDetails[0].totalPayableAmount =
      +this.formData.invoiceDetails[0].invoiceAmount +
      +this.formData.invoiceDetails[0].vatAmount -
      +this.formData.invoiceDetails[0].whtAmount;
  }

  onChangeWhtCalculatedOn() {
    this.onChangeWhtPercentage();
  }

  calculateItemAmount() {
    if (this.itemDetails.quantity && this.itemDetails.unitPrice) {
      this.itemDetails.amount = (+this.itemDetails.quantity * +this.itemDetails.unitPrice).toFixed(
        2,
      );
    }
  }

  onSearchSponsor() {
    this.searchModelHeader = 'Sponsor';
    this.searchModelColDefsUrl = 'fscm/transactions/invoiceEntry/private/sponsorColDefs';
    this.searchModelRowDataUrl = 'fscm/transactions/invoiceEntry/private/getSponsorData';
    this.searchModelRowDataReq = {};
    this.showSearchModal = true;
  }

  onSearchSellerBuyer() {
    this.searchModelHeader = 'Seller/Buyer';
    this.searchModelColDefsUrl = 'fscm/transactions/invoiceEntry/private/sellerBuyerColDefs';
    this.searchModelRowDataUrl = 'fscm/transactions/invoiceEntry/private/getSellerBuyerData';
    this.searchModelRowDataReq = { sponsorCode: this.formData.sponsorCode };
    this.showSearchModal = true;
  }

  onSearchEntityCode() {
    this.searchModelHeader = 'Entity Code';
    this.searchModelColDefsUrl = 'fscm/transactions/invoiceEntry/private/entitySubCodeColDefs';
    this.searchModelRowDataUrl = 'fscm/transactions/invoiceEntry/private/getEntitySubCodeData';
    this.searchModelRowDataReq = { sellerBuyerCode: this.formData.sellerBuyerCode };
    this.showSearchModal = true;
  }

  onSelectSearchData(data: any) {
    if (this.searchModelHeader == 'Sponsor') {
      this.formData.sponsorId = data.id;
      this.formData.sponsorCode = data.sponsorCode;
      this.formData.sponsorName = data.sponsorName;
    } else if (this.searchModelHeader == 'Seller/Buyer') {
      this.formData.sellerBuyerId = data.id;
      this.formData.sellerBuyerCode = data.sellerBuyerCode;
      this.formData.sellerBuyerName = data.sellerBuyerName;
    } else if (this.searchModelHeader == 'Entity Code') {
      this.formData.entitySubCodeId = data.id;
      this.formData.entitySubCode = data.entitySubCode;
      this.formData.entitySubCodeDescription = data.entitySubCodeDescription;
    }

    if (this.searchModelHeader == 'Sponsor') {
      this.formData.sellerBuyerCode = '';
      this.formData.sellerBuyerName = '';
    }

    if (this.searchModelHeader == 'Sponsor' || this.searchModelHeader == 'Seller/Buyer') {
      this.formData.productCategory = '';
      this.formData.programReferenceNumberName = '';
      this.formData.entitySubCode = '';
      this.formData.entitySubCodeDescription = '';
    }

    this.showSearchModal = false;
    this.searchModelHeader = '';
    this.searchModelColDefsUrl = '';
    this.searchModelRowDataUrl = '';
    this.searchModelRowDataReq = {};
  }

  onChangePoNumber(po: any, i: number) {
    const index = this.formData.poDetails.findIndex((curPo: any) => curPo.poNumber == po.id);

    if (index >= 0 && index !== i) {
      this.formData.poDetails[i].poNumber = '';
      const msg = 'This PO Already Added';
      this.toasterService.showToaster({ severity: 'error', detail: msg });
      return;
    }

    this.formData.poDetails[i].poNumber = po.enrichments.poNumber;
    this.formData.poDetails[i].poDate = po.enrichments.poDate;
    this.formData.poDetails[i].poAmount = po.enrichments.poAmount;
    this.formData.poDetails[i].poDueDate = po.enrichments.poDueDate;
  }

  addItemDetails() {
    this.formData.itemDetails.push({
      ...this.itemDetails,
      actions: [
        {
          index: 0,
          paramList: 'id',
          methodName: 'deleteItemDetails',
          type: 'ICON',
          icon: 'fa-trash-alt',
          displayName: 'DELETE',
        },
      ],
    });

    this.itemDetails = new ItemDetails();

    this.setItemDetails();

    if (this.itemDetailsGrid) {
      this.itemDetailsGrid.setRowData(this.formData.itemDetails);
    }
  }

  deleteItemDetails(index: number) {
    this.formData.itemDetails.splice(index, 1);

    this.setItemDetails();

    if (this.itemDetailsGrid) {
      this.itemDetailsGrid.setRowData(this.formData.itemDetails);
    }
  }

  setItemDetails() {
    let totalAmount = 0;
    let totalProductItems = 0;

    this.formData.itemDetails.forEach((item: ItemDetails) => {
      totalAmount += +item.amount;
      totalProductItems += +item.quantity;
    });

    this.formData.totalAmount = totalAmount;
    this.formData.totalProductItems = totalProductItems;
  }

  addPoDetails() {
    this.formData.poDetails.push(new PurchaseOrder());
  }

  deletePoDetails(i: number) {
    if (i == 0) {
      this.formData.poDetails[i].poNumber = '';
      this.formData.poDetails[i].poDate = '';
      this.formData.poDetails[i].poAmount = '';
      this.formData.poDetails[i].poDueDate = '';
    } else {
      this.formData.poDetails.splice(i, 1);
    }
  }

  onStepChange(stepNo: number) {
    return true;
  }

  validateForm(stepNo: number) {
    return true;
  }

  beforeSubmit() {
    this.formData.invoiceNumber = this.formData.invoiceDetails[0].invoiceNumber;
    this.formData.invoiceEntryDate = this.formData.invoiceDetails[0].invoiceEntryDate;
    this.formData.invoiceDate = this.formData.invoiceDetails[0].invoiceDate;
    this.formData.invoiceDueDate = this.formData.invoiceDetails[0].invoiceDueDate;
    this.formData.invoiceAmount = this.formData.invoiceDetails[0].invoiceAmount;
    this.formData.totalPos = this.formData.poDetails.length;
    this.formData.amount = this.formData.invoiceDetails[0].invoiceAmount;

    this.formData.supplierId = this.formData.sellerBuyerId;
    this.formData.supplierCode = this.formData.sellerBuyerCode;
    this.formData.supplierName = this.formData.sellerBuyerName;
    this.formData.dealerId = this.formData.sponsorId;
    this.formData.dealerCode = this.formData.sponsorCode;
    this.formData.dealerName = this.formData.sponsorName;
    this.formData.applicantId = this.formData.sponsorId;
    this.formData.applicantCode = this.formData.sponsorCode;
    this.formData.applicantName = this.formData.sponsorName;
    this.formData.maturityDate = this.formData.invoiceDetails[0].invoiceDueDate;
    this.formData.totalInvAmount = this.formData.invoiceAmount;
    this.formData.totalInvBaseAmount = this.formData.invoiceAmount;
    this.formData.amountBeingPaid = this.formData.invoiceDetails[0].totalPayableAmount;

    this.formData.invoiceDetails = this.formData.invoiceDetails.map(
      (invoiceDetails: InvoiceDetails) => {
        invoiceDetails.entryDate = invoiceDetails.invoiceEntryDate;
        invoiceDetails.sellerBuyerId = this.formData.sellerBuyerId;
        invoiceDetails.sellerBuyerCode = this.formData.sellerBuyerCode;
        invoiceDetails.sellerBuyerName = this.formData.sellerBuyerName;
        invoiceDetails.NPADate = invoiceDetails.invoiceEntryDate;
        invoiceDetails.baseAmount = invoiceDetails.invoiceAmount;
        invoiceDetails.number = invoiceDetails.invoiceNumber;
        invoiceDetails.date = invoiceDetails.invoiceDate;
        invoiceDetails.dueDate = invoiceDetails.invoiceDueDate;
        invoiceDetails.amount = invoiceDetails.invoiceAmount;
        invoiceDetails.appliedAmt = invoiceDetails.totalPayableAmount;
        invoiceDetails.invDueDays = invoiceDetails.invoiceDueDays;
        invoiceDetails.invOutstandingAmount = invoiceDetails.invoiceOutstandingAmount;
        invoiceDetails.vatAmt = invoiceDetails.vatAmount;
        invoiceDetails.whtAmt = invoiceDetails.whtAmount;
        invoiceDetails.totPayment = invoiceDetails.totalPayableAmount;
        invoiceDetails.entitySubCode = this.formData.entitySubCode;
        invoiceDetails.entitySubCodeDescThai = this.formData.entitySubCodeDescription;
        // invoiceDetails.invAmountCurr = invoiceDetails;

        invoiceDetails.supplierId = this.formData.sellerBuyerId;
        invoiceDetails.supplierCode = this.formData.sellerBuyerCode;
        invoiceDetails.supplierName = this.formData.sellerBuyerName;
        invoiceDetails.dealerId = this.formData.sponsorId;
        invoiceDetails.dealerCode = this.formData.sponsorCode;
        invoiceDetails.dealerName = this.formData.sponsorName;

        invoiceDetails.financeAppliedDate = '';
        invoiceDetails.acceptanceDate = '';
        invoiceDetails.currencyName = '';
        invoiceDetails.programRefName = '';
        invoiceDetails.corpSellerCode = '';

        invoiceDetails.applicantId = this.formData.sponsorId;
        invoiceDetails.applicantCode = this.formData.sponsorCode;
        invoiceDetails.applicantName = this.formData.sponsorName;

        invoiceDetails.productName = '';
        invoiceDetails.productType = '';
        invoiceDetails.trackingCode = '';
        invoiceDetails.groupPayDate = '';
        invoiceDetails.financeProcessedAmt = '';
        invoiceDetails.maturityDate = invoiceDetails.invoiceDueDate;
        invoiceDetails.repaymentAmt = '';
        invoiceDetails.recoverdAmt = '';
        invoiceDetails.principalAmt = '';
        invoiceDetails.intrestAmt = '';
        invoiceDetails.penalIntrestAmt = '';
        invoiceDetails.marginAmt = '';

        return invoiceDetails;
      },
    );

    this.formData.poDetails = this.formData.poDetails
      .filter((po: any) => !!po.poNumber)
      .map((po: any) => {
        po.number = po.poNumber;
        po.date = po.poDate;
        po.amount = po.poAmount;
        po.dueDate = po.poDueDate;

        return po;
      });
    this.formData.totalPos = this.formData.poDetails.length;

    return true;
  }

  beforeSaveDraft() {
    return true;
  }

  beforeSaveTemplate() {
    return true;
  }
}
