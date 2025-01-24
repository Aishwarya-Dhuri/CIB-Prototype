import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OTP_Response, ValidateOTP_Request } from 'src/app/base/@models/otp';
import { LoginDetails } from 'src/app/base/landing-page/action-panel/@model/login-detail';
import { AESEncriptionService } from 'src/app/shared/@services/aesencryption-service.service';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
  userDetails: any = {};
  verificationCode: any;
  viewVerificationCode = false;
  verificationMode: string;
  submit = false;
  timer = 60;
  invalidOTP: boolean;
  basicAuthenticationResponse: any;

  constructor(
    private router: Router,
    private aesEncryptionService: AESEncriptionService,
    private httpService: HttpService,
    private userService: UserService,
    private toasterService: ToasterService,
    private appSettingService: AppSettingService,
  ) {}

  ngOnInit(): void {
    this.setTimer();
    this.userDetails = this.userService.userDetails;
    if (this.userDetails.corporateType == 'S') this.verificationMode = 'mobile';
  }

  setTimer() {
    this.timer = 60;
    const x = setInterval(() => {
      if (this.timer === 0) {
        this.timer = 60;
      }
      this.timer--;
    }, 1000);
  }

  getTime() {
    return this.timer.toString().padStart(2, '0');
  }

  generateOTP() {
    this.invalidOTP = false;
    this.httpService.httpPost('login/public/generateOTP').subscribe(
      (otpResponse: OTP_Response) => {},
      (error: any) => {},
    );
  }

  validateOTP() {
    if (this.verificationCode) {
      this.submit = true;

      const requestData: ValidateOTP_Request = {
        authType: this.basicAuthenticationResponse
          ? this.basicAuthenticationResponse.userDetails.authType[0]
          : '',
        //password: this.aesEncryptionService.doEncryption(this.verificationCode),
        password: this.verificationCode,
      };

      this.httpService.httpPost('login/public/validateOTP', requestData).subscribe(
        (validateOtpResponse: OTP_Response) => {
          if (validateOtpResponse.responseStatus.status === '0') {
            this.invalidOTP = false;
            if (this.userService.userDetails.corporateType == 'S') {
              const dummyLoginPreference: LoginDetails = new LoginDetails();
              this.httpService
                .httpPost('login/public/updateLoginDetails', dummyLoginPreference)
                .subscribe((response: any) => {
                  this.userService.userDetails = response.userDetails;
                  this.userService.applicationDate = response.userDetails.applicationDate;
                  this.userService.userName = response.userDetails.userName;
                  this.userService.corporateId = response.userDetails.corporateId;
                  this.userService.loginPreferenceDetails = dummyLoginPreference;

                  this.router.navigate(['/dashboard/consolidated']);

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
            } else if (this.userService.loginPreferenceDetails?.isLoginPreference) {
              this.router.navigate([this.userService.loginPreferenceDetails.defaultDashboardUrl]);
            } else {
              this.router.navigate(['/landingPage']);
            }
          } else if (validateOtpResponse.responseStatus.status === '1') {
            this.showError(validateOtpResponse.responseStatus.message);
            this.invalidOTP = true;
            this.submit = false;
          }
        },
        (error: any) => {
          this.submit = false;
        },
      );
    }
  }

  private showError(errorMessege: any) {
    // this.messageService.add({
    //   severity: 'error',
    //   summary: 'Error',
    //   detail: 'Error : ' + errorMessege,
    // });
  }

  getMaskedNumber(): string {
    if (this.userDetails.mobileNumber && this.userDetails.mobileNumber.toString().length > 4) {
      let mobileNo = '';
      for (let i = 0; i < this.userDetails.mobileNumber.toString().length - 4; i++) {
        mobileNo = mobileNo + 'X';
      }
      mobileNo =
        mobileNo +
        this.userDetails.mobileNumber
          .toString()
          .substring(this.userDetails.mobileNumber.toString().length - 4);
      return mobileNo;
    } else {
      return this.userDetails.mobileNumber;
    }
  }
}
