import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BankGuaranteeStatusRendererComponent } from './@components/bank-guarantee-status-renderer/bank-guarantee-status-renderer.component';

@Component({
  selector: 'app-bank-guarantee',
  templateUrl: './bank-guarantee.component.html',
  styleUrls: ['./bank-guarantee.component.scss'],
})
export class BankGuaranteeComponent implements OnInit {
  @ViewChild('bankGuaranteeGrid') bankGuaranteeGrid: any;

  loading: boolean = true;

  listType: string = 'grid';

  viewport: string;

  showHistory = false;
  showDelete = false;

  options: any;

  bankGuaranteeOverview: any = {
    corporateAuthorized: 120,
    bankAuthorized: 24,
    toRepair: 24,
  };

  typeOfApplicationOrUndertaking: any[] = [
    {
      madeBy: 'Generic',
      value: 40,
    },
    {
      madeBy: 'Bid Bond',
      value: 24,
    },
    {
      madeBy: 'Performance',
      value: 28,
    },
    {
      madeBy: 'Standby',
      value: 14,
    },
    {
      madeBy: 'Trade',
      value: 6,
    },
    {
      madeBy: 'Adv Payment',
      value: 14,
    },
    {
      madeBy: 'Maintenance',
      value: 24,
    },
    {
      madeBy: 'E-Guarantee',
      value: 28,
    },
  ];

  listingTypes = [
    {
      id: 'Drafts',
      displayName: 'Drafts',
      colDefsUrl: 'trade/exportTransactions/bankGuarantee/private/draftColDefs',
      rowDefUrl: 'trade/exportTransactions/bankGuarantee/private/getDraftList',
      count: 6,
    },
    {
      id: 'Recent Bank Guarantee',
      displayName: 'Recent Bank Guarantee',
      colDefsUrl: 'trade/exportTransactions/bankGuarantee/private/recentColDefs',
      rowDefUrl: 'trade/exportTransactions/bankGuarantee/private/getRecentList',
      count: 10,
    },
    {
      id: 'Templates',
      displayName: 'Templates',
      colDefsUrl: 'trade/exportTransactions/bankGuarantee/private/templateColDefs',
      rowDefUrl: 'trade/exportTransactions/bankGuarantee/private/getTemplateList',
      count: 5,
    },
    {
      id: 'Repair List',
      displayName: 'Repair List',
      colDefsUrl: 'trade/exportTransactions/bankGuarantee/private/repairColDefs',
      rowDefUrl: 'trade/exportTransactions/bankGuarantee/private/getRepairList',
    },
  ];

  frameworkComponents = {
    statusRenderer: BankGuaranteeStatusRendererComponent,
  };

  activeListing: any = this.listingTypes[1];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewportService: ViewportService,
    private viewService: ViewService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    if (this.viewService.getMode() && this.viewService.getId()) {
      this.router.navigate(['./initiate'], { relativeTo: this.route });
      return;
    }

    const actions: Actions = {
      heading: 'Bank Guarantee - Initiate',
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
      { label: 'Bank Guarantee' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.options = {
      formatter: (params: any) => {
        return `${this.typeOfApplicationOrUndertaking[params.itemId].madeBy}\t\t\t\t${
          this.typeOfApplicationOrUndertaking[params.itemId].value
        }`;
      },
      data: this.typeOfApplicationOrUndertaking,
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
      this.bankGuaranteeGrid.refreshGridList();
    }
  }

  onListTypeChange(listType: string) {
    this.listType = listType;
  }

  onChangeBankGuaranteeOverview(duration: any) {
    if (duration.id == 'Today') {
      this.bankGuaranteeOverview = {
        corporateAuthorized: 120,
        bankAuthorized: 24,
        toRepair: 24,
      };
    } else if (duration.id == 'This Month') {
      this.bankGuaranteeOverview = {
        corporateAuthorized: 420,
        bankAuthorized: 130,
        toRepair: 104,
      };
    } else {
      this.bankGuaranteeOverview = {
        corporateAuthorized: 7600,
        bankAuthorized: 1450,
        toRepair: 1254,
      };
    }
  }

  copy() {}

  edit(id: string) {
    this.viewService.setId(id);
    this.viewService.setMode('EDIT');

    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  deleteTemplate(id: string) {}

  history() {
    this.showHistory = true;
  }

  view(id: string) {
    this.viewService.setId(id);
    this.viewService.setMode('VIEW');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  file() {}

  repair(id: string) {
    this.viewService.setId(id);
    this.viewService.setMode('REPAIR');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  accept() {}

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
