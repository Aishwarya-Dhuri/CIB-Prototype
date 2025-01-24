import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Link, Menu, Module } from '../@models/menus';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menus!: Module[];
  private selectedMenu!: Menu;
  private selectedLink!: Link;
  private selectedEntityName!: string;
  private selectedServiceUrl!: string;
  private isDynamicFormBuilderMenu!: boolean;
  private menuLinkListSubject = new BehaviorSubject<Link[]>([]);

  constructor(private router: Router, private route: ActivatedRoute) {}

  setSelectedMenu(selectedMenu: Menu) {
    this.selectedMenu = selectedMenu;
  }

  getSelectedMenu(): Menu {
    return this.selectedMenu;
  }

  getMenu(moduleId: string, menuCategoryId: string, menuId: any) {
    const module: any = this.menus.find((menu: Module) => menu.moduleId == moduleId);
    if (module) {
      const menu: Menu = module.menus.find((menu: Menu) => menu.id == menuCategoryId);
      if (menu) {
        const menu1: Menu = menu.menus.find((menu: Menu) => menu.id == menuId);
        if (menu1) {
          return menu1;
        }
      }
    }

    return null;
  }

  setSelectedLink(link: Link) {
    this.selectedLink = link;
  }

  getSelectedLink() {
    return this.selectedLink;
  }

  setSelectedEntityName(entityName: string) {
    this.selectedEntityName = entityName;
  }

  getSelectedEntityName(): string {
    return this.selectedEntityName;
  }

  setSelectedServiceUrl(selectedServiceUrl: string) {
    this.selectedServiceUrl = selectedServiceUrl;
  }

  getSelectedServiceUrl(): string {
    return this.selectedServiceUrl;
  }

  setIsDynamicFormBuilderMenu(isDynamicFormBuilderMenu: boolean): void {
    this.isDynamicFormBuilderMenu = isDynamicFormBuilderMenu;
  }

  getIsDynamicFormBuilderMenu(): boolean {
    return this.isDynamicFormBuilderMenu;
  }

  goToDefaultDashboard() {
    this.setSelectedMenu(null);
    this.setSelectedLink(null);

    this.router.navigate(['/dashboard', 'consolidated'], {
      relativeTo: this.route,
    });
  }

  setMenus(menus: Module[]) {
    this.menus = menus;
    let menuLinkList: any[] = [];

    [...menus].forEach((moduleWiseMenu: Module) => {
      if (moduleWiseMenu.isFullMenu) {
        if (moduleWiseMenu.menus) {
          moduleWiseMenu.menus.forEach((parentMenu: Menu) => {
            if (parentMenu.menus) {
              parentMenu.menus.forEach((childMenu: Menu) => {
                childMenu.parentName = parentMenu.displayName;
                childMenu.moduleId = moduleWiseMenu.moduleId;
                childMenu.moduleName =
                  moduleWiseMenu.moduleName == 'Commons' ? 'Setup' : moduleWiseMenu.moduleName;
                if (childMenu.menuLinksDetail.link) {
                  childMenu.menuLinksDetail.link.forEach((link: Link) => {
                    // this.urlEntityNameMap.set(
                    //   this.getEntityUrlByLinkUrl(link.url),
                    //   childMenu
                    // );
                    menuLinkList.push({
                      ...link,
                      menu: childMenu,
                      moduleName: moduleWiseMenu.moduleName,
                      menuCategoryName: parentMenu.displayName,
                      menuName: childMenu.displayName,
                      linkName: link.displayName,
                      url: link.url,
                      serviceUrl: childMenu.serviceUrl,
                      entityName: childMenu.entityName,
                      displayName:
                        moduleWiseMenu.moduleName +
                        ' - ' +
                        childMenu.displayName +
                        ' - ' +
                        link.displayName,
                    });
                  });
                }
              });
            }
          });
        }
      }
    });
    this.menuLinkListSubject.next(menuLinkList);
  }

  getMenuLinkList(): Observable<Link[]> {
    return this.menuLinkListSubject;
  }

  getMenus() {
    return this.menus;
  }
}
