import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { BankGuaranteeAmendComponent } from '../bank-guarantee-amend.component';

@Component({
  selector: 'app-bg-amend-search-result',
  templateUrl: './bg-amend-search-result.component.html',
  styleUrls: ['./bg-amend-search-result.component.scss'],
})
export class BgAmendSearchResultComponent implements OnInit {
  @ViewChild('bgAmendSearchListGrid') bgAmendSearchListGrid: AgGridListingComponent;

  @Input('parentRef') parentRef: BankGuaranteeAmendComponent;
  colDefsUrl = 'trade/exportTransactions/bankGuaranteeAmend/private/searchColDefs';
  rowDefUrl = 'trade/exportTransactions/bankGuaranteeAmend/private/searchDataList';

  viewport: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewportService: ViewportService,
  ) {}

  ngOnInit(): void {
    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });
    const actions: Actions = {
      heading: 'Bank Guarantee - Amend',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Trade' },
      { label: 'Export' },
      { label: 'Bank Guarantee Amend' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }
  amend(id: string) {
    this.parentRef.amendableRecordId = id;
    this.parentRef.currentScreen = 'AMEND';
  }

  view(id: string) {
    this.parentRef.amendableRecordId = id;
    this.parentRef.currentScreen = 'AMENDVIEW';
  }
}
