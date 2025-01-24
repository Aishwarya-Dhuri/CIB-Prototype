import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { TransactionEnquiryService } from 'src/app/base/product-common/transaction-enquiry/@services/transaction-enquiry.service';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss'],
})
export class ViewTransactionComponent implements OnInit {
  selectedTransactionDetails: any;
  subTreeData: any;

  orgTreeData: any[] = [
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Invoice Entry',
          subHeader: '12 Aug 2021, 13:35',
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },

    {
      type: 'single-branched',
      nodes: [
        {
          isLeafNode: false,
          header: 'Invoice Acceptance',
          subHeader: '16 Aug 2021, 14:27',
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },

    {
      type: 'branched',
      nodes: [
        {
          isLeafNode: true,
          header: 'Invoice Payment',
          subHeader: '19 Aug 2021, 12:16',
          active: true,
          partiallyActive: false,
          disabled: false,
          degree: 1,
        },
        {
          isLeafNode: false,
          header: 'Apply for Finance',
          subHeader: 'In Process',
          active: false,
          partiallyActive: true,
          disabled: false,
          degree: 2,
        },
      ],
    },

    {
      type: 'branched',

      nodes: [
        {},
        {
          isLeafNode: false,
          header: 'Process Finance',
          subHeader: '',
          active: false,
          partiallyActive: false,
          disabled: true,
          degree: 2,
        },
      ],
    },

    {
      type: 'branched',

      nodes: [
        {},
        {
          isLeafNode: true,
          header: 'Repayment',
          subHeader: '',
          active: false,
          partiallyActive: false,
          disabled: true,
          degree: 2,
        },
      ],
    },
  ];

  detailsHeader: string;

  transactionDetails: any[];

  constructor(
    private httpService: HttpService,
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private location: Location,
    private transactionEnquiryService: TransactionEnquiryService,
  ) {}

  ngOnInit(): void {
    this.httpService
      .httpPost('fscm/process/transactionEnquiry/private/viewTransactions/viewTransaction', {})
      .subscribe((transactionDetails) => {
        this.transactionDetails = transactionDetails;
        this.selectedTransactionDetails = this.transactionDetails[0];
        this.detailsHeader = this.transactionDetails[0].label;
      });

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
      { label: 'FSCM' },
      { label: 'Process' },
      { label: 'Transaction Enquiry' },
      { label: 'Search Results' },
      { label: 'View Transaction' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }

  onTransactionSelected(transactionDetail: any) {
    this.subTreeData = null;
    this.selectedTransactionDetails = transactionDetail;
    this.detailsHeader = transactionDetail.label;
  }

  back() {
    this.detailsHeader = this.selectedTransactionDetails.label;
    this.subTreeData = null;
  }

  onLinkClicked(link: any) {
    this.httpService.httpPost(link.link, {}).subscribe((transactionDetails) => {
      this.detailsHeader = `${link.header} (${link.label})`;
      this.subTreeData = transactionDetails;
    });
  }

  backToSearch(): void {
    this.transactionEnquiryService.setActionName('onBack');
    this.location.back();
  }
}
