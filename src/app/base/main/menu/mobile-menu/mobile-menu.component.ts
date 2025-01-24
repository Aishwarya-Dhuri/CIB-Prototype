import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Breadcrumb } from '../../@models/breadcrumb.model';
import { Menu } from '../../@models/menus';
import { BreadcrumbService } from '../../@services/breadcrumb.service';
import { MenuService } from '../../@services/menu.service';
import { MenuComponent } from '../menu.component';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent implements OnInit {
  @Input('mobileMenus') mobileMenus: {
    activeMenu: string;
    menus: Menu[];
    isSubMenus?: boolean;
  };
  @Output() closeMenu = new EventEmitter<void>();

  activeMenu: string;
  mobileSubMenus: {
    activeMenu: string;
    menus: Menu[];
  } | null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService,
    public breadcrumbService: BreadcrumbService,
    public menuComponent: MenuComponent,
    public userService: UserService,
    private listingService: ListingService,
    private viewService: ViewService,
  ) {}

  ngOnInit() {}

  handleRoute(menu: Menu, url: string, breadcrumb: string) {
    this.menuService.setSelectedMenu(menu);
    this.menuService.setSelectedEntityName(menu.entityName);
    this.menuService.setSelectedServiceUrl(menu.serviceUrl);

    const breadcrumbs: Breadcrumb[] = [{ icon: 'fa-home' }];

    this.mobileMenus.activeMenu.split('/').forEach((label: string) => {
      breadcrumbs.push({
        label: label.trim(),
      });
    });

    breadcrumb.split('/').forEach((label: string) => {
      breadcrumbs.push({
        label,
      });
    });

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    if (url.indexOf('/listing') != -1) {
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

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
      this.menuComponent.closeOverlayMenu();
    });
  }

  onMenuClick(menu: any) {
    if (this.mobileMenus.activeMenu == 'Dashboard') {
      const breadcrumbs: Breadcrumb[] = [
        { icon: 'fa-home' },
        { label: 'Dashboard' },
        { label: menu.displayName },
      ];

      this.breadcrumbService.setBreadCrumb(breadcrumbs);

      this.userService.setDashboardType(menu.displayName.toLowerCase());
      this.router.navigate(['/dashboard', menu.displayName.toLowerCase()], {
        relativeTo: this.route,
      });
    }

    this.menuComponent.closeOverlayMenu();
  }

  closeMobileMenu() {
    this.closeMenu.emit();
  }

  openMobileMenu(activeMenu: string, subMenu: Menu[]) {
    activeMenu = this.mobileMenus.activeMenu + ' / ' + activeMenu;
    this.mobileSubMenus = { activeMenu, menus: subMenu };
  }

  closeMobileSubMenu() {
    this.mobileSubMenus = null;
  }

  toggleMobileSubMenu(activeMenu: string) {
    if (this.activeMenu === activeMenu) {
      this.activeMenu = '';
    } else {
      this.activeMenu = activeMenu;
    }
  }
}
