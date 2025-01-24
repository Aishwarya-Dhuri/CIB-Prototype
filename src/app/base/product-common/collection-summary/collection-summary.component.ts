import { Component, OnInit } from '@angular/core';
import { collectionSummary } from './@model/collection-summary.model';
import { BreadcrumbService } from '../../main/@services/breadcrumb.service';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';


@Component({
  selector: 'app-collection-summary',
  templateUrl: './collection-summary.component.html',
  styleUrls: ['./collection-summary.component.scss']
})
export class CollectionSummaryComponent implements OnInit {
  menus: any = [];
  quickReq!: any;
  pickupData: any = [
    {
      label: 'Cash Pickup',
      completed: 10,
      pending: 90,
      NIL: 23,
      total: 123
    },
    {
      label: 'Cheque Pickup',
      completed: 5,
      pending: 80,
      NIL: 20,
      total: 105
    },
    {
      label: 'Cash Delivery',
      completed: 0,
      pending: 90,
      NIL: 0,
      total: 90
    },
    {
      label: 'Document Pickup',
      completed: 20,
      pending: 80,
      NIL: 23,
      total: 123
    }
  ]
  formData: collectionSummary = new collectionSummary();

  insights: any[] = [
    {
      icon: 'fa-info-circle',
      label: 'Four accounts were added on 12 OCT 2021.',
    },
    {
      icon: 'fa-info-circle',
      label: 'RM details have been updated',
    },
    {
      icon: 'fa-info-circle',
      label: 'Your corporate category has been GOLD for past 5 years.',
    },
    {
      icon: 'fa-info-circle',
      label: 'Two corporates have been given credit line enhancements in the past quarter',
    },
  ];
  cashSummaryData: any = [];
  router: any;

  constructor(
    private breadcrumbService: BreadcrumbService,
  ) { }
  selectedParentMenu: any
  value: Date;
  ngOnInit(): void {
    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Collections' },
      { label: 'Collection Summary' },
      { label: 'Summary' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.getParentMenus();
    this.onParentMenuSelected(this.pickupData[0]);
  }

  onPaymentMethodWiseClick() {

  }
  onCreditAccountSelectionClick() {

  }

  getParentMenus() {
    this.menus = [
      {
        label: 'Cash Pickup',
        count: 40,
        data: 'parentMenu',
      },
      {
        label: 'Cheque Pickup',
        count: 50,
        data: 'parentMenu',
      },
      {
        label: 'Cash Delivery',
        count: 60,
        data: 'parentMenu',
      },
      {
        label: 'Document Pickup',
        count: 80,
        data: 'parentMenu',
      },
    ]
    return this.menus;
  }

  onParentMenuSelected(data: any) {
    const filterData = this.pickupData.filter((item) => item.label === data.label);
    this.cashSummaryData = filterData[0];
    console.log(this.cashSummaryData)
  }

}
