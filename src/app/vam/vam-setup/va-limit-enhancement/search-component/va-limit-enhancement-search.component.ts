import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Filter } from '../../../../shared/@components/dynamic-search/@models/filter.model';
import { MenuService } from '../../../../base/main/@services/menu.service';
import { HttpService } from '../../../../shared/@services/http.service';
import { ViewportService } from '../../../../shared/@services/viewport.service';

@Component({
  selector: 'app-va-limit-enhancement-search',
  templateUrl: './va-limit-enhancement-search.component.html',
  styleUrls: ['./va-limit-enhancement-search.component.scss'],
})
export class VaLimitEnhancementSearchComponent implements OnInit {
  @Output() actionClick = new EventEmitter<any>();
  showListing = true;
  suggestions: Filter[] = [];
  selectedSuggestion: Filter;
  entityName: string;
  URL_CONST = {
    GET_LIMIT_ENHANCEMENT_DATA: 'vam/vamSetup/vaLimitEnhancement/private/getLimitEnhancementData',
    GET_GENERIC_FILTERS: 'commons/filterService/private/getGenericFilters',
    LIMIT_ENHANCEMENT_COL_DEF_URL: 'vam/vamSetup/vaLimitEnhancement/private/limitEnhancementColDef',
  };
  limitEnhancementData: any = {};
  viewport: string;

  constructor(
    private menuService: MenuService,
    private viewportService: ViewportService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
    });
    this.getGenericFilters();
    this.getLimitEnhancementData();
  }

  getGenericFilters(): void {
    this.entityName = 'VA_LIMIT_ENHANCEMENT';
    // this.entityName = this.entityName || this.menuService.getSelectedEntityName() || 'VALIMITENHANCEMENT';

    const data = { entityName: this.entityName };
    this.httpService
      .httpPost(this.URL_CONST.GET_GENERIC_FILTERS, data)
      .subscribe((response: any) => {
        this.suggestions = response.suggestions;
      });
  }

  getLimitEnhancementData() {
    const data = {};
    this.httpService
      .httpPost(this.URL_CONST.GET_LIMIT_ENHANCEMENT_DATA, data)
      .subscribe((response: any) => {
        console.log('response', response);
        this.limitEnhancementData = response.data;
      });
  }

  view(id) {
    this.actionClick.emit({ id, action: 'SEARCH_VIEW' });
  }

  edit(id) {
    this.actionClick.emit({ id, action: 'SEARCH_INIT' });
  }

  getRequestData(data) {
    console.log(data);
    if (this.selectedSuggestion) {
      data.filterModel[this.selectedSuggestion.name] = this.selectedSuggestion;
    }
    return data;
  }
  fillFilter(suggestion: Filter) {
    this.selectedSuggestion = suggestion;
    this.showListing = false;
    setTimeout(() => (this.showListing = true), 500);
  }
}
