import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { BankGuaranteeAmendComponent } from '../bank-guarantee-amend.component';

@Component({
  selector: 'app-bank-guarantee-amend-search',
  templateUrl: './bank-guarantee-amend-search.component.html',
  styleUrls: ['./bank-guarantee-amend-search.component.scss'],
})
export class BankGuaranteeAmendSearchComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  @Input('parentRef') parentRef: BankGuaranteeAmendComponent;

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
