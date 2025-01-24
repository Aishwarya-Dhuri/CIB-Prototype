import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ShippingGuaranteeStatusRendererComponent } from './@components/shipping-guarantee-status-renderer/shipping-guarantee-status-renderer.component';

@Component({
  selector: 'app-shipping-guarantee',
  templateUrl: './shipping-guarantee.component.html',
  styleUrls: ['./shipping-guarantee.component.scss'],
})
export class ShippingGuaranteeComponent implements OnInit {
  @ViewChild('shippingGuaranteeGrid') shippingGuaranteeGrid: any;

  loading: boolean = true;

  listType: string = 'grid';

  viewport: string;

  showHistory = false;
  showDelete = false;

  options: any;

  shippingGuaranteeOverview: any = {
    corporateAuthorized: 120,
    bankAuthorized: 24,
    toRepair: 24,
  };

  typeOfShippingGuarantee: any[] = [
    {
      madeBy: 'Always Bill/Invoice Endorsement',
      value: 48,
    },
    {
      madeBy: 'Original Bill of Lading Endorsement',
      value: 24,
    },
    {
      madeBy: 'Shipping Guarantee',
      value: 28,
    },
  ];

  listingTypes = [
    {
      id: 'Drafts',
      displayName: 'Drafts',
      colDefsUrl: 'trade/importTransactions/shippingGuarantee/private/draftColDefs',
      rowDefUrl: 'trade/importTransactions/shippingGuarantee/private/getDraftList',
      count: 6,
    },
    {
      id: 'Recent Shipping Guarantee',
      displayName: 'Recent Shipping Guarantee',
      colDefsUrl: 'trade/importTransactions/shippingGuarantee/private/recentColDefs',
      rowDefUrl: 'trade/importTransactions/shippingGuarantee/private/getRecentList',
      count: 10,
    },
    {
      id: 'Templates',
      displayName: 'Templates',
      colDefsUrl: 'trade/importTransactions/shippingGuarantee/private/templateColDefs',
      rowDefUrl: 'trade/importTransactions/shippingGuarantee/private/getTemplateList',
      count: 5,
    },
    {
      id: 'Repair List',
      displayName: 'Repair List',
      colDefsUrl: 'trade/importTransactions/shippingGuarantee/private/repairColDefs',
      rowDefUrl: 'trade/importTransactions/shippingGuarantee/private/getRepairList',
    },
  ];

  frameworkComponents = {
    statusRenderer: ShippingGuaranteeStatusRendererComponent,
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
      heading: 'Shipping Guarantee - Initiate',
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
      { label: 'Shipping Guarantee' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.prepareChartOptions();

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });

    this.loading = false;
  }

  changeActiveListing(listingType: any): void {
    this.activeListing = listingType;

    if (this.listType === 'grid') {
      this.shippingGuaranteeGrid.refreshGridList();
    }
  }

  onListTypeChange(listType: string): void {
    this.listType = listType;
  }

  onChangeShippingGuaranteeOverview(duration: any) {
    if (duration.id == 'Today') {
      this.shippingGuaranteeOverview = {
        corporateAuthorized: 120,
        bankAuthorized: 24,
        toRepair: 24,
      };
    } else if (duration.id == 'This Month') {
      this.shippingGuaranteeOverview = {
        corporateAuthorized: 420,
        bankAuthorized: 130,
        toRepair: 104,
      };
    } else {
      this.shippingGuaranteeOverview = {
        corporateAuthorized: 7600,
        bankAuthorized: 1450,
        toRepair: 1254,
      };
    }
  }
  onChangeTypePfShippingGuarantee(duration: any) {
    if (duration.id == 'Today') {
      this.typeOfShippingGuarantee[0].value = 48;
      this.typeOfShippingGuarantee[1].value = 24;
      this.typeOfShippingGuarantee[2].value = 28;
    } else if (duration.id == 'This Month') {
      this.typeOfShippingGuarantee[0].value = 192;
      this.typeOfShippingGuarantee[1].value = 96;
      this.typeOfShippingGuarantee[2].value = 112;
    } else {
      this.typeOfShippingGuarantee[0].value = 1936;
      this.typeOfShippingGuarantee[1].value = 957;
      this.typeOfShippingGuarantee[2].value = 1308;
    }
    this.prepareChartOptions();
  }

  private prepareChartOptions() {
    this.options = {
      formatter: (params: any) => {
        return `
        ${this.typeOfShippingGuarantee[params.itemId].madeBy}\t\t\t\t${
          this.typeOfShippingGuarantee[params.itemId].value
        }`;
      },
      data: this.typeOfShippingGuarantee,
      labelKey: 'madeBy',
      angleKey: 'value',
    };
  }

  copy(): void {}

  edit(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('EDIT');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  history(id: string): void {
    this.showHistory = true;
  }

  view(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('VIEW');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  file(): void {}

  repair(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('REPAIR');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  accept(): void {}

  delete(): void {
    this.showDelete = true;
  }

  useDraft(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('DRAFT');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  useTemplate(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('TEMPLATE');
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }
}
