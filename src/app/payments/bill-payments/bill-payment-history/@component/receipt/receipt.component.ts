import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent implements OnInit {
  @Input('receiptData') receiptData: any;

  constructor() {}

  ngOnInit(): void {}
}
