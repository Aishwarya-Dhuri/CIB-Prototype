import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BillPresentmentStatusRendererComponent } from './@components/bill-presentment-status-renderer/bill-presentment-status-renderer.component';

@Component({
  selector: 'app-bill-presentment',
  templateUrl: './bill-presentment.component.html',
  styleUrls: ['./bill-presentment.component.scss'],
})
export class BillPresentmentComponent implements OnInit {
  @ViewChild('billPresentmentGrid') billPresentmentGrid: any;

  loading: boolean = true;

  listType: string = 'grid';

  viewport: string;

  options: any;

  showDelete = false;

  billPresentmentOverview: any = {
    corporateAuthorized: 120,
    bankAuthorized: 24,
    toRepair: 24,
  };

  typeOfBillPresentment: any[] = [
    {
      madeBy: 'Document Against Payment',
      value: 48,
    },
    {
      madeBy: 'Document Against Acceptance',
      value: 24,
    },
    {
      madeBy: 'Letter Of Credit',
      value: 28,
    },
    {
      madeBy: 'Open Account',
      value: 23,
    },
    {
      madeBy: 'Draft Purchase',
      value: 32,
    },
  ];

  listingTypes = [
    {
      id: 'Drafts',
      displayName: 'Drafts',
      colDefsUrl: 'trade/exportTransactions/billPresentment/private/draftColDefs',
      rowDefUrl: 'trade/exportTransactions/billPresentment/private/getDraftList',
      count: 6,
    },
    {
      id: 'Recent Bill Presentment',
      displayName: 'Recent Bill Presentment',
      colDefsUrl: 'trade/exportTransactions/billPresentment/private/recentColDefs',
      rowDefUrl: 'trade/exportTransactions/billPresentment/private/getRecentList',
      count: 10,
    },
    {
      id: 'Templates',
      displayName: 'Templates',
      colDefsUrl: 'trade/exportTransactions/billPresentment/private/templateColDefs',
      rowDefUrl: 'trade/exportTransactions/billPresentment/private/getTemplateList',
      count: 5,
    },
    {
      id: 'Repair List',
      displayName: 'Repair List',
      colDefsUrl: 'trade/exportTransactions/billPresentment/private/repairColDefs',
      rowDefUrl: 'trade/exportTransactions/billPresentment/private/getRepairList',
    },
  ];

  frameworkComponents = {
    statusRenderer: BillPresentmentStatusRendererComponent,
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
      heading: 'Bill Presentment - Initiate',
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
      { label: 'Bill Presentment' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.prepareChartOptions();

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });
    this.loading = false;
  }

  changeActiveListing(listingType: any) {
    this.activeListing = listingType;

    if (this.listType === 'grid') {
      this.billPresentmentGrid.refreshGridList();
    }
  }

  onListTypeChange(listType: string) {
    this.listType = listType;
  }

  onChangeBillPresentmentOverview(duration: any) {
    if (duration.id == 'Today') {
      this.billPresentmentOverview = {
        corporateAuthorized: 120,
        bankAuthorized: 24,
        toRepair: 24,
      };
    } else if (duration.id == 'This Month') {
      this.billPresentmentOverview = {
        corporateAuthorized: 420,
        bankAuthorized: 130,
        toRepair: 104,
      };
    } else {
      this.billPresentmentOverview = {
        corporateAuthorized: 7600,
        bankAuthorized: 1450,
        toRepair: 1254,
      };
    }
  }

  onChangeTypeOfBillPresentment(duration: any) {
    if (duration.id == 'Today') {
      this.typeOfBillPresentment[0].value = 48;
      this.typeOfBillPresentment[1].value = 24;
      this.typeOfBillPresentment[2].value = 28;
      this.typeOfBillPresentment[3].value = 23;
      this.typeOfBillPresentment[4].value = 32;
    } else if (duration.id == 'This Month') {
      this.typeOfBillPresentment[0].value = 192;
      this.typeOfBillPresentment[1].value = 96;
      this.typeOfBillPresentment[2].value = 112;
      this.typeOfBillPresentment[3].value = 105;
      this.typeOfBillPresentment[4].value = 128;
    } else {
      this.typeOfBillPresentment[0].value = 1936;
      this.typeOfBillPresentment[1].value = 957;
      this.typeOfBillPresentment[2].value = 1308;
      this.typeOfBillPresentment[3].value = 1232;
      this.typeOfBillPresentment[4].value = 1453;
    }
    this.prepareChartOptions();
  }

  private prepareChartOptions() {
    this.options = {
      formatter: (params: any) => {
        return `
        ${this.typeOfBillPresentment[params.itemId].madeBy}\t\t\t\t${
          this.typeOfBillPresentment[params.itemId].value
        }`;
      },
      data: this.typeOfBillPresentment,
      labelKey: 'madeBy',
      angleKey: 'value',
    };
  }

  copy() {}

  edit(id: string) {
    this.viewService.setId(id);
    this.viewService.setMode('EDIT');

    this.router.navigate(['./initiate'], { relativeTo: this.route });
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
