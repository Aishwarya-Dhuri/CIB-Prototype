import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.scss'],
})
export class ShowDetailsComponent implements OnInit {
  @Input('transactionData') transactionData: any[] = [];

  @Output() linkClicked = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  onLinkClicked(event: any) {
    this.linkClicked.emit(event);
  }
}
