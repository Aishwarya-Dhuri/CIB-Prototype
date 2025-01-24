import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
})
export class InvoiceDetailsComponent implements OnInit {
  @Input('searchDetails') searchDetails: any;
  @Input('invoiceDetails') invoiceDetails: any;

  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
