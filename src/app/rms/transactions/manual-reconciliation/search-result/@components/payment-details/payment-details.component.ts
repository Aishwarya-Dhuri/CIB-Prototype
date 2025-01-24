import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent implements OnInit {
  @Input('searchDetails') searchDetails: any;
  @Input('paymentDetails') paymentDetails: any;

  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
