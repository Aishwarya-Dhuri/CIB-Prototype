import { Component, OnInit } from '@angular/core';
import { data } from 'src/app/account-services/services/account-summary/@services/account-summery.data';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { TransactionEnquiryService } from 'src/app/base/product-common/transaction-enquiry/@services/transaction-enquiry.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { Location } from '@angular/common';
import { PaymentRequest } from 'src/app/payments/transactions/single-payment-request/@model/payment-request.model';
import { Actions } from 'src/app/base/@models/actions';
import { ColDef } from 'ag-grid-community';
@Component({
  selector: 'app-view-cash-transaction-details',
  templateUrl: './view-cash-transaction-details.component.html',
  styleUrls: ['./view-cash-transaction-details.component.scss']
})
export class ViewCashTransactionDetailsComponent implements OnInit {
  formData: PaymentRequest = {};
  orgTreeData: any[];
  transactionDetails: any[];
  selectedTransactionDetails: any;
  constructor( private httpService: HttpService,
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private location: Location,
    private transactionEnquiryService: TransactionEnquiryService) { }

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
      { label: 'Cash' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
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
  
  gridOptions: any = {
    pagination: false
  }
  colDefUrl: ColDef[] = [
    { field: 'denomination' },
    { field: 'quantity' },
    { field: 'amount' },
  ]
  dataUrl = [
    {
      denomination: '1000',
      quantity: '25',
      amount: '25,000.00',
     
    },

    {
      denomination: '500',
      quantity: '0',
      amount: '0',
     
    },
    {
      denomination: '100',
      quantity: '0',
      amount: '0',
     
    },
    {
      denomination: '20',
      quantity: '0',
      amount: '0',
     
    },
    {
      denomination: '10',
      quantity: '0',
      amount: '0',
     
    },
    {
      denomination: '5',
      quantity: '0',
      amount: '0',
     
    },
    {
      denomination: '2',
      quantity: '0',
      amount: '0',
     
    },
    {
      denomination: '1',
      quantity: '0',
      amount: '0',
     
    },
    
   
  ];

  coinscolDefUrl: ColDef[] = [
    { field: 'denomination' },
    { field: 'quantity' },
    { field: 'amount' },
  ];

  coinsdataUrl = [
    
    {
      denomination: '5',
      quantity: '0',
      amount: '0',
     
    },
    {
      denomination: '2',
      quantity: '0',
      amount: '0',
     
    },
    {
      denomination: '1',
      quantity: '0',
      amount: '0',
     
    },
    {
      denomination: '.50',
      quantity: '0',
      amount: '0',
     
    },
    {
      denomination: '.25',
      quantity: '0',
      amount: '0',
     
    },
    
   
  ];
}
