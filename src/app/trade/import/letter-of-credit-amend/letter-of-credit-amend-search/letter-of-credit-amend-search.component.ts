import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { LetterOfCreditAmendComponent } from '../letter-of-credit-amend.component';

@Component({
  selector: 'app-letter-of-credit-amend-search',
  templateUrl: './letter-of-credit-amend-search.component.html',
  styleUrls: ['./letter-of-credit-amend-search.component.scss'],
})
export class LetterOfCreditAmendSearchComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  @Input('parentRef') parentRef: LetterOfCreditAmendComponent;

  constructor() {}

  ngOnInit(): void {}

  onDynamicFiltersReady(): void {
    this.parentRef.searchFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }

  search(filters: any[]) {
    this.parentRef.searchFilters = filters;
    this.parentRef.currentScreen = 'SEARCH_RESULTS';
  }
}
