import { Component, EventEmitter, OnInit, Input, Output, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { SummaryHeadOffice } from './@model/summary-head-office.model';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { Product } from './product';
import { ProductService } from './@service/product.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { ColDef } from 'ag-grid-community';
import { Actions } from 'src/app/base/@models/actions';
import { ActionService } from 'src/app/base/main/@services/action.service';

@Component({
  selector: 'app-summary-head-office',
  templateUrl: './summary-head-office.component.html',
  styleUrls: ['./summary-head-office.component.scss']
})
export class SummaryHeadOfficeComponent implements OnInit {
  @ViewChild('contactDetailsGrid') contactDetailsGrid: any;
  @Input('selectStyleClass') selectStyleClass?: string = '';
  @Input('flagStyleClass') flagStyleClass?: string = '';
  @Input('showFlag') showFlag?: boolean = true;
  @Input('classes') classes?: string = '';
  @Input('selectedCurrency') currency: string;
  @Output() close = new EventEmitter<void>();

  formData: SummaryHeadOffice = new SummaryHeadOffice();
  products: Product[] | undefined;
  showQuickPayModal: boolean = false;
  transactionsListTypes: any[] = [];
  responsiveOptions: any[];
  loading!: boolean;
  selectedPattern: any;
  showModal: boolean = false;
  pickupDeliveryListingData: any[] = [];
  // colDefUrl = 'collections/process/collectionSummaryHeadOffice/private/recentPaymentColDef';
  // dataUrl = 'collections/process/collectionSummaryHeadOffice/private/getAllList';

  gridOptions: any = {
    pagination: false
  }

  onShowModal(val) {
    this.formData.pickupPointName = val.pickupName
    this.formData.pickupPointCode = val.pickupCode
    this.formData.location = val.location
    this.formData.address1 = val.address1
    this.formData.address2 = val.address2
    this.formData.startDate = val.startDate
    this.formData.endDate = val.endDate
  }

  constructor(
    private actionsService: ActionService,
    private httpService: HttpService,
    private productService: ProductService,
    private toasterService: ToasterService,
    private breadcrumbService: BreadcrumbService
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

    this.productService.getProductsSmall().then((products) => {
      this.products = products;
    })

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];


    this.selectedPattern = this.patternList[0];

    this.httpService
      .httpPost('payments/transactions/singlePaymentRequest/private/getTransactionListTypes')
      .subscribe((response: any) => {
        this.transactionsListTypes = response.data;
        this.loading = false;
      });
  }

  file() {
    console.log("CLicked");

  }

  onTransactionHistory(id: string) {
    this.httpService
      .httpPost('collections/process/collectionSummaryHeadOffice/private/recentPaymentData')
      .subscribe((response: any) => {
        this.pickupDeliveryListingData = response.data;
      });
  }


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
    }
  ];

  schedules: any[] = [
    {
      icon: 'fa-info-circle',
      label: 'CASH PICKUP',
      time: '10:30AM on 05-July-2023',
      address: 'Bandra(W)',
      company: 'Secure Pvt Ltd'
    },
    {
      icon: 'fa-info-circle',
      label: 'DOCUMENT PICKUP',
      time: '11:30AM on 05-July-2023',
      address: 'Bandra(W)',
      company: 'Secure Pvt Ltd'
    },
    {
      icon: 'fa-info-circle',
      label: 'CASH DELIVERY',
      time: '12:0AM on 05-July-2023',
      address: 'Andheri(W)',
      company: 'Secure Pvt Ltd'
    }
  ]

  closeQuickPayModal() {
    this.showQuickPayModal = false;
    console.log("clicked");

  }

  patternList: any = [
    { displayName: 'Cash Pickup', value: 'Cash Pickup', count: '2' },
    { displayName: 'Cheque Pickup', value: 'Cheque Pickup', count: '2' },
    { displayName: 'Document Pickup', value: 'Document Pickup', count: '2' },
    { displayName: 'Cash Delivery', value: 'Cash Delivery', count: '2' }
  ]

  changePattern(data: any) {
    this.selectedPattern = data;
  }

  corporates = [
    { id: 'Weekly', displayName: 'Weekly' },
    { id: 'Monthly', displayName: 'Monthly' }
  ]

  dateList = [
    { id: 'This Week', displayName: 'This Week' },
    { id: 'This Month', displayName: 'This Month' }
  ]

  data = [
    {
      id: "1000",
      "code": "f230fh0g3",
      "name": "Bamboo Watch",
      "description": "Product Description",
      "image": "bamboo-watch.jpg",
      "price": 65,
      "category": "Accessories",
      "quantity": 24,
      "inventoryStatus": "INSTOCK",
      "rating": 5
    }
  ]


  //////////////////ColDef & Row Def Data///////////////////////////////

  colDefUrl: ColDef[] = [
    { field: 'locationName' },
    { field: 'pickupPointCode' },
    { field: 'pickupPointName' },
    { field: 'action', cellRenderer: 'actionCellRenderer' },
  ]


  dataUrl = [
    {
      locationName: 'Fujairah',
      pickupPointCode: '3023',
      pickupPointName: 'General Store',
      action: [
        {
          "index": 1,
          "onClick": "view",
          "type": "ICON",
          "displayName": "View",
          "icon": "fa-eye",
          "methodName": "view",
          "parameterList": ""
        },
        {
          "index": 2,
          "onClick": "eiew",
          "type": "ICON",
          "displayName": "Edit",
          "icon": "fa-pencil",
          "methodName": "edit",
          "parameterList": ""
        },
        {
          "index": 3,
          "onClick": "lock",
          "type": "ICON",
          "displayName": "Disable",
          "icon": "fa-lock",
          "methodName": "lock",
          "parameterList": ""
        },
        {
          "index": 4,
          "onClick": "cancel",
          "type": "ICON",
          "displayName": "Suspend",
          "icon": "fa-times-circle",
          "methodName": "cancel",
          "parameterList": ""
        }
      ]
    },
    {
      locationName: 'Dubai',
      pickupPointCode: '4586',
      pickupPointName: 'Bishop Store',
      action: [
        {
          "index": 1,
          "onClick": "view",
          "type": "ICON",
          "displayName": "View",
          "icon": "fa-eye",
          "methodName": "view",
          "parameterList": "id"
        },
        {
          "index": 2,
          "onClick": "eiew",
          "type": "ICON",
          "displayName": "Edit",
          "icon": "fa-pencil",
          "methodName": "edit",
          "parameterList": ""
        },
        {
          "index": 3,
          "onClick": "lock",
          "type": "ICON",
          "displayName": "Disable",
          "icon": "fa-lock",
          "methodName": "lock",
          "parameterList": ""
        },
        {
          "index": 4,
          "onClick": "cancel",
          "type": "ICON",
          "displayName": "Suspend",
          "icon": "fa-times-circle",
          "methodName": "cancel",
          "parameterList": ""
        }
      ]
    }
  ];

  view() {
    console.log("clicked view");

  }

  //////////////////ColDef & Row Def Data///////////////////////////////


  listType = 'grid';

  showSuccessModal: boolean = false

  onCancel() {
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

  onSubmit() {
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


    setTimeout(() => {
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Request has been submitted successfully.',
      });
    }, 2000);
  }
}
