import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { SecurityQuestionAnswer } from 'src/app/setup/security/corporate-user/@models/user.model';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { LanguageService } from 'src/app/shared/@services/language.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { AlertCheckboxRendererComponent } from './@components/alert-checkbox-renderer/alert-checkbox-renderer.component';
import { AlertStatusRendererComponent } from './@components/alert-status-renderer/alert-status-renderer.component';
import { AuthMatrixAccountsRendererComponent } from './@components/auth-matrix-accounts-renderer/auth-matrix-accounts-renderer.component';
import { AuthMatrixAdditionalInfoRendererComponent } from './@components/auth-matrix-additional-info-renderer/auth-matrix-additional-info-renderer.component';
import { PersonalizationTab } from './@models/personalization-tab.model';
import {
  AccountToggle,
  Alert,
  Personalization,
  WidgetMapping,
} from './@models/personalization.model';
import { UserPersonalizationService } from './@services/user-personalization.service';

@Component({
  selector: 'app-user-personalization',
  templateUrl: './user-personalization.component.html',
  styleUrls: ['./user-personalization.component.scss'],
})
export class UserPersonalizationComponent implements OnInit {
  @ViewChild('userDetails') userDetails: TemplateRef<any>;
  @ViewChild('addressDetails') addressDetails: TemplateRef<any>;
  @ViewChild('loginRestrictionDetails') loginRestrictionDetails: TemplateRef<any>;
  @ViewChild('securityCriteriaDetails') securityCriteriaDetails: TemplateRef<any>;
  @ViewChild('corporateMainDetails') corporateMainDetails: TemplateRef<any>;
  @ViewChild('officeDetails') officeDetails: TemplateRef<any>;
  @ViewChild('antiPhishingDetails') antiPhishingDetails: TemplateRef<any>;
  @ViewChild('securityQuestionsDetails') securityQuestionsDetails: TemplateRef<any>;
  @ViewChild('defaultLanguageDetails') defaultLanguageDetails: TemplateRef<any>;
  @ViewChild('loginPreferenceDetails') loginPreferenceDetails: TemplateRef<any>;
  @ViewChild('widgetMappingDetails') widgetMappingDetails: TemplateRef<any>;
  @ViewChild('themeSelectionDetails') themeSelectionDetails: TemplateRef<any>;
  @ViewChild('alertsAndNotificationsDetails') alertsAndNotificationsDetails: TemplateRef<any>;
  @ViewChild('makerCheckerLimitDetails') makerCheckerLimitDetails: TemplateRef<any>;
  @ViewChild('authMatrixInfoDetails') authMatrixInfoDetails: TemplateRef<any>;
  @ViewChild('accountWiseAccessInfoDetails') accountWiseAccessInfoDetails: TemplateRef<any>;

  loading: boolean = false;
  isGroupUser: boolean = false;

  personalizationData: Personalization;
  personalizationEditData: Personalization;

  viewport: string;
  isLoaded: boolean = true;
  tabDetails: PersonalizationTab[];
  selectedTab: PersonalizationTab;
  selectedTabIndex: number = 0;

  isShowPhishingImages: boolean;
  tempPhishingImage: string;
  languages: Select[];
  dashboardList: Select[];
  themeUrl: string;
  themes: Select[];

  selectedAlertFilters: string[] = ['Enabled', 'Suspended', 'Disabled'];

  @ViewChild('productAlerts') alertGrid: AgGridListingComponent;

  alertGridOptions: any = {
    rowModelType: 'clientSide',
    pagination: false,
    context: { componentParent: this },
  };

  alertFrameworkComponents: any = {
    alertCheckboxRenderer: AlertCheckboxRendererComponent,
    alertStatusRenderer: AlertStatusRendererComponent,
  };

  makerCheckerGridOptions: any = {
    rowModelType: 'clientSide',
    treeData: true,
    autoGroupColumnDef: {
      headerName: 'Product / Sub-Product',
      cellRendererParams: { suppressCount: true },
    },
    getDataPath: function (data) {
      return data.product;
    },
  };

