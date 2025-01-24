import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { BillPaymentService } from '../../@services/bill-payment.service';

@Component({
  selector: 'app-small-biller-payment-details',
  templateUrl: './small-biller-payment-details.component.html',
  styleUrls: ['./small-biller-payment-details.component.scss'],
})
export class SmallBillerPaymentDetailsComponent implements OnInit {
  biller: any;
  isSchedulePayment: boolean = false;
  review: boolean = false;
  showSubmit: boolean = false;

  consumers: any[] = [];
  consumer: string = '';

  consumerDetails: any;

  schedule: any = {
    payType: '',
    payAmount: '',
    ifHoliday: '',
    startDate: '',
    endDate: '',
  };

  paymentDetailsForm: any = {
    paymentMethod: '',
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private billPaymentService: BillPaymentService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.biller = this.billPaymentService.activeBiller;

    if (!this.biller) {
      this.cancel();
      return;
    }

    const actions: Actions = {
      heading: '',
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
      { label: 'Bill Payment Details' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    const data = {
      dataMap: {
        category: this.biller.category,
        billerName: this.biller.billerName,
        product: this.biller.product,
        type: this.biller.type,
      },
    };

    this.httpService
      .httpPost('payments/billPayments/billerRegistration/private/getBillerConsumers', data)
      .subscribe((response: any) => {
        this.consumers = response.data.map((consumer: any) => {
          return {
            ...consumer,
            displayName: consumer.consumer,
          };
        });
      });
  }

  onSchedule() {
    this.review = false;
    this.isSchedulePayment = true;
    this.showSubmit = false;
  }

  changePay(e: any) {
    if (e.id === 'Other') {
      this.schedule.payAmount = '';
      return;
    }
    this.schedule.payAmount = this.consumerDetails.billAmount;
  }

  fetchBill() {
    const data = {
      dataMap: {
        id: this.consumer,
      },
    };

    this.httpService
      .httpPost('payments/billPayments/billerRegistration/private/view', data)
      .subscribe((response: any) => {
        this.consumerDetails = response;
      });
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  submit() {
    const formData = {
      billerType: 'registered',
      ...this.biller,
      ...this.paymentDetailsForm,
      channel: 'WEB',
      status: 'Paid',
      serviceType: '--',
      billNo: this.biller.id,
      consumerName: `Consumer ${new Date().getTime()}`,
      consumers: [this.consumerDetails],
    };

    this.httpService
      .httpPost('payments/billPayments/payBill/private/create', formData)
      .subscribe((response: any) => {
        this.showSubmit = true;
      });
  }

  onScheduleSubmit() {
    const formData = {
      billerType: 'registered',
      ...this.biller,
      ...this.paymentDetailsForm,
      ...this.schedule,
      consumers: [this.consumerDetails],
    };

    this.httpService
      .httpPost('payments/billPayments/payBill/private/create', formData)
      .subscribe((response: any) => {
        this.isSchedulePayment = false;
      });
  }
}
