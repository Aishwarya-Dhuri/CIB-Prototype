import { Component, Input, OnInit } from '@angular/core';
import { StatutoryPaymentService } from '../../@services/statutory-payment.service';

@Component({
  selector: 'app-statutory-payment-review',
  templateUrl: './statutory-payment-review.component.html',
  styleUrls: ['./statutory-payment-review.component.scss'],
})
export class StatutoryPaymentReviewComponent implements OnInit {
  statutoryPaymentDetails: any;
  institution: any;

  @Input('parentRef') parentRef: any;

  termsAndConditions: boolean = false;

  constructor(private statutoryPaymentService: StatutoryPaymentService) {}

  ngOnInit(): void {
    this.institution = this.statutoryPaymentService.institution;
    this.statutoryPaymentDetails = this.statutoryPaymentService.statutoryPaymentDetails;
  }
}
