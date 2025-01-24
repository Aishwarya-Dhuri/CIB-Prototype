import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { AppSetting } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Breadcrumb } from '../../@models/breadcrumb.model';
import { Link, Menu } from '../../@models/menus';
import { BreadcrumbService } from '../../@services/breadcrumb.service';
import { MenuService } from '../../@services/menu.service';

@Component({
  selector: 'app-fullscreen-menus',
  templateUrl: './fullscreen-menus.component.html',
  styleUrls: ['./fullscreen-menus.component.scss'],
})
export class FullscreenMenusComponent implements OnInit {
  currentMenu: string;

  searchString: string = '';

  @Input('parentMenu') parentMenu: string;
  @Input('showHeader') showHeader: boolean;
  @Input('menus') menus?: Menu[];
  @Input('frequentlyUsedMenus') frequentlyUsedMenus?: any[];
  @Input('advertisement') advertisement?: any[];

  filteredMenus: Menu[];

  menuType: string;
  serverUrl: string;

  @Output() closeFullScreen = new EventEmitter<void>();

  constructor(
    private router: Router,
    private menuService: MenuService,
    private breadcrumbService: BreadcrumbService,
    private appSettingService: AppSettingService,
    private listingService: ListingService,
    private httpService: HttpService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.serverUrl = this.httpService.getAssetUrl('assets/images/menu-advertisements/');

    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.menuType = appSetting.menuType;
    });
  }

  handleFrequentlyUsedMenu(menu: any) {
    const menuCategory: any = this.menus?.find((c: any) => c.id == menu.menuCategoryId);
    const menu1: any = menuCategory.menus.find((m: any) => m.id == menu.menuId);
    const link: any = menu1.menuLinksDetail.link.find((l: any) => l.id == menu.linkId);

    this.handleRoute(
      menu1,
      link,
      link.url,
      menu.menuCategoryName + '/' + menu.menuName + '/' + menu.linkName,
    );
  }

  handleRoute(menu: Menu, link: Link, url: string, breadcrumb: string) {
    this.menuService.setSelectedMenu(menu);
    this.menuService.setSelectedLink(link);
    this.menuService.setSelectedEntityName(menu.entityName);
    this.menuService.setSelectedServiceUrl(menu.serviceUrl);

    const breadcrumbs: Breadcrumb[] = [{ icon: 'fa-home' }, { label: this.parentMenu }];

    breadcrumb.split('/').forEach((label: string) => {
      breadcrumbs.push({
        label,
      });
    });

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    if (url.indexOf('/listing') != -1 && url.indexOf('#') != -1) {
      const listTypeCode = url.split('#').length > 1 ? url.split('#')[1] : '';
      this.listingService.setSelectedListCode(listTypeCode);
      url = url.substring(0, url.indexOf('#'));
    }

    if (menu.menuCategory == 'Dynamic') {
      this.menuService.setIsDynamicFormBuilderMenu(true);
    } else {
      this.menuService.setIsDynamicFormBuilderMenu(false);
    }

    if (url.indexOf('/listing') == -1 && menu.menuCategory == 'Dynamic') {
      this.viewService.setId(menu.dynamicFormId);
      url += '/dynamic';
    }

    if (this.menuType == 'overlay') {
      this.appSettingService.setPinnedMenu(false);
    }

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
    });

    this.closeFullScreenMenu();
  }

  openSubMenu(menu: string) {
    this.currentMenu = menu;
  }

  getMenuHeight(menus: any) {
    let h = 12.5;
    if (menus) {
      h += menus.length * 1.5;
    }
    return {
      height: h + 'rem',
    };
  }

  closeSubMenu() {
    this.currentMenu = '';
  }

  closeFullScreenMenu() {
    this.closeFullScreen.emit();
  }
}