  authMatrixGridOptions: any = {
    rowModelType: 'clientSide',
    pagination: true,
    context: { componentParent: this },
  };
  authMatrixFrameworkComponents: any = {
    authMatrixAccountsRenderer: AuthMatrixAccountsRendererComponent,
    authMatrixAdditionalInfoRenderer: AuthMatrixAdditionalInfoRendererComponent,
  };

  authMatrixAdditionalInfo: string;
  isShowAuthMatrixAdditionalInfo: boolean;
  authMatrixModalStyles: any;
  authMatrixAccounts: string[];
  isShowAuthMatrixAccounts: boolean;

  accountWiseAccessViewBy: string = 'Products';
  accountWiseAccessProductGridOptions: any = {
    rowModelType: 'clientSide',
    treeData: true,
    autoGroupColumnDef: {
      headerName: 'Sub-Product / Module',
      cellRendererParams: { suppressCount: true },
    },
    getDataPath: function (data: any) {
      return data.subProduct;
    },
  };
  accountWiseAccessAccountGridOptions: any = {
    rowModelType: 'clientSide',
    treeData: true,
    autoGroupColumnDef: {
      headerName: 'Product',
      cellRendererParams: { suppressCount: true },
    },
    getDataPath: function (data: any) {
      return data.product;
    },
  };

  accountToggleList: AccountToggle[];

