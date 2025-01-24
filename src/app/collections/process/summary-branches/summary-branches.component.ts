import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SummaryBranches } from './@model/summary-branches.model';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { Actions } from 'src/app/base/@models/actions';
import { ActionService } from 'src/app/base/main/@services/action.service';

@Component({
  selector: 'app-summary-branches',
  templateUrl: './summary-branches.component.html',
  styleUrls: ['./summary-branches.component.scss']
})
export class SummaryBranchesComponent implements OnInit {
  // @Output() close = new EventEmitter<void>();
  // @Output() closeDemoVideo = new EventEmitter<void>();
  @Output() onBackdrop = new EventEmitter<void>();

  showSuccessModal: boolean = false
  showModal: boolean = false

  onShowModal(val) {
    this.formData.pickupPointName = val.pickupName
    this.formData.pickupPointCode = val.pickupCode
    this.formData.location = val.location
    this.formData.address1 = val.address1
    this.formData.address2 = val.address2
    this.formData.startDate = val.startDate
    this.formData.endDate = val.endDate
  }

  videoClose() {
    this.formData.quickReq = null
    this.formData.product = null
    this.formData.pickupPointName = null
    this.formData.pickupPointCode = null
    this.formData.location = null
    this.formData.address1 = null
    this.formData.address2 = null
    this.formData.startDate = null
    this.formData.endDate = null
    this.formData.name = null
    this.formData.telephoneNumber = null
    this.formData.mobileNumber = null
    this.formData.emailId = null
    this.formData.pickupType = null
    this.formData.PickupDate = null
    this.formData.pickupTime1 = null
  }

  submit() {
    this.formData.quickReq = null
    this.formData.product = null
    this.formData.pickupPointName = null
    this.formData.pickupPointCode = null
    this.formData.location = null
    this.formData.address1 = null
    this.formData.address2 = null
    this.formData.startDate = null
    this.formData.name = null
    this.formData.telephoneNumber = null
    this.formData.mobileNumber = null
    this.formData.emailId = null
    this.formData.pickupType = null
    this.formData.PickupDate = null
    this.formData.pickupTime1 = null
    setTimeout(() => {
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Request has been submitted successfully.',
      });
    }, 2000);
  }

  menus: any = [];
  quickReq!: any;
  pickupData: any = [
    {
      label: 'Cash Pickup',
      completed: 10,
      pending: 90,
      NIL: 23,
      total: '12,455.00'
    },
    {
      label: 'Cheque Pickup',
      completed: 5,
      pending: 80,
      NIL: 20,
      total: '10,005.00'
    },
    {
      label: 'Cash Delivery',
      completed: 0,
      pending: 90,
      NIL: 0,
      total: '9,000.00'
    },
    {
      label: 'Document Pickup',
      completed: 20,
      pending: 80,
      NIL: 23,
      total: '8,670.00'
    }
  ]
  formData: SummaryBranches = new SummaryBranches();

  insights: any[] = [
    {
      icon: 'fa-info-circle',
      label: '20 Locations have reported NIL pickups in last 5 weeks.',
    },
    {
      icon: 'fa-info-circle',
      label: 'Your cash delivery limit has been breached by 50,000 INR.',
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
  selectedParentMenu: any
  calendarDate: Date[];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private toasterService: ToasterService,
    private actionsService: ActionService,
  ) { }





  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Head Office',
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
      { label: 'Summary' },
      { label: 'Branches' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.getParentMenus();
    this.onParentMenuSelected(this.pickupData[0]);

    this.calendarDate = [new Date('2023-08-28'), new Date('2023-08-26')];
  }


  onCreditAccountSelectionClick() {

  }

  getParentMenus() {
    this.menus = [
      {
        label: 'Cash Pickup',
        count: 123,
        data: 'parentMenu',
      },
      {
        label: 'Cheque Pickup',
        count: 105,
        data: 'parentMenu',
      },
      {
        label: 'Cash Delivery',
        count: 90,
        data: 'parentMenu',
      },
      {
        label: 'Document Pickup',
        count: 123,
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

  pickups = [
    { icon: 'fa-info-circle', label: 'Cash Pickup' },
    { icon: 'fa-info-circle', label: 'Document Pickup' },
    { icon: 'fa-info-circle', label: 'Cash Delivery' }
  ]



}
