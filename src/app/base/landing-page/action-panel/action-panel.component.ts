import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select } from 'src/app/shared/@models/select.model';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { LanguageService } from 'src/app/shared/@services/language.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { LoginDetails } from './@model/login-detail';

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.scss'],
})
export class ActionPanelComponent implements OnInit {
  iSubmitDisabled = false;
  formData: LoginDetails = new LoginDetails();

  languages: any[] = [];

  countryList: Select[] = [];
  groupList: Select[] = [];
  dashboardList: Select[] = this.userService.dashboardList;

  constructor(
    private router: Router,
    public userService: UserService,
    private httpService: HttpService,
    private languageService: LanguageService,
    private appSettingService: AppSettingService,
  ) {}

  ngOnInit(): void {
    this.languageService.getLocalLanguages().subscribe((languages: any[]) => {
      this.languages = languages;
    });

    this.formData.defaultDashboardId = '100';
    this.getCountries();

    if (this.userService.userDetails.isGroupUser == 'Y') {
      this.getGroups();
    }
  }

  getCountries() {
    this.httpService
      .httpPost('setup/generalMasters/geography/private/getUserCountriesList')
      .subscribe((response: any) => {
        this.countryList = response.dataList;
        this.userService.countries = this.countryList;
        this.formData.countryId = this.countryList[0].id;
      });
  }

  getGroups() {
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateGroup/private/getUserGroupList')
      .subscribe((response: any) => {
        this.groupList = response.dataList;
        this.userService.userGroups = this.groupList;
        this.formData.groupId = this.groupList[0].id;
      });
  }

  updateCountryDetails(): void {
    const country = this.countryList.find((c: any) => c.id === this.formData.countryId);
    this.formData.countryName = country.displayName;
    this.userService.country = country;
  }

  updateLoginType(): void {
    this.userService.loginPreferenceDetails.loginType = this.formData.loginType;
  }

  updateGroupDetails(): void {
    if (this.formData.loginType == 'individual') {
      this.formData.groupId = '';
      this.formData.groupName = '';
    } else {
      const group = this.groupList.find((g: any) => g.id === this.formData.groupId);
      this.formData.groupName = group.displayName;
      this.userService.group = group;
    }
  }

  updateDashboardDetails(): string {
    const dashboard = this.dashboardList.find(
      (d: any) => d.id === this.formData.defaultDashboardId,
    );
    const routeUrl = dashboard.enrichments.routerUrl;
    if (dashboard.id == '100') {
      this.formData.defaultDashboardId = '101';
      this.formData.defaultDashboardName = 'Consolidated Dashboard';
      this.formData.defaultDashboardUrl = '/dashboard/consolidated';
      this.userService.dashboardRouteUrl = '/dashboard/consolidated';
    } else {
      this.formData.defaultDashboardName = dashboard.displayName;
      this.formData.defaultDashboardUrl = dashboard.enrichments.routerUrl;
      this.userService.dashboardRouteUrl = dashboard.enrichments.routerUrl;
    }

    return routeUrl;
  }

  submitForm() {
    this.iSubmitDisabled = true;
    this.updateCountryDetails();
    this.updateLoginType();
    this.updateGroupDetails();

    const routeUrl = this.updateDashboardDetails();

    this.httpService
      .httpPost('login/public/updateLoginDetails', { ...this.formData })
      .subscribe((response: any) => {
        this.userService.userDetails = response.userDetails;
        this.userService.applicationDate = response.userDetails.applicateDate;
        this.userService.userName = response.userDetails.userName;
        this.userService.corporateId = response.userDetails.corporateId;
        this.userService.loginPreferenceDetails = this.formData;

        this.userService.groupId = response.userDetails.groupId;

        this.userService.corporateId = response.userDetails.corporateId;

        this.router.navigate([routeUrl]);
      });
  }

  onChangeBankType(bankType: any) {
    if (this.formData.bankType != bankType) {
      this.formData.bankType = bankType;

      if (bankType == 'Islamic') {
        const language = this.languages.find((lang: any) => lang.id == 'ar');
        if (language) {
          this.languageService.setLanguage(language);
        } else {
          this.appSettingService.setDirection('rtl');
        }
        this.appSettingService.setThemeId(1646939775489);
      } else {
        const language = this.languages.find((lang: any) => lang.id == 'en');
        if (language) {
          this.languageService.setLanguage(language);
        } else {
          this.appSettingService.setDirection('ltr');
        }
        this.appSettingService.getAppConfigurations(1);
      }
    }
  }
}
