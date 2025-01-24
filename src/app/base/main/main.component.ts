import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppSetting, ExtraSetting } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [MessageService],
})
export class MainComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  isSidebarOpen: boolean = false;
  lastActivities = true;
  menuType: string;
  viewport: string;
  pinnedMenu: boolean;
  fullScreenWidget: boolean;
  isHeaderExpanded: boolean;
  previousMenuType: string;

  constructor(
    public viewportService: ViewportService,
    private router: Router,
    private userService: UserService,
    private appSettingService: AppSettingService,
  ) {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.menuType = appSetting.menuType;

      this.pinnedMenu = appSetting.pinnedMenu;
    });

    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      this.isHeaderExpanded = extraSetting.isHeaderExpanded;
    });
  }

  ngOnInit() {
    this.loadScript();
    /* same url reload */
    /* this.router.onSameUrlNavigation = 'reload';
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; */
    /* blank url to default dashboard */

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });

    this.userService.getLoginType().subscribe((loginType: string) => {
      this.loading = true;
      this.router.navigateByUrl('/dashboard/consolidated');

      setTimeout(() => {
        this.loading = false;
      }, 100);
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url == '' || this.router.url == '/') {
          this.router.navigateByUrl(this.userService.dashboardRouteUrl);
        }
      }
    });

    if (window.innerWidth <= 991) {
      if (this.menuType !== 'mobile') {
        this.previousMenuType = this.menuType;

        this.viewportService.setViewport('mobile');

        this.appSettingService.setMenuType('mobile');
      }
    } else {
      const newMenuType: any =
        this.previousMenuType && this.previousMenuType !== 'mobile'
          ? this.previousMenuType
          : 'sidebar';

      if (this.menuType !== newMenuType) {
        this.viewportService.setViewport('web');

        this.appSettingService.setMenuType(newMenuType);
      }
    }

    window.addEventListener('resize', (event: any) => {
      if (event.target.innerWidth <= 991) {
        if (this.menuType !== 'mobile') {
          this.previousMenuType = this.menuType;

          this.viewportService.setViewport('mobile');

          this.appSettingService.setMenuType('mobile');
        }
      } else {
        const newMenuType: any =
          this.previousMenuType && this.previousMenuType !== 'mobile'
            ? this.previousMenuType
            : 'sidebar';

        if (this.menuType !== newMenuType) {
          this.viewportService.setViewport('web');

          this.appSettingService.setMenuType(newMenuType);
        }
      }
    });

    this.userService.getlastActivities().subscribe((lastActivities) => {
      this.lastActivities = lastActivities;
    });
  }

  public loadScript() {
    try {
      let body = <HTMLDivElement>document.body;
      let script = document.createElement('script');
      script.innerHTML = '';
      script.src = 'assets/chat-bot.js';
      script.async = true;
      script.defer = true;
      body.appendChild(script);
    } catch (e) {
      console.error('error while removing bot ', e);
    }
  }
  ngOnDestroy(): void {
    window.removeAllListeners('resize');
    // this.widgetService.setDashboard([]);
  }
}
