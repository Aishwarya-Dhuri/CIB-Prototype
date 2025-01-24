import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicAuthentication_Request, BasicAuthentication_Response } from 'src/app/base/@models/basic-authentication';
import { AESEncriptionService } from 'src/app/shared/@services/aesencryption-service.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { LoginDetails } from 'src/app/base/landing-page/action-panel/@model/login-detail';
import { ToasterService } from 'src/app/shared/@services/toaster.service';


@Component({
  selector: 'app-mpin',
  templateUrl: './mpin.component.html',
  styleUrls: ['./mpin.component.scss'],
})
export class MPINComponent implements OnInit {
  acceptTermsConditions = false;
  basicAuthenticationResponse: any;

  mpinForm: FormGroup = new FormGroup({
    userName: new FormControl(null, { validators: [Validators.required] }),
    mpin: new FormControl(null, { validators: [Validators.required] }),
    acceptTermsConditions: new FormControl(true),
  });

  viewPassword: boolean = false;

  constructor(private aesEncryptionService: AESEncriptionService, private router: Router,
    private route: ActivatedRoute, private userService: UserService,
    private appSettingService: AppSettingService, private httpService: HttpService,
    private toasterService: ToasterService,

  ) { }

  ngOnInit(): void {}

  termsCondition(e: any) {
    this.acceptTermsConditions = e.checked;
  }
  // proceed() {
  //   // this.router.navigate(['/dashboard', 'consolidated'], { relativeTo: this.route });
  //   // this.router.navigateByUrl(this.userService.dashboardRouteUrl);

  // }

  proceedLogin(id: number): void {
    const requestData: BasicAuthentication_Request = {
      clientDetails: { source: 'WEB' },
      userName: id == 1 ? 'rakesh.kumar' : 'suresh.kumar',
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
}
