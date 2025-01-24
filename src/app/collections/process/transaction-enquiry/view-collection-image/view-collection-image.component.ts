import { Component, OnInit } from '@angular/core';
import { data } from 'src/app/account-services/services/account-summary/@services/account-summery.data';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { TransactionEnquiryService } from 'src/app/base/product-common/transaction-enquiry/@services/transaction-enquiry.service';
import { PaymentRequest } from 'src/app/payments/transactions/single-payment-request/@model/payment-request.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { Location } from '@angular/common';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { Actions } from 'src/app/base/@models/actions';

@Component({
  selector: 'app-view-collection-image',
  templateUrl: './view-collection-image.component.html',
  styleUrls: ['./view-collection-image.component.scss']
})
export class ViewCollectionImageComponent implements OnInit {
  formData: PaymentRequest = {};
  orgTreeData: any[];
  transactionDetails: any[];
  selectedTransactionDetails: any;
  constructor(private httpService: HttpService,
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
      { label: 'View Collection Image' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    
    // this.httpService
    // .httpPost('payments/transactions/singlePaymentRequest/private/view', data)
    // .subscribe((formData: PaymentRequest) => {
    //   this.formData = formData;
    //   this.selectedTransactionDetails = this.transactionDetails[0];
    // });
  }
  onTransactionSelected(transactionDetail: any) {
    this.selectedTransactionDetails = transactionDetail;
  }

  backToSearch(): void {
    this.transactionEnquiryService.setActionName('onBack');
    this.location.back();
  }
}
