import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Breadcrumb } from '../../@models/breadcrumb.model';
import { BreadcrumbService } from '../../@services/breadcrumb.service';
import { MenuService } from '../../@services/menu.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  frequentlyUsedMenus: any[] = [
    {
      moduleId: '2',
      moduleName: 'Payments',
      menuCategoryId: '211',
      menuCategoryName: 'Masters',
      menuId: '21113',
      menuName: 'Beneficiary',
      linkId: 1,
      linkName: 'Initiate',
      displayName: 'Payments -> Masters -> Beneficiary -> Initiate',
      link: 'payments/masters/beneficiary',
    },
    {
      id: 6,
      moduleId: '2',
      moduleName: 'Payments',
      menuCategoryId: '211',
      menuCategoryName: 'Masters',
      menuId: '21116',
      menuName: 'MT Registration',
      linkId: 1,
      linkName: 'Initiate',
      displayName: 'Payments -> Masters -> MT Registration -> Initiate',
      link: 'payments/masters/mtRegistration',
    },
    {
      id: 7,
      moduleId: '2',
      moduleName: 'Payments',
      menuCategoryId: '212',
      menuCategoryName: 'Transactions',
      menuId: '21212',
      menuName: 'Single Payment Request',
      linkId: 1,
      linkName: 'Initiate',
      displayName: 'Payments -> Transactions -> Single Payment Request -> Initiate',
      link: 'payments/transactions/singlePaymentRequest',
    },
    {
      id: 8,
      moduleId: '2',
      moduleName: 'Payments',
      menuCategoryId: '212',
      menuCategoryName: 'Transactions',
      menuId: '21214',
      menuName: 'Statutory Payment Request',
      linkId: 1,
      linkName: 'Initiate',
      displayName: 'Payments -> Transactions -> Statutory Payment Request -> Initiate',
      link: 'payments/transactions/statutoryPayment',
    },
  ];

  constructor(
    private menuService: MenuService,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private listingService: ListingService,
    private viewService: ViewService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  handleFrequentlyUsedMenu(frequentMenu: any) {
    const menu = this.menuService.getMenu(
      frequentMenu.moduleId,
      frequentMenu.menuCategoryId,
      frequentMenu.menuId,
    );

    if (menu) {
      this.menuService.setSelectedMenu(menu);
      this.menuService.setSelectedEntityName(menu.entityName);
      this.menuService.setSelectedServiceUrl(menu.serviceUrl);
    }

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: frequentMenu.moduleName },
      { label: frequentMenu.menuCategoryName },
      { label: frequentMenu.menuName },
      { label: frequentMenu.linkName },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    if (frequentMenu.link.indexOf('/listing') != -1 && frequentMenu.link.indexOf('#') != -1) {
      const listTypeCode =
        frequentMenu.link.split('#').length > 1 ? frequentMenu.link.split('#')[1] : null;
      this.listingService.setSelectedListCode(listTypeCode);
      frequentMenu.link = frequentMenu.link.substring(0, frequentMenu.link.indexOf('#'));
    }

    if (frequentMenu.menuCategory == 'Dynamic') {
      this.menuService.setIsDynamicFormBuilderMenu(true);
    } else {
      this.menuService.setIsDynamicFormBuilderMenu(false);
    }

    if (frequentMenu.link.indexOf('/listing') == -1 && frequentMenu.menuCategory == 'Dynamic') {
      this.viewService.setId(frequentMenu.dynamicFormId);
      frequentMenu.link += '/dynamic';
    }

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([frequentMenu.link]);
    });

    this.userService.setLastActivities(false);
  }
}
