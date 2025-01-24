import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { InvoiceEntry } from '../invoice-entry/@model/invoice-entry.model';
import { AmendInvoiceEntry } from './@models/amend-invoice.model';

@Component({
  selector: 'app-amend-invoice',
  templateUrl: './amend-invoice.component.html',
  styleUrls: ['./amend-invoice.component.scss'],
})
export class AmendInvoiceComponent implements OnInit {
  @ViewChild('itemDetailsGrid') itemDetailsGrid: any;

  loading: boolean;

  mode: string = '';

  currentField: string = '';
  showRemarkModal: boolean = false;

  remarkInput: string = '';

  formData: AmendInvoiceEntry = new AmendInvoiceEntry();

  currentScreen: string = 'FILTERS';

  selectedFilters: Filter[] = [];

  colDefUrl: string = 'fscm/transactions/amendInvoice/private/colDefs';
  rowData: any[] = [];
  context: any = { componentParent: this };
  frameworkComponents: any = {};
  gridOptions: any = {
    rowModelType: 'clientSide',
  };

  purchaseOrderDetailColDefs: any[] = [
    {
      headerName: 'Product Id',
      field: 'productId',
    },
    { headerName: 'PO Number', field: 'poNumber' },
    { headerName: 'PO Date', field: 'poDate' },
    { headerName: 'PO Amount', field: 'poAmount', cellRenderer: 'currencyRenderer' },
    { headerName: 'PO Due Date', field: 'poDueDate' },
  ];

  itemDetailReviewColDefs: any[] = [
    {
      headerName: 'Product Id',
      field: 'productId',
    },
    { headerName: 'Product Description', field: 'productDescription' },
    { headerName: 'Quantity', field: 'quantity' },
    { headerName: 'UM', field: 'um' },
    { headerName: 'Unit Price', field: 'unitPrice', cellRenderer: 'currencyRenderer' },
    { headerName: 'Amount', field: 'amount', cellRenderer: 'currencyRenderer' },
  ];

  entityName: string = 'SPONSOR_INVOICE_ACCEPTANCE';
  // entityName: string = 'NON_SPONSOR_INVOICE_ACCEPTANCE';

  stepperDetails: Stepper = {
    masterName: 'Amend Invoice',
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

  viewInvoiceData: InvoiceEntry = new InvoiceEntry();
  isViewInvoice: boolean = false;

  constructor(
    public breadcrumbService: BreadcrumbService,
    public actionService: ActionService,
    public viewService: ViewService,
    public httpService: HttpService,
    public toasterService: ToasterService,
    public router: Router,
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const breadcrumb: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'FSCM' },
      { label: 'Transactions' },
      { label: 'Amend Invoice' },
      { label: 'Initiate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumb);

    const actions: Actions = {
      heading: 'Invoice Amendment - Initiate',
      print: true,
      download: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionService.setActions(actions);

    this.mode = this.viewService.getMode();

    if (this.mode && (this.mode == 'EDIT' || this.mode == 'VIEW')) {
      if (this.mode == 'VIEW') {
        this.currentScreen = 'VIEW';
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      }

      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('fscm/transactions/amendInvoice/private/view', data)
        .subscribe((response: any) => {
          this.viewService.clearAll();
          this.formData = response;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onAmendment(id: string) {
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('fscm/transactions/invoiceAcceptance/private/view', data)
      .subscribe((formData: any) => {
        const preparedFormData: any = this.prepareAmendmentData(formData);

        this.formData = { ...preparedFormData, mandateReferenceNumber: formData.id };

        this.currentScreen = 'VIEW';
      });
  }

  close() {
    this.currentScreen = 'SEARCH_RESULTS';
  }

  getRecords(filters: Filter[]) {
    this.selectedFilters = filters;

    this.httpService
      .httpPost('fscm/transactions/amendInvoice/private/getAmendInvoiceList', {
        dataMap: filters,
      })
      .subscribe((data: any) => {
        this.rowData = data.dataList;
        this.currentScreen = 'SEARCH_RESULTS';
      });
  }

  prepareAmendmentData(formData: InvoiceEntry) {
    return {
      ...formData,
      invoiceDetails: [
        {
          ...formData.invoiceDetails[0],
          invoiceAmount: this.getAmendmentValue(formData.invoiceDetails[0].invoiceAmount),
          subDocType: this.getAmendmentValue(formData.invoiceDetails[0].subDocType),
          allocationNumber: this.getAmendmentValue(formData.invoiceDetails[0].allocationNumber),
          billingAddress: this.getAmendmentValue(formData.invoiceDetails[0].billingAddress),
          remarks: this.getAmendmentValue(formData.invoiceDetails[0].remarks),
        },
      ],
    };
  }

  onView(id: string) {
    this.httpService
      .httpPost('fscm/transactions/amendInvoice/private/getAcceptedAuthorizedInvoice', {
        dataMap: { id },
      })
      .subscribe((data: any) => {
        this.viewInvoiceData = data;
        this.isViewInvoice = true;
      });
  }

  resetViewInvoice() {
    this.viewInvoiceData = new InvoiceEntry();
    this.isViewInvoice = false;
  }

  private getAmendmentValue(value: string) {
    return [
      {
        value: value,
        newValue: value,
        remark: '',
        showRemark: false,
      },
    ];
  }

  onComment(field: string) {
    this.currentField = field;
    this.remarkInput = this.formData.invoiceDetails[0][field][0].remark;
    this.showRemarkModal = true;
  }

  addRemark() {
    this.formData.invoiceDetails[0][this.currentField][0].remark = this.remarkInput;
    this.showRemarkModal = false;
    this.currentField = '';
    this.remarkInput = '';
  }

  onDynamicFiltersReady() {}

  onStepChange(stepNo: number) {
    return true;
  }

  validateForm(stepNo: number) {
    return true;
  }

  beforeSubmit() {
    return true;
  }

  beforeSaveDraft() {
    return true;
  }

  beforeSaveTemplate() {
    return true;
  }
}
