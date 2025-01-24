import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SidebarService } from 'src/app/shared/@services/sidebar.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { Actions } from '../../@models/actions';
import { Breadcrumb } from '../@models/breadcrumb.model';
import { ActionService } from '../@services/action.service';
import { BreadcrumbService } from '../@services/breadcrumb.service';
import { WidgetService } from '../@services/widget.service';
import { WidgetsComponent } from './widgets/widgets.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('actions') actions: any;
  gridType: number;

  fullScreenWidget: boolean;
  dashboardType: string = 'consolidated';
  constructor(
    private widgetService: WidgetService,
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private sidebarService: SidebarService,
    public userService: UserService,
  ) {}

  ngOnInit(): void {
    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Dashboard' },
      { label: 'Consolidated' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.widgetService.getIsFullScreen().subscribe((isFullscreen: boolean) => {
      this.fullScreenWidget = isFullscreen;
    });

    this.userService.getDashboardType().subscribe((dashboardType: string) => {
      this.dashboardType = dashboardType;
    });

    this.widgetService.getGridType().subscribe((gridType: number) => {
      this.gridType = gridType;
    });
  }

  ngAfterViewInit(): void {
    const actions: Actions = {
      heading: 'Consolidated',
      subHeading: null,
      refresh: true,
      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
      favourite: true,
      help: true,
      extraActionTemplateRef: this.actions,
    };

    this.actionsService.setActions(actions);
  }

  changeGrid(gridType: number) {
    this.widgetService.setGridType(gridType);
  }

  openAddWidgetSidebar() {
    this.sidebarService.showSidebar(WidgetsComponent);
  }

  ngOnDestroy(): void {
    this.widgetService.setDashboard([]);
  }
}
