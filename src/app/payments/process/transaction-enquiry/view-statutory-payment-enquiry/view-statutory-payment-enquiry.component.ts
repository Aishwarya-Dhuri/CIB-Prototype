import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { TransactionEnquiryService } from 'src/app/base/product-common/transaction-enquiry/@services/transaction-enquiry.service';
import { PaymentRequest } from 'src/app/payments/transactions/single-payment-request/@model/payment-request.model';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-view-statutory-payment-enquiry',
  templateUrl: './view-statutory-payment-enquiry.component.html',
  styleUrls: ['./view-statutory-payment-enquiry.component.scss'],
})
export class ViewStatutoryPaymentEnquiryComponent implements OnInit {
  formData: PaymentRequest = {};
  orgTreeData: any[];
  transactionDetails: any[];
  selectedTransactionDetails: any;

  constructor(
    private httpService: HttpService,
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private location: Location,
    private transactionEnquiryService: TransactionEnquiryService,
  ) {}

  ngOnInit(): void {
    /* remove start */
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
      { label: 'Payments' },
      { label: 'Process' },
      { label: 'Transaction Enquiry' },
      { label: 'Statutory Payment' },
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
            isLeafNode: false,
            header: 'Payment Processing',
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
            header: 'Payment Success',
            subHeader: '',
            active: false,
            partiallyActive: false,
            disabled: true,
          },
        ],
      },
    ];

    this.transactionDetails = [
      { label: '1.1 Institution Details', data: { key: 'institutionDetails' } },
      { label: '1.2 Tax Details', data: { key: 'taxDetails' } },
      { label: '1.3 Payment Details', data: { key: 'paymentDetails' } },
      { label: '1.4 Supporting Document', data: { key: 'supportingDocument' } },
      { label: '1.5 Maker Checker Details', data: { key: 'makerCheckerDetails' } },
    ];

    const data = { dataMap: { id: this.transactionEnquiryService.getId() } };
    // const data = {"dataMap":{"id":1640792952364}};
    this.httpService
      .httpPost('payments/transactions/statutoryPayment/private/view', data)
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
