import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  private securityId: string = '';
  @Input('accessType') accessType?= 'forgotPassword';
  @Output() changePassword = new EventEmitter<void>();

  viewPassword: boolean = false;
  viewNewPassword: boolean = false;
  viewConfirmPassword: boolean = false;
  submit: boolean = false;

  stepNo: number = 1;

  formData: any = {
    userName: '',
    mobileNumber: '',
    question1: '',
    question2: '',
    softToken: '',
    newPassword: '',
    confirmPassword: '',
  };

  questionsData: any[] = [];

  passwordPolicies: string[] = [];

  questionsList = [
    { id: '1', displayName: 'What is your Favourite Colour?' },
    { id: '2', displayName: 'What is your Favourite Animal?' },
  ];

  headerText: string = 'Forgot Password';

  constructor(
    private httpService: HttpService,
    private toasterService: ToasterService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.accessType != 'forgotPassword') {
      this.getSecurityQuestions();
    }
    this.getPasswordPolicy();
  }

  getPasswordPolicy() {
    this.passwordPolicies = [
      'Password should contain a minimum of 4 and maximum of 8 alphabets',
      'Password should contain a minimum of 3 and maximum of 5 numbers',
      'Password should contain a minimum of 2 special characters if maximum length of password is equal to 8',
      'Minimum length of password should be equal to 8 and maximum should be equal to 12',
      'Password should not be equal to User ID',
      'New password should not match with last 8 password of same user',
    ];
  }

  generateOtp() {
    this.toasterService.showToaster({ severity: 'success', detail: 'OTP Sent successfully' });
  }

  verifyUserName() {
    if (this.formData.userName === "rakesh.kumar") {
      this.formData.mobileNumber = "97XXXX3424";
    }
  }

  validateOTP() {
    this.submit = true;

    /* this.httpService
       .httpPost(
         'commons/dummyResponse',
         {
           dataMap: { userName: this.formData.userName, mobileNumber: this.formData.mobileNumber },
         },
         { Headers: { securityId: this.securityId } },
       )
       .subscribe((response: any) => {*/
    this.securityId = '1234567890'; // response.securityId;

    this.getSecurityQuestions();
    /*});*/
  }

  validateSecurityQuestions() {
    this.submit = true;

    /* this.httpService
       .httpPost(
         'commons/dummyResponse',
         {
           dataMap: [...this.questionsData].map((question: any) => {
             return {
               questionId: question.id,
               answer: question.answer,
             };
           }),
         },
         { Headers: { securityId: this.securityId } },
       )
       .subscribe((response: any) => {*/
    if (this.accessType != 'forgotPassword') {
      this.headerText = 'Set Security Question';
      this.stepNo = 3;
      this.submit = false;
    } else {
      this.headerText = 'Change Password';
      this.stepNo = 4;
      this.submit = false;
    }
    /*});*/
  }

  setSecurityQuestions() {
    this.submit = true;
    setTimeout(() => {
      this.headerText = 'Change Password';
      this.stepNo = 4;
      this.submit = false;
    }, 100);
  }

  getSecurityQuestions() {
    /* this.httpService
       .httpPost(
         'commons/dummyResponse',
         {
           dataMap: {},
         },
         { Headers: { securityId: this.securityId } },
       )
       .subscribe((response: any) => {*/
    this.questionsData = [
      {
        id: '1',
        question: 'What is your Pet Name?',
        answer: '',
      },
      {
        id: '2',
        question: 'What is your Passport Number?',
        answer: '',
      },
    ];

    this.headerText = 'Security Question';

    this.stepNo = 2;
    this.submit = false;
    /* });*/
  }

  resetPassword() {
    this.submit = true;

    if (this.accessType != 'forgotPassword') {
      this.changePassword.emit();
    } else {
      /* this.httpService
         .httpPost(
           'commons/dummyResponse',
           {
             dataMap: {
               newPassword: this.formData.newPassword,
               confirmPassword: this.formData.confirmPassword,
             },
           },
           { Headers: { securityId: this.securityId } },
         )
         .subscribe((response: any) => {*/
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Password Reset Successfully',
      });
      this.onCancel();
      /* });*/
    }
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
