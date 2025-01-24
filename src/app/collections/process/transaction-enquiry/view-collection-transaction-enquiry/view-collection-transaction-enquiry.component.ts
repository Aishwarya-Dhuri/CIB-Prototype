import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { TransactionEnquiryService } from 'src/app/base/product-common/transaction-enquiry/@services/transaction-enquiry.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { PaymentRequest } from 'src/app/payments/transactions/single-payment-request/@model/payment-request.model';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { Location } from '@angular/common';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-view-collection-transaction-enquiry',
  templateUrl: './view-collection-transaction-enquiry.component.html',
  styleUrls: ['./view-collection-transaction-enquiry.component.scss']
})
export class ViewCollectionTransactionEnquiryComponent implements OnInit {
  formData: PaymentRequest = {};
  orgTreeData: any[];
  transactionDetails: any[];
  selectedTransactionDetails: any;

  constructor(   private httpService: HttpService,
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private location: Location,
    private transactionEnquiryService: TransactionEnquiryService,) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Transaction Enquiry - View',
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
      { label: 'Collections' },
      { label: 'Process' },
      { label: 'Transaction Enquiry' },
      { label: 'Cheque' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove ends */

    this.orgTreeData = [
      {
        type: 'single',
        nodes: [
          {
            isLeafNode: false,
            header: 'Payment Initiate',
            subHeader: '12 Aug 2021, 13:35',
            active: true,
            partiallyActive: false,
            disabled: false,
          },
        ],
      },

      {
        type: 'single',
        nodes: [
          {
            isLeafNode: false,
            header: 'Payment Verified',
            subHeader: '16 Aug 2021, 14:27',
            active: true,
            partiallyActive: false,
            disabled: false,
          },
        ],
      },

      {
        type: 'single',
        nodes: [
          {
            isLeafNode: false,
            header: 'Payment Approved',
            subHeader: '19 Aug 2021, 12:16',
            active: true,
            partiallyActive: false,
            disabled: false,
          },
        ],
      },

      {
        type: 'single',

        nodes: [
          {
            isLeafNode: false,
            header: 'Send To Bank',
            subHeader: '',
            active: false,
            partiallyActive: false,
            disabled: true,
          },
        ],
      },

      {
        type: 'single',

        nodes: [
          {
            isLeafNode: true,
            header: 'Payment Successfully Posted',
            subHeader: '',
            active: false,
            partiallyActive: false,
            disabled: true,
          },
        ],
      },
    ];

    this.transactionDetails = [
      { label: '1.1 Payment Details', data: { key: 'paymentDetails' } },
      { label: '1.2 Routing Details', data: { key: 'routingDetails' } },
      { label: '1.3 Beneficiary Details', data: { key: 'beneficiaryDetails' } },
      { label: '1.4 Enrichment Details', data: { key: 'enrichmentDetails' } },
      { label: '1.5 Supporting Document', data: { key: 'supportingDocument' } },
      { label: '1.6 Maker Checker Details', data: { key: 'makerCheckerDetails' } },
    ];

    const data = { dataMap: { id: this.transactionEnquiryService.getId() } };
    // const data = {"dataMap":{"id":1640785469017}};
    this.httpService
      .httpPost('payments/transactions/singlePaymentRequest/private/view', data)
      .subscribe((formData: PaymentRequest) => {
        this.formData = formData;
        this.selectedTransactionDetails = this.transactionDetails[0];
      });
  }

  onTransactionSelected(transactionDetail: any) {
    this.selectedTransactionDetails = transactionDetail;
  }

  backToSearch(): void {
    this.transactionEnquiryService.setActionName('onBack');
    this.location.back();
  }

  
}
