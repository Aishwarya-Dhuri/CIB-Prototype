import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BankGuaranteeAmendService } from './@services/bank-guarantee-amend.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-bank-guarantee-amend',
  templateUrl: './bank-guarantee-amend.component.html',
  styleUrls: ['./bank-guarantee-amend.component.scss'],
})
export class BankGuaranteeAmendComponent implements OnInit {
  searchFilters: Filter[] = [];

  draftList: any[] = [];

  recentList: any[] = [];

  amendableRecordId: string = '';

  currentScreen: string = 'FILTERS';

  formData: any;
  stepperDetails: Stepper;

  // @ViewChild('dynamicSearch') dynamicSearch: any;
  // viewport: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private httpService: HttpService,
    private bankGuaranteeAmendService: BankGuaranteeAmendService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
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
          'trade/exportTransactions/bankGuaranteeAmend/private/getDraftList',
          defaultReqModel,
        )
        .subscribe((response: any) => {
          this.draftList = response.data;
        });

      this.httpService
        .httpPost(
          'trade/exportTransactions/bankGuaranteeAmend/private/getRecentList',
          defaultReqModel,
        )
        .subscribe((response: any) => {
          this.recentList = response.data;
        });
    }
  }
}
