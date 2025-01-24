import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BasicAuthentication_Request,
  BasicAuthentication_Response,
} from 'src/app/base/@models/basic-authentication';
import { LoginDetails } from 'src/app/base/landing-page/action-panel/@model/login-detail';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-biomatric',
  templateUrl: './biomatric.component.html',
  styleUrls: ['./biomatric.component.scss'],
})
export class BiomatricComponent implements OnInit {
  acceptTermsConditions = true;
  isGray: boolean = true;
  isMouseHover: boolean;
  basicAuthenticationResponse: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private httpService: HttpService,
    private toasterService: ToasterService,
    private appSettingService: AppSettingService,
  ) { }

  ngOnInit(): void { }

  termsCondition(e: any) {
    this.acceptTermsConditions = e.checked;
  }

  onLogin(id: number): void {
    setTimeout(() => {
      this.isGray = false;
      setTimeout(() => {
        this.proceedLogin(id);
      }, 500);
    }, 500);
  }

  proceedLogin(id: number): void {
    const requestData: BasicAuthentication_Request = {
      clientDetails: { source: 'WEB' },
      userName: id == 1 ? 'ssmaker' : 'sschecker',
      password: 'Admin#123',
      versionDetails: { version: 1 },
    };

    this.httpService.httpPost('login/public/basicAuthentication', requestData).subscribe(
      (basicAuthenticationResponse: BasicAuthentication_Response) => {
        if (basicAuthenticationResponse.responseStatus.status === '0') {
          this.appSettingService.getAppConfigurations(
            basicAuthenticationResponse.userDetails.appSettingId,
          );
          this.basicAuthenticationResponse = basicAuthenticationResponse;
          sessionStorage.setItem('securityId', basicAuthenticationResponse.securityId);
          this.userService.userDetails = basicAuthenticationResponse.userDetails;
          this.userService.applicationDate =
            basicAuthenticationResponse.userDetails.applicationDate;
          this.userService.userName = basicAuthenticationResponse.userDetails.userName;
          this.userService.corporateId = basicAuthenticationResponse.userDetails.corporateId;
          this.userService.setLastActivities(
            basicAuthenticationResponse.userDetails.displayWelcomeCardAtLogin,
          );
          if (
            basicAuthenticationResponse.loginPreferenceDetails &&
            basicAuthenticationResponse.loginPreferenceDetails.isLoginPreference
          ) {
            this.userService.loginPreferenceDetails =
              basicAuthenticationResponse.loginPreferenceDetails;
          }
          const dummyLoginPreference: LoginDetails = new LoginDetails();
          this.httpService
            .httpPost('login/public/updateLoginDetails', dummyLoginPreference)
            .subscribe((response: any) => {
              this.userService.userDetails = response.userDetails;
              this.userService.applicationDate = response.userDetails.applicationDate;
              this.userService.userName = response.userDetails.userName;
              this.userService.corporateId = response.userDetails.corporateId;
              this.userService.loginPreferenceDetails = dummyLoginPreference;

              this.userService.corporateId = response.userDetails.corporateId;
              this.userService.loginPreferenceDetails.loginType = 'individual';
              this.userService.dashboardRouteUrl = dummyLoginPreference.defaultDashboardUrl;

              this.router.navigate([dummyLoginPreference.defaultDashboardUrl]);

              setTimeout(() => {
                this.appSettingService.setToasterPosition('top-right');
                let msg =
                  'Corporate Login: ' + this.userService.userDetails.lastCorporateLoginDateTime;
                msg += '\nCorporate Name: ' + this.userService.userDetails.corporateName;
                msg += '\nLast Logged In - ' + this.userService.userDetails.lastLoginDateTime;
                this.toasterService.showToaster({ severity: 'success', detail: msg });
                setTimeout(() => {
                  this.appSettingService.setToasterPosition('top-center');
                }, 8000);
              }, 1000);
            });
          /* if (this.userService.userDetails.corporateType === 'S') {
            this.appSettingService.setThemeId('1');
          } else {
            this.appSettingService.setThemeId('1');
          } */
        } else if (basicAuthenticationResponse.responseStatus.status === '1') {
        }
      },
      (error: any) => { },
    );
  }

  highlightImage() {
    /* if(this.isMouseHover) {
      this.isGray = true;
      setTimeout(() => {
        this.isGray = false;
      }, 500);
    } else {
      this.isGray = true;
    } */
  }
}
