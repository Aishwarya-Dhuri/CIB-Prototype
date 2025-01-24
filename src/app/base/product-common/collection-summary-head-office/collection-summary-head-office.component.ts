import { Component, OnInit, Input } from '@angular/core';
import { CollectionSummaryHeadOffice } from './@model/collection-summary-head-office.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ProductService } from './@service/product.service';
import { Product } from './product';

@Component({
  selector: 'app-collection-summary-head-office',
  templateUrl: './collection-summary-head-office.component.html',
  styleUrls: ['./collection-summary-head-office.component.scss']
})
export class CollectionSummaryHeadOfficeComponent implements OnInit {
  @Input('selectStyleClass') selectStyleClass?: string = '';
  @Input('flagStyleClass') flagStyleClass?: string = '';
  @Input('showFlag') showFlag?: boolean = true;
  @Input('classes') classes?: string = '';
  @Input('selectedCurrency') currency: string;

  formData: CollectionSummaryHeadOffice = new CollectionSummaryHeadOffice();
  products: Product[] | undefined;
  showQuickPayModal: boolean = false;
  transactionsListTypes: any[] = [];
  responsiveOptions: any[];
  loading!: boolean;
  selectedPattern: any;
  colDefUrl =
    'accountServices/services/consolidatedAccountStatement/private/fileUploadLogListColDefs';
  dataUrl = 'accountServices/services/consolidatedAccountStatement/private/getAllList';




  constructor(
    private httpService: HttpService,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
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
      time: '10:30AM on 05-July-2023',
      address: 'Bandra(W)',
      company: 'Secure Pvt Ltd'
    },
    {
      icon: 'fa-info-circle',
      time: '11:30AM on 05-July-2023',
      address: 'Bandra(W)',
      company: 'Secure Pvt Ltd'
    },
    {
      icon: 'fa-info-circle',
      time: '12:0AM on 05-July-2023',
      address: 'Andheri(W)',
      company: 'Secure Pvt Ltd'
    }
  ]

  closeQuickPayModal() {
    this.showQuickPayModal = false;
  }

  patternList: any = [
    { displayName: 'Cash Pickup', value: 'Cash Pickup', count: '0' },
    { displayName: 'Cheque Pickup', value: 'Cheque Pickup', count: '0' },
    { displayName: 'Document Pickup', value: 'Document Pickup', count: '0' },
    { displayName: 'Cash Delivery', value: 'Cash Delivery', count: '0' }
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

}
