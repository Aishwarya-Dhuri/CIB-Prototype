import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BasicAuthentication_Request,
  BasicAuthentication_Response,
} from 'src/app/base/@models/basic-authentication';
import { PhishingDetails_Response } from 'src/app/base/@models/phishing-details';
import { AESEncriptionService } from 'src/app/shared/@services/aesencryption-service.service';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-login-id',
  templateUrl: './login-id.component.html',
  styleUrls: ['./login-id.component.scss'],
})
export class LoginIdComponent implements OnInit {
  loginForm = new FormGroup({
    corporateCode: new FormControl(null, { validators: [] }),
    userName: new FormControl(null, { validators: [Validators.required] }),
    password: new FormControl(null, { validators: [Validators.required] }),
    acceptTermsConditions: new FormControl(false),
  });
  basicAuthenticationResponse: any;
  authentication = false;
  showImage = false;
  invalidUser = false;
  accessImage: string;
  phishingMessage: string;
  validateAccessImage = false;
  captcha = false;
  verifiedCaptcha = false;
  viewPassword = false;
  submit = false;

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private aesEncryptionService: AESEncriptionService, // private messageService: MessageService
    private appSettingService: AppSettingService,
  ) {}

  ngOnInit(): void {
    this.loginForm.controls.password.disable();
  }

  accessImageInvalidated() {
    this.loginForm.controls.password.disable();
    this.validateAccessImage = false;
  }

  accessImageValidated() {
    this.loginForm.controls.password.enable();
    this.validateAccessImage = true;
    this.showImage = false;
  }

  getPhishingImage() {
    if (this.loginForm.get('userName').valid && !this.validateAccessImage) {
      const loginId = this.loginForm.get('userName').value;

      this.showImage = false;

      /* if (loginId === 'tovmaker' || loginId === 'tovchecker') {
        this.invalidUser = false;
      } else {
        this.invalidUser = true;
        return;
      } */

      // this.showImage = true;

      let requestData = { dataMap: { userName: loginId, corporateCode: '' } };
      if (this.loginForm.get('corporateCode').valid) {
        requestData.dataMap.corporateCode = this.loginForm.get('corporateCode').value;
      }

      this.httpService.httpPost('login/public/getPhishingDetails', requestData).subscribe(
        (phishingResponse: PhishingDetails_Response) => {
          if (phishingResponse.responseStatus.status === '1') {
            this.invalidUser = true;
            this.showError(phishingResponse.responseStatus.message);
          } else if (phishingResponse.responseStatus.status === '0') {
            this.appSettingService.getAppConfigurations(phishingResponse.dataMap.appSettingId);
            this.accessImage = this.httpService.getAssetUrl(
              'assets/images/anti-phishing/' + phishingResponse.dataMap.phishingImageFileName,
            );
            this.phishingMessage = phishingResponse.dataMap.message;
            this.showImage = true;
          }
        },
        (error: any) => {},
      );
    }
  }

  basicAuthentication() {
    if (this.loginForm.valid) {
      // if (this.loginForm.value.password === '123') {
      // this.authentication = true;
      // } else {
      //   this.captcha = true;
      // }

      this.submit = true;

      const requestData: BasicAuthentication_Request = {
        clientDetails: { source: 'WEB' },
        userName: this.loginForm.value.userName,
        // corporateCode: this.loginForm.value.corporateCode,
        //password: this.aesEncryptionService.doEncryption(this.loginForm.value.password),
        password: this.loginForm.value.password,
        versionDetails: { version: 1 },
      };

      this.userService.userName = this.loginForm.value.userName;

      this.httpService.httpPost('login/public/basicAuthentication', requestData).subscribe(
        (basicAuthenticationResponse: BasicAuthentication_Response) => {
          if (basicAuthenticationResponse.responseStatus.status === '0') {
            this.appSettingService.getAppConfigurations(
              basicAuthenticationResponse.userDetails.appSettingId,
            );
            this.basicAuthenticationResponse = basicAuthenticationResponse;
            // this.loginService.securityId = basicAuthenticationResponse.securityId;
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
            /* if (this.userService.userDetails.corporateType === 'S') {
              this.appSettingService.setThemeId('1');
            } else {
              this.appSettingService.setThemeId('1');
            } */
            //console.log(JSON.stringify(this.userService.userDetails));
            this.authentication = true;
          } else if (basicAuthenticationResponse.responseStatus.status === '1') {
            this.showError(basicAuthenticationResponse.responseStatus.message);
            this.submit = false;
          }
        },
        (error: any) => {},
      );
    }
  }

  isDisabled() {
    return (
      this.loginForm.invalid ||
      !this.validateAccessImage ||
      !this.loginForm.value.acceptTermsConditions ||
      this.submit
    );
  }

  private showError(errorMessege: any) {
    // this.messageService.add({
    //   severity: 'error',
    //   summary: 'Error',
    //   detail: 'Error : ' + errorMessege,
    // });
  }
}
