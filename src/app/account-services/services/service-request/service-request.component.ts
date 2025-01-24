import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { RequestNumberRendererComponent } from './@components/request-number-renderer/request-number-renderer.component';
import { RequestStatusRendererComponent } from './@components/request-status-renderer/request-status-renderer.component';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { MenuService } from 'src/app/base/main/@services/menu.service';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss'],
})
export class ServiceRequestComponent implements OnInit {
  @ViewChild('listingGrid') listingGrid: AgGridListingComponent;

  isLoading: boolean = false;
  isShowOnlyHighPriority: boolean = false;

  chartOptions: any;

  srNo: string = '';

  serviceRequestDashboardData: any;

  selectDropdownList: any[] = [];
  selectedListOption: any;

  isExpandSummery: boolean = false;

  trackingInformation: any;

  frameworkComponents = {
    requestNumberRenderer: RequestNumberRendererComponent,
    requestStatusRenderer: RequestStatusRendererComponent,
  };
  context = {
    componentParent: this,
  };

  constructor(
    protected actionsService: ActionService,
    protected breadcrumbService: BreadcrumbService,
    protected menuService: MenuService,
    protected router: Router,
    protected viewService: ViewService,
    protected httpService: HttpService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    const actions: Actions = {
      heading: 'Service Requests',
      subHeading: null,

      refresh: true,

      download: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Service' },
      { label: 'Services Requests' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    const mode = this.viewService.getMode();

    if (mode) {
      this.navigateToInitiate();
      return;
    }

    this.httpService
      .httpPost('accountServices/services/serviceRequest/private/getServiceRequestDashboardData')
      .subscribe((res: any) => {
        this.serviceRequestDashboardData = res.data;

        const chartData = [];

        res.data.listingTypes.forEach((record: any) => {
          if (record.id != 'all' && record.id != 'draft')
            chartData.push({ label: record.label, count: record.count });

          this.selectDropdownList.push({
            id: record.id,
            displayName: record.label,
            enrichments: { ...record },
          });
        });

        this.selectedListOption = this.selectDropdownList[0].enrichments;

        this.chartOptions = {
          data: chartData,
          padding: {
            top: 8,
            bottom: 16,
            left: 8,
            right: 8,
          },
          formatter: (params: any) => {
            return `${chartData[params.itemId].label} \t\t\t\t ${chartData[params.itemId].count}`;
          },
          labelKey: 'label',
          angleKey: 'count',
        };

        this.isLoading = false;
      });
  }

  trackRequestInfo() {
    const data = { dataMap: { id: this.srNo } };

    this.httpService
      .httpPost('accountServices/services/serviceRequest/private/view', data)
      .subscribe((trackingInfo: any) => {
        this.trackingInformation = trackingInfo;
      });
  }

  navigateToInitiate(): void {
    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  viewDetails(): void {
    if (this.trackingInformation) {
      this.viewService.setId(this.trackingInformation.id);
      this.viewService.setMode('VIEW');
      this.navigateToInitiate();
    }
  }

  view(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('VIEW');
    this.navigateToView();
  }

  navigateToView(): void {
    this.router.navigateByUrl(this.getServiceUrl());
  }

  edit(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('EDIT');
    this.navigateToInitiate();
  }
  useDraft(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('DRAFT');
    this.navigateToInitiate();
  }

  authorize(id: any): void {}

  reject(id: string): void {}

  delete(id: string): void {}

  resubmit(id: string): void {}

  acceptReject(id: string) {}

  disable(id: string): void {}

  enable(id: string): void {}

  getServiceUrl(): string {
    return this.menuService.getSelectedServiceUrl();
  }
}
