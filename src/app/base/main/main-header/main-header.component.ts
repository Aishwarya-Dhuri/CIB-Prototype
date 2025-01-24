import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { AutoComplete } from 'primeng/autocomplete';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { AppSetting, ExtraSetting } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { SidebarService } from 'src/app/shared/@services/sidebar.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Breadcrumb } from '../@models/breadcrumb.model';
import { Link, Menu } from '../@models/menus';
import { BreadcrumbService } from '../@services/breadcrumb.service';
import { MenuService } from '../@services/menu.service';
import { ConfigComponent } from '../right-sidebar/config/config.component';
import { CountryComponent } from '../right-sidebar/country/country.component';
import { ExternalLinksComponent } from '../right-sidebar/external-links/external-links.component';
import { LanguageComponent } from '../right-sidebar/language/language.component';
import { MailsComponent } from '../right-sidebar/mails/mails.component';
import { NotificationsComponent } from '../right-sidebar/notifications/notifications.component';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('autoComplete') autoComplete: AutoComplete;
  isExpand: boolean;
  userInfo: boolean = false;
  showSearch: boolean = false;
  showFeedbackModal: boolean = false;
  moreOptions: boolean = false;
  helpOptions: boolean = false;
  menuType: string;
  menuPinned: boolean;
  isDarkTheme: boolean;
  isIslamicBank: boolean;
  userDetails: any;

  showFeedbackHistory: boolean = false;

  feedbackType: string = '';
  remark: string = '';

  headerAssetsUrl: string = '';
  bankLogoUrl: string = '';
  productLogoUrl: string = '';

  groupList: any[] = [];
  selectedGroup: any;

  accountBalance: string = '0';

  searchInput: string = '';

  currency: string = 'AED';

  menuLinkList!: Link[];
  filterMenuLinkList!: Link[];

  constructor(
    private sidebarService: SidebarService,
    private httpService: HttpService,
    private userService: UserService,
    private currencyService: CurrencyService,
    private appSettingService: AppSettingService,
    private toasterService: ToasterService,
    private menuService: MenuService,

    private viewService: ViewService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private listingService: ListingService,
  ) {
    this.headerAssetsUrl = this.httpService.getAssetUrl('assets/header-images/');
    this.productLogoUrl =
      this.headerAssetsUrl + `product-logo-${userService.userDetails.corporateType}.png`;
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      if (
        appSetting.bankLogoFileName &&
        this.bankLogoUrl != this.headerAssetsUrl + appSetting.bankLogoFileName
      ) {
        this.bankLogoUrl = this.headerAssetsUrl + appSetting.bankLogoFileName;
      }
      if (appSetting.menuType && this.menuType != appSetting.menuType) {
        this.menuType = appSetting.menuType;
      }
      if (this.menuPinned != appSetting.pinnedMenu) {
        this.menuPinned = appSetting.pinnedMenu;
      }
      if (this.isDarkTheme != appSetting.isDarkTheme) {
        this.isDarkTheme = appSetting.isDarkTheme;
      }
    });

    this.isIslamicBank = this.userService.loginPreferenceDetails.bankType == 'Islamic';

    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      this.isExpand = extraSetting.isHeaderExpanded;
    });
  }

  dropdown = false;
  search = false;
  ngOnInit(): void {
    this.isExpand = false;

    window.addEventListener('click', () => {
      this.dropdown = false;
      this.search = false;
    });

    this.currencyService.getCurrencyName().subscribe((currency: string) => {
      this.currency = currency;
    });

    this.userDetails = this.userService.userDetails;

    this.groupList = [
      { id: 'individual', displayName: 'Individual' },
      ...cloneDeep(this.userService.userGroups),
    ];

    if (this.userService.loginPreferenceDetails.loginType == 'individual') {
      this.selectedGroup = this.groupList[0];
    } else {
      this.selectedGroup = this.userService.group;
    }

    this.menuService.getMenuLinkList().subscribe((menuLinkList: Link[]) => {
      this.menuLinkList = menuLinkList;
    });
  }

  goToDefaultDashboard() {
    this.menuService.goToDefaultDashboard();
  }

  onSearchInput() {
    if (this.searchInput) {
      this.filterMenuLinkList = this.menuLinkList
        .filter((v) => v.displayName.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1)
        .slice(0, 10);

      if (this.filterMenuLinkList.length > 0) {
        this.search = true;
      } else {
        this.search = false;
      }
    } else {
      this.search = false;
    }
  }

  navigateToQuickSearch(link: any): void {
    if (link.url) {
      // this.menuService.navigateByUrl(this.quickSearchText.url);
      // this.quickSearchText = new Link();

      this.handleRoute(
        link.menu,
        link,
        link.url,
        link.moduleName + '/' + link.menuCategoryName + '/' + link.menuName + '/' + link.linkName,
      );
      this.searchInput = '';
    }
    this.search = false;
  }

  handleRoute(menu: Menu, link: Link, url: string, breadcrumb: string) {
    this.menuService.setSelectedMenu(menu);
    this.menuService.setSelectedLink(link);
    this.menuService.setSelectedEntityName(menu.entityName);
    this.menuService.setSelectedServiceUrl(menu.serviceUrl);

    const breadcrumbs: Breadcrumb[] = [{ icon: 'fa-home' }];

    breadcrumb.split('/').forEach((label: string) => {
      breadcrumbs.push({
        label,
      });
    });

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

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
    });
  }

  onCurrencyChanged(currency: any) {
    this.currency = currency.displayName;
  }

  groupChange(id: any) {
    this.groupList = [
      { id: 'individual', displayName: 'Individual' },
      ...cloneDeep(this.userService.userGroups),
    ];

    const group = this.groupList.find((g: any) => g.id == id);
    this.selectedGroup = group;

    this.dropdown = false;

    if (id == 'individual') {
      this.userService.loginPreferenceDetails.loginType = 'individual';
      this.userService.loginPreferenceDetails.groupId = '';
      this.userService.loginPreferenceDetails.groupName = '';
    } else {
      this.userService.group = group;
      this.userService.groupId = group.id;
      this.userService.loginPreferenceDetails.loginType = 'group';
      this.userService.loginPreferenceDetails.groupId = group.id;
      this.userService.loginPreferenceDetails.groupName = group.displayName;
    }

    const data = {
      ...this.userService.loginPreferenceDetails,
    };

    this.httpService
      .httpPost('login/public/updateLoginDetails', { ...data })
      .subscribe((response: any) => {
        this.userService.userDetails = response.userDetails;
        this.userService.applicationDate = response.userDetails.applicateDate;
        this.userService.userName = response.userDetails.userName;
        this.userService.corporateId = response.userDetails.corporateId;
        this.userService.loginPreferenceDetails = data;

        this.userService.groupId = response.userDetails.groupId;

        this.userService.corporateId = response.userDetails.corporateId;

        this.userService.setLoginType(this.userService.loginPreferenceDetails.loginType);
      });
  }

  getAccountNoList(): void {
    const data = { dataMap: { corporateId: this.userService.userDetails.corporateId } };

    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        let accountBalance: number = 0;

        response.dataList.forEach((account: any) => {
          accountBalance = +accountBalance + +account.enrichments.balance;
        });

        this.accountBalance = accountBalance.toString();
      });
  }

  togglePinnedMenu() {
    this.appSettingService.setPinnedMenu(!this.menuPinned);
  }

  openNotificationSidebar() {
    this.sidebarService.showSidebar(NotificationsComponent);
  }

  openMailsSidebar() {
    this.sidebarService.showSidebar(MailsComponent);
  }

  openLanguageSidebar() {
    this.sidebarService.showSidebar(LanguageComponent);
  }

  openConfigSidebar() {
    this.sidebarService.showSidebar(ConfigComponent);
  }

  openCountrySidebar() {
    this.sidebarService.showSidebar(CountryComponent);
  }

  openExternalSidebarLinks() {
    this.sidebarService.showSidebar(ExternalLinksComponent);
  }

  toggleHeader() {
    this.appSettingService.setIsHeaderExpanded(!this.isExpand);
  }

  changeThemeDarkMode(): void {
    this.appSettingService.setIsDarkTheme(!this.isDarkTheme);
  }

  onChangeBankType(bankType: any) {
    if (this.userService.loginPreferenceDetails.bankType == bankType) {
      this.userService.loginPreferenceDetails.bankType = bankType;
      this.isIslamicBank = bankType == 'Islamic';

      if (this.isIslamicBank) {
        this.appSettingService.setDirection('rtl');
        this.appSettingService.setThemeId(1646939775489);
      } else {
        this.appSettingService.setDirection('ltr');
        this.appSettingService.getAppConfigurations(1);
      }
    }
  }

  submitFeedback() {
    this.httpService
      .httpPost('commons/feedbackService/private/create', {
        feedbackType: this.feedbackType,
        remark: this.remark,
      })
      .subscribe((response: any) => {
        this.toasterService.showToaster({
          severity: 'success',
          detail: 'Feedback Submitted Successfully!!',
        });

        this.showFeedbackModal = false;
      });
  }

  ngOnDestroy(): void {
    window.removeAllListeners('click');
  }
}
