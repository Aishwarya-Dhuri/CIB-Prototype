import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { GenericListingComponent } from 'src/app/shared/@components/generic-listing/generic-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { AccountDetails } from './@models/mainAccountDetails.model';
import { AccountStructureService } from './@services/account-structure.service';

@Component({
  selector: 'app-account-structure',
  templateUrl: './account-structure.component.html',
  styleUrls: ['./account-structure.component.scss'],
})
export class AccountStructureComponent extends GenericListingComponent implements OnInit {
  @ViewChild('listing') public listing: any;

  actionDialog = false;

  createNewStructureDialog = false;
  structureCreationType = 'CREATE';

  defaultReqModel: any = {
    startRow: 0,
    endRow: 10,
    rowGroupCols: [],
    valueCols: [],
    pivotCols: [],
    pivotMode: false,
    groupKeys: [],
    filterModel: {},
    sortModel: [],
    entityName: '',
  };

  structures: any[] = [
    {
      label: 'Active Structures',
      count: '1',
      colDefUrl: 'lms/corporate/accountStructure/private/accountStructureColDefs',
      rowDataUrl: 'lms/corporate/accountStructure/private/getActiveList',
      cardDataUrl: 'lms/corporate/accountStructure/private/getActiveList',
    },
    {
      label: 'Drafts',
      count: '0',
      colDefUrl: 'lms/corporate/accountStructure/private/accountStructureColDefs',
      rowDataUrl: 'lms/corporate/accountStructure/private/getDraftList',
      cardDataUrl: 'lms/corporate/accountStructure/private/getDraftList',
    },
    {
      label: 'Review',
      count: '0',
      colDefUrl: 'lms/corporate/accountStructure/private/accountStructureColDefs',
      rowDataUrl: 'lms/corporate/accountStructure/private/getAuthorizedList',
      cardDataUrl: 'lms/corporate/accountStructure/private/getAuthorizedList',
    },
    {
      label: 'Pending Authorization',
      count: '1',
      colDefUrl: 'lms/corporate/accountStructure/private/accountStructureColDefs',
      rowDataUrl: 'lms/corporate/accountStructure/private/getPendingList',
      cardDataUrl: 'lms/corporate/accountStructure/private/getPendingList',
    },
    {
      label: 'Rejected',
      count: '0',
      colDefUrl: 'lms/corporate/accountStructure/private/accountStructureColDefs',
      rowDataUrl: 'lms/corporate/accountStructure/private/getRejectedList',
      cardDataUrl: 'lms/corporate/accountStructure/private/getRejectedList',
    },
    {
      label: 'Disabled',
      count: '0',
      colDefUrl: 'lms/corporate/accountStructure/private/accountStructureColDefs',
      rowDataUrl: 'lms/corporate/accountStructure/private/getDisabledList',
      cardDataUrl: 'lms/corporate/accountStructure/private/getDisabledList',
    },
  ];

  context = { componentParent: this };

  structure: any;

  listType = 'grid';

  allCardListData: any = [];
  cardListData: any = [];
  currentCardPage = 1;

  constructor(
    protected actionsService: ActionService,
    protected breadcrumbService: BreadcrumbService,
    protected menuService: MenuService,
    protected router: Router,
    protected viewService: ViewService,
    protected httpService: HttpService,
    private route: ActivatedRoute,
    private accountStructureService: AccountStructureService,
    public userService: UserService,
  ) {
    super(actionsService, breadcrumbService, menuService, router, viewService, httpService);
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Account Structure',
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
      { label: 'LMS' },
      { label: 'Corporate Onboarding' },
      { label: 'Account Structure' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.structure = this.structures[0];
  }

  onCreateNewStructure() {
    this.accountStructureService.structureCreationType = this.structureCreationType.toLowerCase();
    this.createNewStructureDialog = false;

    this.router.navigate(['initiate'], { relativeTo: this.route });
  }

  onActionClicked(action: any) {
    this[action.methodName]();
  }

  selectStructure(structure: any) {
    this.structure = structure;

    // this.httpService.httpPost('lms/corporate/accountStructure/private/getAllCount', this.defaultReqModel).subscribe(()=>{})

    this.onListTypeChange(this.listType);
  }

  onListTypeChange(listType: string) {
    this.listType = listType;

    this.currentCardPage = 1;
    if (this.listType === 'card') {
      this.cardListData = [];

      this.httpService
        .httpPost(this.structure.cardDataUrl, this.defaultReqModel)
        .subscribe((response: any) => {
          this.allCardListData = response.data;
          if (response.totalRecords > 0) {
            this.cardListData = this.allCardListData.slice(0, 8);
          } else {
            this.cardListData = this.allCardListData;
          }
        });
    } else if (this.listing) {
      this.listing.refreshGridList();
    }
  }

  navigateToInitiate(): void {
    this.router.navigateByUrl(this.menuService.getSelectedServiceUrl() + '/initiate');
  }

  navigateToView(): void {
    this.router.navigateByUrl(this.menuService.getSelectedServiceUrl() + '/initiate');
  }

  changeCardPage(pageNumber: number) {
    const start = (pageNumber - 1) * 12;
    if (pageNumber < 1 || start > this.allCardListData.length) return;
    const last =
      pageNumber * 12 > this.allCardListData.length ? this.allCardListData.length : pageNumber * 12;
    this.cardListData = this.allCardListData.slice(start, last);
    this.currentCardPage = pageNumber;
  }
}
