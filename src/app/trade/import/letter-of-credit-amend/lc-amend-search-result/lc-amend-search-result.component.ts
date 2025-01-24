import { Component, Input, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { LetterOfCreditAmendComponent } from '../letter-of-credit-amend.component';

@Component({
  selector: 'app-lc-amend-search-result',
  templateUrl: './lc-amend-search-result.component.html',
  styleUrls: ['./lc-amend-search-result.component.scss'],
})
export class LcAmendSearchResultComponent implements OnInit {
  @Input('parentRef') parentRef: LetterOfCreditAmendComponent;

  colDefsUrl = 'trade/importTransactions/letterOfCreditAmend/private/searchColDefs';
  rowDefUrl = 'trade/importTransactions/letterOfCreditAmend/private/searchDataList';

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
      heading: 'Letter Of Credit - Amend',
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
      { label: 'Import' },
      { label: 'Letter Of Credit Amend' },
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
