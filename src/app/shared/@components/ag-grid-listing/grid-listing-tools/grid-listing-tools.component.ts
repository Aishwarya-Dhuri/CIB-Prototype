import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { AgGridListingComponent } from '../ag-grid-listing.component';

@Component({
  selector: 'app-grid-listing-tools',
  templateUrl: './grid-listing-tools.component.html',
  styleUrls: ['./grid-listing-tools.component.scss'],
})
export class GridListingToolsComponent implements OnInit {
  @Input('gridRef') gridRef: AgGridListingComponent;
  @Input('label') label?: string = '';
  @Input('redirectUrl') redirectUrl?: string = '';
  @Input('colDefs') colDefs: any[] = [];
  @Input('showSearch') showSearch = true;
  @Input('parentRef') parentRef: any;
  @Input('showRefresh') showRefresh = false;
  @Input('columnConfig') columnConfig = false;
  @Input('moreOptions') moreOptions = false;
  @Input('showSelectAll') showSelectAll?: boolean = false;
  @Input('optionList') optionList: any[] = [
    {
      label: 'Single Payment Initiation',
      method: 'onSinglePaymentInitiation',
    },
    {
      label: 'FD Initiation',
      method: 'onFdInitiation',
    },
    {
      label: 'Statement Download',
      method: 'onStatementDownload',
    },
  ];
  @Input('showPrint') showPrint = false;
  @Input('showMail') showMail = true;
  @Input('showFloatingFilter') showFloatingFilter = true;
  @Input('showDownload') showDownload = true;
  @Input('listingTypes') listingTypes = false;
  @Input('listingType') listingType: string = 'grid';

  @Output() changeFloatingFilter = new EventEmitter<boolean>();
  @Output() onRefresh = new EventEmitter<void>();
  @Output() filterRecords = new EventEmitter<string>();
  @Output() updateColDefs = new EventEmitter<any>();
  @Output() applyColDefs = new EventEmitter<any[]>();
  @Output() changeListingType = new EventEmitter<string>();
  @Output() onSelectAll = new EventEmitter<boolean>();

  floatingFilter = false;
  filterValue: string;
  viewport: string;
  showMoreOptions = false;
  downloadOptions = false;
  columnConfiguration = false;
  selectAll = false;

  constructor(private viewportService: ViewportService, private httpService: HttpService) {}

  ngOnInit(): void {
    if (!this.parentRef) {
      this.parentRef = this;
    }

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });
  }

  onChangeFloatFilter(floatingFilter: boolean) {
    this.floatingFilter = floatingFilter;
    this.changeFloatingFilter.emit(floatingFilter);
  }

  // downloadFile() {
  //   if (this.filePath) {
  //     const filePath = this.httpService.getAssetUrl(this.filePath);
  //     window.open(filePath, '_blank');
  //   }
  // }

  onFilterRecords() {
    this.filterRecords.emit(this.filterValue);
  }

  selectAllRecords() {
    this.onSelectAll.emit(this.selectAll);
  }

  onListTypeChange(type: string) {
    this.listingType = type;
    this.changeListingType.emit(type);
  }
}
