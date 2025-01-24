import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Breadcrumb } from '../@models/breadcrumb.model';
import { Menu } from '../@models/menus';
import { BreadcrumbService } from '../@services/breadcrumb.service';
import { MenuService } from '../@services/menu.service';

import { ListingComponent } from 'src/app/shared/@components/generic-listing/components/listing/listing.component';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadCrumb: Breadcrumb[];
  model: Breadcrumb[];

  menu!: Menu;
  selectedLink: string;
  dropdown = false;
  isLengthGreaterThenOne = false;
  isLengthGreaterThenTwo = false;

  constructor(
    private menuService: MenuService,
    private router: Router,
    private listingService: ListingService,
    private viewService: ViewService,
    public breadcrumbService: BreadcrumbService
  ) { }


  ngOnInit() {
    window.addEventListener('click', () => {
      this.dropdown = false;
    });

    this.breadcrumbService.getBreadcrumb().subscribe((model: Breadcrumb[]) => {
      this.model = model;
      this.breadCrumb = model;
      this.model = [...this.breadCrumb];

      console.log(this.model);

      this.menu = this.menuService.getSelectedMenu();
      const link = this.menuService.getSelectedLink();

      if (this.menu && link) {
        this.selectedLink = link.displayName;
        const linksArray = this.menu.menuLinksDetail.link;

        if (linksArray.length === 1) {
          this.isLengthGreaterThenOne = true;
          this.isLengthGreaterThenTwo = false;
        }
        else if (linksArray.length > 1) {
          this.isLengthGreaterThenTwo = true;
          this.isLengthGreaterThenOne = false;
        }

        const i = this.model.length - 1;
        if (this.model[i].label.toLowerCase() == 'initiate') {
          this.model.splice(i, 1);
        }
      }
    });
  }

  changeMenuLink(menuLink: any) {
    this.dropdown = false;

    const link = this.menu.menuLinksDetail.link.find((l: any) => l.id == menuLink);
    if (link) {
      this.menuService.setSelectedLink(link);

      this.breadcrumbService.setBreadCrumb(this.breadCrumb);

      if (link.url.indexOf('/listing') != -1 && link.url.indexOf('#') != -1) {
        const listTypeCode = link.url.split('#').length > 1 ? link.url.split('#')[1] : null;
        this.listingService.setSelectedListCode(listTypeCode);
        link.url = link.url.substring(0, link.url.indexOf('#'));
      }

      if (this.menu.menuCategory == 'Dynamic') {
        this.menuService.setIsDynamicFormBuilderMenu(true);
      } else {
        this.menuService.setIsDynamicFormBuilderMenu(false);
      }

      if (link.url.indexOf('/listing') == -1 && this.menu.menuCategory == 'Dynamic') {
        this.viewService.setId(this.menu.dynamicFormId);
        link.url += '/dynamic';
      }

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([link.url]);
      });
    }
  }

  goToDefaultDashboard() {
    this.menuService.goToDefaultDashboard();
  }

  ngOnDestroy() { }
}
