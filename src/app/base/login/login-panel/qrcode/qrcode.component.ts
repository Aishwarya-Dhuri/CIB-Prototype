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
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss'],
})
export class QRCodeComponent implements OnInit {
  acceptTermsConditions = true;
  qrdata = 'Aurionpro Solutions LTD';
  lightColor: string;
  timer = 40;

  constructor(
    private router: Router,
    private userService: UserService,
    private httpService: HttpService,
    private toasterService: ToasterService,
    private appSettingService: AppSettingService,
  ) {}

  ngOnInit(): void {
    this.lightColor = getComputedStyle(document.body).getPropertyValue(
      '--primary-color-light-shade-1',
    );
    //this.lightColor = '#c4e7e7';
    this.setTimer();
  }

  setTimer() {
    this.timer = 40;
    const x = setInterval(() => {
      if (this.timer === -1) {
        this.timer = 40;
      }
      this.timer--;
    }, 1000);
  }

  getTime() {
    return this.timer.toString().padStart(2, '0');
  }

  termsCondition(e: any) {
    this.acceptTermsConditions = e.checked;
  }

  proceedLogin(): void {
    const requestData: BasicAuthentication_Request = {
      clientDetails: { source: 'WEB' },
      userName: 'smemaker',
      password: 'admin123',
      versionDetails: { version: 1 },
    };

    this.httpService.httpPost('login/public/basicAuthentication', requestData).subscribe(
      (basicAuthenticationResponse: BasicAuthentication_Response) => {
        if (basicAuthenticationResponse.responseStatus.status === '0') {
          this.appSettingService.getAppConfigurations(
            basicAuthenticationResponse.userDetails.appSettingId,
          );
          this.userService.userDetails = basicAuthenticationResponse.userDetails;
          sessionStorage.setItem('securityId', basicAuthenticationResponse.securityId);
          this.userService.applicationDate =
            basicAuthenticationResponse.userDetails.applicationDate;
          this.userService.userName = basicAuthenticationResponse.userDetails.userName;
          this.userService.corporateId = basicAuthenticationResponse.userDetails.corporateId;
          this.userService.setLastActivities(
            basicAuthenticationResponse.userDetails.displayWelcomeCardAtLogin,
          );
          const dummyLoginPreference: LoginDetails = new LoginDetails();
          this.httpService
            .httpPost('login/public/updateLoginDetails', dummyLoginPreference)
            .subscribe((response: any) => {
              this.userService.userDetails = response.userDetails;
              this.userService.applicationDate = response.userDetails.applicationDate;
              this.userService.userName = response.userDetails.userName;
              this.userService.corporateId = response.userDetails.corporateId;
              this.userService.loginPreferenceDetails = dummyLoginPreference;
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
      (error: any) => {},
    );
  }
}
