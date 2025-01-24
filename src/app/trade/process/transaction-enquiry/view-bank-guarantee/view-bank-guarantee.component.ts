import { Component, OnInit } from '@angular/core';
import { TransactionEnquiryService } from 'src/app/base/product-common/transaction-enquiry/@services/transaction-enquiry.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-bank-guarantee',
  templateUrl: './view-bank-guarantee.component.html',
  styleUrls: ['./view-bank-guarantee.component.scss'],
})
export class ViewBankGuaranteeComponent implements OnInit {
  orgTreeData: any[];

  constructor(
    private location: Location,
    private transactionEnquiryService: TransactionEnquiryService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.orgTreeData = [
      {
        type: 'single',
        nodes: [
          {
            isLeafNode: false,
            header: 'Bank Guarantee Initiate',
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
            header: 'Bank Guarantee Verified',
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
            header: 'Bank Guarantee Approved',
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
            header: 'Bank Guarantee Successfully Posted',
            subHeader: '',
            active: false,
            partiallyActive: false,
            disabled: true,
          },
        ],
      },
    ];
    this.viewService.setId(this.transactionEnquiryService.getId());
    this.viewService.setMode('VIEW');
  }

  backToSearch(): void {
    this.transactionEnquiryService.setActionName('onBack');
    this.location.back();
  }
}
