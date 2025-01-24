import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-listing-more-options',
  templateUrl: './listing-more-options.component.html',
  styleUrls: ['./listing-more-options.component.scss'],
})
export class ListingMoreOptionsComponent implements OnInit {
  @Input('optionList') optionList: any[] = [];
  @Input('parentRef') parentRef: any;

  constructor() {}

  ngOnInit(): void {}

  onOptionClick(method: string) {
    if (!this.parentRef[method]) {
      console.warn(`Kindly give implementation for ${method}(): any`);
    } else {
      this.parentRef[method]();
    }
  }
}
