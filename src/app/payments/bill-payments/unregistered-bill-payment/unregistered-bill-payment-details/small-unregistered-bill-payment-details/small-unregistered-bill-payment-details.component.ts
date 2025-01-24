import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UnregisteredBillPaymentService } from '../../@services/unregistered-bill-payment.service';

@Component({
  selector: 'app-small-unregistered-bill-payment-details',
  templateUrl: './small-unregistered-bill-payment-details.component.html',
  styleUrls: ['./small-unregistered-bill-payment-details.component.scss'],
})
export class SmallUnregisteredBillPaymentDetailsComponent implements OnInit {
  @ViewChild('consumersGrid') consumersGrid: any;

  loading = true;

  showSubmit = false;

  consumerDetails: any;

  additionalDetails: any = {
    subscriberName: '',
    registerBiller: '',
  };

  paymentDetailsForm: any = {
    paymentMethod: '',
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
  };

  filters: any[] = [];
  biller: any;

  isReview: boolean = false;

  constructor(
    private actionsService: ActionService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private unregisteredBillPaymentService: UnregisteredBillPaymentService,
  ) {}

  ngOnInit(): void {
    this.filters = this.unregisteredBillPaymentService.filters;

    if (this.filters.length === 0) {
      this.cancel();
      return;
    }

    const biller: any = {};

    this.filters.forEach((filter: any) => {
      biller[filter.name] = filter.value;
    });

    const actions: Actions = {
      heading: 'Bill Payment Details',
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
      { label: 'Account Services' },
      { label: 'Bill Payment' },
      { label: 'Unregistered Bill Payment' },
      { label: 'Bill Payment Details' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    const data = {
      dataMap: {
        billerName: biller.biller,
        product: biller.product,
        consumer: biller.consumerNo,
      },
    };

    this.httpService
      .httpPost(
        'payments/billPayments/billerRegistration/private/getSMEBillerUnregisteredConsumer',
        data,
      )
      .subscribe((response: any) => {
        this.consumerDetails = response.data[0];
        this.biller = response.billerData;

        this.loading = false;
      });
  }

  previous() {
    this.showSubmit = false;
    this.isReview = false;
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  submit() {
    const formData = {
      billerType: 'unregistered',
      ...this.biller,
      ...this.paymentDetailsForm,
      channel: 'WEB',
      status: 'Paid',
      serviceType: '--',
      billNo: new Date().getTime(),
      consumerName: `Consumer ${new Date().getTime()}`,
      consumers: [this.consumerDetails],
    };

    this.httpService
      .httpPost('payments/billPayments/payBill/private/create', formData)
      .subscribe((response: any) => {
        this.showSubmit = true;
      });
  }
}
