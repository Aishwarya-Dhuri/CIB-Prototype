import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { OutwardTelegraphicTransferStatusRendererComponent } from './@components/outward-telegraphic-transfer-status-renderer/outward-telegraphic-transfer-status-renderer.component';
import { HttpService } from 'src/app/shared/@services/http.service';


@Component({
  selector: 'app-outward-telegraphic-transfer',
  templateUrl: './outward-telegraphic-transfer.component.html',
  styleUrls: ['./outward-telegraphic-transfer.component.scss']
})
export class OutwardTelegraphicTransferComponent implements OnInit {
  @ViewChild('outwardTelegraphTransferGrid') outwardTelegraphTransferGrid: any;
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
      madeBy: 'Advance Payment',
      value: 40,
    },
    {
      madeBy: 'Open Account Payment',
      value: 24,
    }
  ];

  listingTypes = [
    {
      id: 'Drafts',
      displayName: 'Drafts',
      colDefsUrl: 'trade/importTransactions/outwardTelegraphTransfer/private/draftColDefs',
      rowDefUrl: 'trade/importTransactions/outwardTelegraphTransfer/private/getDraftList',
      count: 2,
    },
    {
      id: 'Recent Outward Telegraphic Transfer',
      displayName: 'Recent Outward Telegraphic Transfer',
      colDefsUrl: 'trade/importTransactions/outwardTelegraphTransfer/private/recentColDefs',
      rowDefUrl: 'trade/importTransactions/outwardTelegraphTransfer/private/getRecentList',
      count: 3,
    },
    {
      id: 'Templates',
      displayName: 'Templates',
      colDefsUrl: 'trade/importTransactions/outwardTelegraphTransfer/private/templateColDefs',
      rowDefUrl: 'trade/importTransactions/outwardTelegraphTransfer/private/getTemplateList',
      count: 1,
    }
  ];

  frameworkComponents = {
    statusRenderer: OutwardTelegraphicTransferStatusRendererComponent,
  };

  activeListing: any = this.listingTypes[1];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewportService: ViewportService,
    private viewService: ViewService,
    private httpService: HttpService,
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
      heading: 'Outward Telegraphic Transfer - Initiate',
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
      { label: 'Outward Telegraphic Transfer' },
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

    this.fetchCount()

    this.loading = false;
  }


  fetchCount(): void {
    this.listingTypes.forEach((listingType, index) => {
      const data = { dataMap: { filters: [] } };
      this.httpService.httpPost(listingType.rowDefUrl, data).subscribe(
        (response: any) => {
          this.listingTypes[index].count = response?.count || '0';
        },
        (error) => {
          console.error(`Error fetching count for tab: ${listingType.displayName}`, error);
          // this.listingTypes[index].count = 0;
        }
      )
    })
  }



  changeActiveListing(listingType: any) {
    this.activeListing = listingType;

    if (this.listType === 'grid') {
      this.outwardTelegraphTransferGrid.refreshGridList();
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
  };

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

  onCancel(id: string) {
    this.viewService.setId(id);
    console.log(id);
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
