import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { LetterOfCreditStatusRendererComponent } from './@components/letter-of-credit-status-renderer/letter-of-credit-status-renderer.component';

@Component({
  selector: 'app-letter-of-credit',
  templateUrl: './letter-of-credit.component.html',
  styleUrls: ['./letter-of-credit.component.scss'],
})
export class LetterOfCreditComponent implements OnInit {
  @ViewChild('letterOfCreditGrid') letterOfCreditGrid: any;

  loading: boolean = true;

  listType: string = 'grid';

  letterOfCreditOverview: any = {
    corporateAuthorized: 120,
    bankAuthorized: 24,
    toRepair: 24,
  };

  viewport: string;

  showHistory = false;
  showDelete = false;

  options: any;

  billPayment: any[] = [
    {
      madeBy: 'Payment',
      value: 40,
    },
    {
      madeBy: 'Mixed Payment',
      value: 24,
    },
    {
      madeBy: 'By Deferred Payment',
      value: 28,
    },
    {
      madeBy: 'Acceptance',
      value: 14,
    },
    {
      madeBy: 'By Negotiation (SIGHT)',
      value: 4,
    },
    {
      madeBy: 'By Negotiation (USANCE)',
      value: 2,
    },
  ];

  listingTypes = [
    {
      id: 'Drafts',
      displayName: 'Drafts',
      colDefsUrl: 'trade/importTransactions/letterOfCredit/private/draftColDefs',
      rowDefUrl: 'trade/importTransactions/letterOfCredit/private/getDraftList',
      count: 1,
    },
    {
      id: 'Recent Letter Of Credit',
      displayName: 'Recent Letter Of Credit',
      colDefsUrl: 'trade/importTransactions/letterOfCredit/private/recentColDefs',
      rowDefUrl: 'trade/importTransactions/letterOfCredit/private/getRecentList',
      count: 2,
    },
    {
      id: 'Templates',
      displayName: 'Templates',
      colDefsUrl: 'trade/importTransactions/letterOfCredit/private/templateColDefs',
      rowDefUrl: 'trade/importTransactions/letterOfCredit/private/getTemplateList',
      count: 1,
    },
    // {
    //   id: 'Repair List',
    //   displayName: 'Repair List',
    //   colDefsUrl: 'trade/importTransactions/letterOfCredit/private/repairColDefs',
    //   rowDefUrl: 'trade/importTransactions/letterOfCredit/private/getRepairList',
    //   count: 1,
    // },
  ];

  frameworkComponents = {
    statusRenderer: LetterOfCreditStatusRendererComponent,
  };

  activeListing: any = this.listingTypes[1];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewportService: ViewportService,
    private viewService: ViewService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    if (this.viewService.getMode() && this.viewService.getId()) {
      this.router.navigate(['./initiate'], { relativeTo: this.route });
      return;
    }

    const actions: Actions = {
      heading: 'Letter Of Credit - Initiate',
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
      { label: 'Letter Of Credit ' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.options = {
      formatter: (params: any) => {
        return `${this.billPayment[params.itemId].madeBy}\t\t\t\t${this.billPayment[params.itemId].value
          }`;
      },
      data: this.billPayment,
      labelKey: 'madeBy',
      angleKey: 'value',
    };

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });

    this.loading = false;
  }

  changeActiveListing(listingType: any) {
    this.activeListing = listingType;

    if (this.listType === 'grid') {
      this.letterOfCreditGrid.refreshGridList();
    }
  }

  onListTypeChange(listType: string) {
    this.listType = listType;
  }

  copy() { }

  edit(id: string) {
    this.viewService.setId(id);
    this.viewService.setMode('EDIT');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  history(id: any) {
    this.showHistory = true;
  }

  onChangeLetterOfCreditOverview(duration: any) {
    if (duration.id == 'Today') {
      this.letterOfCreditOverview = {
        corporateAuthorized: 120,
        bankAuthorized: 24,
        toRepair: 24,
      };
    } else if (duration.id == 'This Month') {
      this.letterOfCreditOverview = {
        corporateAuthorized: 420,
        bankAuthorized: 130,
        toRepair: 104,
      };
    } else {
      this.letterOfCreditOverview = {
        corporateAuthorized: 7600,
        bankAuthorized: 1450,
        toRepair: 1254,
      };
    }
  }

  view(id: string) {
    this.viewService.setId(id);
    this.viewService.setMode('VIEW');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  file() { }

  repair(id: string) {
    this.viewService.setId(id);
    this.viewService.setMode('REPAIR');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  accept() { }

  delete() {
    this.showDelete = true;
  }

  useDraft(id: string) {
    this.viewService.setId(id);
    this.viewService.setMode('DRAFT');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  useTemplate(id: string) {
    this.viewService.setId(id);
    this.viewService.setMode('TEMPLATE');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }
}