  antiPhishingPath: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewportService: ViewportService,
    private userService: UserService,
    private languageService: LanguageService,
    private userPersonalizationService: UserPersonalizationService,
  ) {
    this.antiPhishingPath = this.httpService.getAssetUrl('assets/images/anti-phishing/');
  }

  ngOnInit(): void {
    this.loading = true;

    /* remove below : starts */
    const actions: Actions = {
      heading: 'Setting',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [{ icon: 'pi pi-home' }, { label: 'Setting' }];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });

    this.languageService.getLocalLanguages().subscribe((languages: any[]) => {
      this.languages = languages.map((language: any) => {
        return {
          id: language.id,
          displayName: language.displayName,
          enrichments: {
            ...language,
          },
        };
      });
    });

    this.dashboardList = this.userService.dashboardList;

    this.themeUrl = this.httpService.getAssetUrl('assets/themes/');
    this.themes = [];
    this.getThemeList();

    this.tabDetails = this.userPersonalizationService.tabDetails;

    this.selectedTabIndex = 0;
    this.selectedTab = this.tabDetails[0];

    this.accountToggleList = [];

    this.httpService
      .httpPost('setup/userPersonalization/private/getUserPersonalizationData')
      .subscribe((response: any) => {
        this.personalizationData = response.data;

        if (this.personalizationData?.userDetails?.securityQuestionAnswers?.length == 0) {
          this.tabDetails[2].subTabs[1].isEdit = true;
          this.tabDetails[2].subTabs[1].isExpand = true;

          this.personalizationData.userDetails.securityQuestionAnswers = [
            new SecurityQuestionAnswer('What is your pet’s name?', '', false),
            new SecurityQuestionAnswer('What is your first mobile number?', '', false),
            new SecurityQuestionAnswer('What is your date of birth?', '', false),
          ];
        }

        Object.keys(
          this.personalizationData.accountWiseAccessInfoDetails.accountWiseAccountAccessDetails,
        ).forEach((accountNumber: string) => {
          this.accountToggleList.push({ isExpand: false, no: accountNumber });
        });
        this.personalizationEditData = _.cloneDeep(this.personalizationData);

        this.loading = false;
      });
  }

  getThemeList(): void {
    const url = 'setup/cibSetup/uiConfiguration/themeConfiguration/private/getThemeList';
    this.httpService.httpPost(url).subscribe((response: any) => {
      this.themes = response.themes;
    });
  }

  getOverallProgress(): number {
    //calculate progress
    return 95;
  }

  updateProfilePic(files: any[]): void {
    if (files && files.length > 0) {
      //upload file to server and get Url
      //this.personalizationData.userDetail.profilePicUrl = "";
    }
  }

  onTabClick(i: number): void {
    if (this.tabDetails[i].isActive) {
      return;
    }

    this.tabDetails.forEach((tab: PersonalizationTab) => {
      tab.isActive = false;
    });

    this.tabDetails[i].subTabs[0].isExpand = true;

    this.selectedTab = this.tabDetails[i];

    this.selectedTabIndex = i;

    this.tabDetails[i].isActive = true;
  }

  onEditClick(event: any): void {
    event.stopPropagation();
    this.personalizationEditData = _.cloneDeep(this.personalizationData);
  }

  isExpanded(value: boolean, event: any): boolean {
    event.stopPropagation();
    return !value;
  }

  onSaveClick(event: any): void {
    event.stopPropagation();
    // this.personalizationEditData.alertsAndNotificationsDetails.forEach((product: any) => {
    //   product.alerts.forEach((alert: Alert) => {
    //     alert.channelType = alert.channelType.join(',');
    //   });
    // });

    this.personalizationData = _.cloneDeep(this.personalizationEditData);

    this.httpService
      .httpPost('commons/userPersonalization/private/updateUserDetails', {
        dataMap: { data: _.cloneDeep(this.personalizationData.userDetails) },
      })
      .subscribe((response: any) => {
        // this.personalizationData.userDetails = response.data;
      });
  }

  getTotalSelectedWidgets(): number {
    let widgets = 0;
    this.selectedTab.subTabs[2].isEdit
      ? this.personalizationEditData.widgetMappingDetails.forEach((product: any) => {
          widgets += product.widgets.filter((widget: any) => widget.isShow).length;
        })
      : this.personalizationData.widgetMappingDetails.forEach((product: any) => {
          widgets += product.widgets.filter((widget: any) => widget.isShow).length;
        });

    return widgets;
  }

  showHideWidgetDetails(name: string, event: any): void {
    event.stopPropagation();

    this.personalizationData.widgetMappingDetails.forEach((productWidget: WidgetMapping) => {
      if (productWidget.name == name) productWidget.isExpand = !productWidget.isExpand;
      else productWidget.isExpand = false;
    });
  }

  showHideAccountWiseAccessProductDetails(id: any, event: any): void {
    event.stopPropagation();

    this.personalizationData.accountWiseAccessInfoDetails.productWiseAccountAccessDetails.forEach(
      (product: any) => {
        if (product.id == id) product.isExpand = !product.isExpand;
        else product.isExpand = false;
      },
    );
  }

  showHideAuthMatrixDetails(productId: string, event: any): void {
    event.stopPropagation();

    this.personalizationData.authMatrixInfoDetails.forEach((data: any) => {
      if (data.productId == productId) data.isExpand = !data.isExpand;
      else data.isExpand = false;
    });
  }

  showHideAlertNotificationDetails(moduleId: string, event: any): void {
    event.stopPropagation();

    this.personalizationData.alertsAndNotificationsDetails.forEach((alert: any) => {
      if (alert.moduleId == moduleId) alert.isExpand = !alert.isExpand;
      else alert.isExpand = false;
    });
  }

  showHideAccountDetails(id: string, event: any): void {
    event.stopPropagation();

    this.personalizationData.accountWiseAccessInfoDetails.accountWiseAccountAccessDetails.forEach(
      (account: any) => {
        if (account.id == id) account.isExpand = !account.isExpand;
        else account.isExpand = false;
      },
    );
  }

  getTotalAlerts(): number {
    let alertsCount = 0;
    this.selectedTab.subTabs[0].isEdit
      ? this.personalizationEditData.alertsAndNotificationsDetails.forEach((product: any) => {
          alertsCount += product.alerts.length;
        })
      : this.personalizationData.alertsAndNotificationsDetails.forEach((product: any) => {
          alertsCount += product.alerts.length;
        });

    return alertsCount;
  }

  getAlertStatusCountByProduct(moduleId: string, status: string): number {
    const productAlerts = this.selectedTab.subTabs[0].isEdit
      ? this.personalizationEditData.alertsAndNotificationsDetails.find(
          (module: any) => module.moduleId == moduleId,
        ).alerts
      : this.personalizationData.alertsAndNotificationsDetails.find(
          (module: any) => module.moduleId == moduleId,
        ).alerts;

    const statusAlerts = _.filter(productAlerts, function (a: Alert) {
      return a.status == status;
    });

    return statusAlerts.length;
  }

  suspendAllAlertsByProduct(moduleId: string, isPreventRefresh?: boolean): void {
    if (!this.selectedTab.subTabs[0].isEdit) {
      return;
    }

    const productAlertsIndex = this.personalizationEditData.alertsAndNotificationsDetails.findIndex(
      (product: any) => product.moduleId == moduleId,
    );

    this.personalizationEditData.alertsAndNotificationsDetails[productAlertsIndex].alerts.forEach(
      (alert: Alert) => {
        alert.status = 'Suspended';
        alert.actions = [
          {
            index: 1,
            methodName: 'viewAlert',
            paramList: 'id',
            displayName: 'View',
            type: 'ICON',
            icon: 'pi pi-eye',
          },
          {
            index: 1,
            methodName: 'enableAlert',
            paramList: 'id',
            displayName: 'Enable',
            type: 'ICON',
            icon: 'pi pi-play',
          },
        ];
      },
    );

    if (!isPreventRefresh)
      this.alertGrid?.setRowData(
        this.personalizationEditData.alertsAndNotificationsDetails[productAlertsIndex].alerts,
      );
  }

  suspendAll(): void {
    if (!this.selectedTab.subTabs[0].isEdit) {
      return;
    }

    this.personalizationEditData.alertsAndNotificationsDetails.forEach((product: any) => {
      this.suspendAllAlertsByProduct(product.moduleId, !product.isExpand);
    });
  }

  getAlertSelectedProduct(): string {
    let product = this.personalizationEditData.alertsAndNotificationsDetails.find(
      (p: any) => p.isExpand,
    );

    return product?.moduleId;
  }

  updateAlert(id: string, channelType: string[]): void {
    if (!this.selectedTab.subTabs[0].isEdit) {
      return;
    }

    let moduleId = this.getAlertSelectedProduct();

    const alertNotificationModuleIndex =
      this.personalizationEditData.alertsAndNotificationsDetails.findIndex(
        (product: any) => product.moduleId == moduleId,
      );

    this.personalizationEditData.alertsAndNotificationsDetails[
      alertNotificationModuleIndex
    ].alerts.forEach((alert: Alert) => {
      if (alert.id == id) {
        alert.channelType = channelType;
      }
    });
  }

  viewAlert(id: string): void {
    if (!this.selectedTab.subTabs[0].isEdit) {
      return;
    }
  }

  enableAlert(id: string): void {
    if (!this.selectedTab.subTabs[0].isEdit) {
      return;
    }

    let moduleId = this.getAlertSelectedProduct();

    const alertNotificationModuleIndex =
      this.personalizationEditData.alertsAndNotificationsDetails.findIndex(
        (product: any) => product.moduleId == moduleId,
      );

    this.personalizationEditData.alertsAndNotificationsDetails[
      alertNotificationModuleIndex
    ].alerts.forEach((alert: Alert) => {
      if (alert.id == id) {
        alert.status = 'Enabled';
        alert.actions = [
          {
            index: 1,
            methodName: 'viewAlert',
            paramList: 'id',
            displayName: 'View',
            type: 'ICON',
            icon: 'pi pi-eye',
          },
          {
            index: 1,
            methodName: 'disableAlert',
            paramList: 'id',
            displayName: 'Disable',
            type: 'ICON',
            icon: 'pi pi-times-circle',
          },
          {
            index: 1,
            methodName: 'suspendAlert',
            paramList: 'id',
            displayName: 'Suspend',
            type: 'ICON',
            icon: 'pi pi-minus-circle',
          },
        ];
      }
    });

    this.alertGrid?.setRowData(
      this.personalizationEditData.alertsAndNotificationsDetails[alertNotificationModuleIndex]
        .alerts,
    );
  }

  disableAlert(id: string): void {
    if (!this.selectedTab.subTabs[0].isEdit) {
      return;
    }

    let moduleId = this.getAlertSelectedProduct();

    const alertNotificationModuleIndex =
      this.personalizationEditData.alertsAndNotificationsDetails.findIndex(
        (product: any) => product.moduleId == moduleId,
      );

    this.personalizationEditData.alertsAndNotificationsDetails[
      alertNotificationModuleIndex
    ].alerts.forEach((alert: Alert) => {
      if (alert.id == id) {
        alert.status = 'Disabled';
        alert.actions = [
          {
            index: 1,
            methodName: 'viewAlert',
            paramList: 'id',
            displayName: 'View',
            type: 'ICON',
            icon: 'pi pi-eye',
          },
          {
            index: 1,
            methodName: 'enableAlert',
            paramList: 'id',
            displayName: 'Enable',
            type: 'ICON',
            icon: 'pi pi-play',
          },
        ];
      }
    });

    this.alertGrid?.setRowData(
      this.personalizationEditData.alertsAndNotificationsDetails[alertNotificationModuleIndex]
        .alerts,
    );
  }

  suspendAlert(id: string): void {
    if (!this.selectedTab.subTabs[0].isEdit) {
      return;
    }

    let moduleId = this.getAlertSelectedProduct();

    const alertNotificationModuleIndex =
      this.personalizationEditData.alertsAndNotificationsDetails.findIndex(
        (product: any) => product.moduleId == moduleId,
      );

    this.personalizationEditData.alertsAndNotificationsDetails[
      alertNotificationModuleIndex
    ].alerts.forEach((alert: Alert) => {
      if (alert.id == id) {
        alert.status = 'Suspended';
        alert.actions = [
          {
            index: 1,
            methodName: 'viewAlert',
            paramList: 'id',
            displayName: 'View',
            type: 'ICON',
            icon: 'pi pi-eye',
          },
          {
            index: 1,
            methodName: 'enableAlert',
            paramList: 'id',
            displayName: 'Enable',
            type: 'ICON',
            icon: 'pi pi-play',
          },
        ];
      }
    });

    this.alertGrid?.setRowData(
      this.personalizationEditData.alertsAndNotificationsDetails[alertNotificationModuleIndex]
        .alerts,
    );
  }

  onChangeDefaultDashboard(dashboard: Select) {
    this.personalizationEditData.userDetails.loginPreferenceDetails[0].defaultDashboardName =
      dashboard.displayName;
    this.personalizationEditData.userDetails.loginPreferenceDetails[0].defaultDashboardUrl =
      dashboard.enrichments.routerUrl;
  }

  showAuthMatrixAdditionalInfo(top: number, left: number, info: string): void {
    this.authMatrixAdditionalInfo = info;
    this.authMatrixModalStyles = {
      position: 'absolute',
      top: top + 'px',
      left: left + 'px',
      width: 'auto',
      'z-index': '1',
      padding: '0.5rem',
    };
    this.isShowAuthMatrixAccounts = false;
    this.isShowAuthMatrixAdditionalInfo = true;
  }

  showAuthMatrixAccounts(top: number, left: number, transform: string, accounts: string[]): void {
    this.authMatrixAccounts = accounts;
    this.authMatrixModalStyles = {
      position: 'absolute',
      top: top + 'px',
      left: left + 'px',
      transform: transform,
      width: 'auto',
      'z-index': '1',
      padding: '0.5rem',
    };
    this.isShowAuthMatrixAdditionalInfo = false;
    this.isShowAuthMatrixAccounts = true;
  }
}
