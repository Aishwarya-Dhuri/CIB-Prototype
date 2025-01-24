import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';
import { BillPaymentService } from '../../../@services/bill-payment.service';

@Component({
  selector: 'app-bill-payment-details-card',
  templateUrl: './bill-payment-details-card.component.html',
  styleUrls: ['./bill-payment-details-card.component.scss'],
})
export class BillPaymentDetailsCardComponent implements OnInit {
  @Input('billPaymentDetails') billPaymentDetails: any;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private billPaymentService: BillPaymentService,
  ) {}

  ngOnInit(): void {}

  fetchBills(e: any) {
    e.stopPropagation();

    const data = { dataMap: { id: this.billPaymentDetails.id } };

    this.httpService
      .httpPost('payments/billPayments/registeredBillPayment/private/view', data)
      .subscribe((bill: any) => {
        this.billPaymentDetails = bill;
      });
  }

  onBillerDetails() {
    this.billPaymentService.activeBiller = this.billPaymentDetails;
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }
}
