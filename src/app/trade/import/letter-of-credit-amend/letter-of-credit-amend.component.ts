import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-letter-of-credit-amend',
  templateUrl: './letter-of-credit-amend.component.html',
  styleUrls: ['./letter-of-credit-amend.component.scss'],
})
export class LetterOfCreditAmendComponent implements OnInit {
  searchFilters: Filter[] = [];

  draftList: any[] = [];

  recentList: any[] = [];

  amendableRecordId: string = '';

  currentScreen: string = 'FILTERS';

  formData: any;
  stepperDetails: Stepper;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
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

    const mode = this.viewService.getMode();

    if (mode == 'EDIT' || mode == 'DRAFT' || mode == 'TEMPLATE') {
      this.currentScreen = 'AMEND';
    } else if (mode == 'VIEW') {
      this.currentScreen = 'AMENDVIEW';
    } else {
      const defaultReqModel = {
        startRow: 0,
        endRow: 1,
        rowGroupCols: [],
        valueCols: [],
        pivotCols: [],
        pivotMode: false,
        groupKeys: [],
        filterModel: {},
        sortModel: [],
        entityName: '',
      };

      this.httpService
        .httpPost(
          'trade/importTransactions/letterOfCreditAmend/private/getDraftList',
          defaultReqModel,
        )
        .subscribe((response: any) => {
          this.draftList = response.data;
        });

      this.httpService
        .httpPost(
          'trade/importTransactions/letterOfCreditAmend/private/getRecentList',
          defaultReqModel,
        )
        .subscribe((response: any) => {
          this.recentList = response.data;
        });
    }
  }
}
