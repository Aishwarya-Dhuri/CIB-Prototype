import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { MenuService } from '../main/@services/menu.service';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.scss'],
})
export class UserActivationComponent implements OnInit {
  loading: boolean;

  otpValidated: boolean = false;
  invalidUser: boolean = false;
  showSubmittedPopup: boolean = false;

  digits: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  alphabets: string[] = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];

  specialCharacterLength: number = 0;
  digitLength: number = 0;
  alphabetLength: number = 0;
  lastChar: string = '';

  userList: any[] = [];

  securityQuestions: any[] = [
    { id: 'What is your pet’s name?', displayName: 'What is your pet’s name?' },
    { id: 'What is your first mobile number?', displayName: 'What is your first mobile number?' },
    { id: 'What is your date of birth?', displayName: 'What is your date of birth?' },
  ];

  antiPhishingPath: string;
  tempPhishingImage: string;
  isShowPhishingImages: boolean = false;

  passwordValidations: any = {
    minimumCharacter: false,
    maximumCharacter: false,
    minimumDigits: false,
    maximumDigits: false,
    minimumSpecialCharacters: false,
    maximumSpecialCharacters: false,
    minimumLength: false,
    maximumLength: false,
  };

  formData: any = {
    userId: '',
    temporaryPassword: '',
    securityQuestion1: '',
    securityAnswer1: '',
    securityQuestion2: '',
    securityAnswer2: '',
    securityQuestion3: '',
    securityAnswer3: '',
    phishingImage: 'phishing10.jpg',
    message: '',
    otp: '',
    newPassword: '',
    showNewPassword: false,
    confirmPassword: '',
    showConfirmPassword: false,
  };

  stepperDetails: Stepper = {
    masterName: 'User Activation',
    currentStep: 1,
    isSecondLastStepLabelAsReview: false,
    isSaveAsTemplateApplicable: false,
    isSaveDraftApplicable: false,
    isOnlyFooter: false,
    disableStepClick: true,
    headings: ['User Details', 'User Security Details', 'OTP Validation', 'Reset Password'],
  };

  constructor(
    private menuService: MenuService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.menuService.setSelectedServiceUrl('userActivation');

    this.antiPhishingPath = this.httpService.getAssetUrl('assets/images/anti-phishing/');

    this.httpService
      .httpPost('commons/userService/getCorporateUsers')
      .subscribe((response: any) => {
        this.userList = [];
        response.dataList.forEach((data: any) => {
          this.userList.push(data.displayName);
        });

        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
  }

  validateOTP() {
    setTimeout(() => {
      this.otpValidated = true;
    }, 1000);
  }

  resendOTP() {}

  validateUser() {
    this.invalidUser = !this.userList.includes(this.formData.userId);
  }

  public onNextClick(currentStep: number): void {
    const currentSubSteps = this.stepperDetails.steps[currentStep - 1].subSteps;
    if (
      currentSubSteps &&
      currentSubSteps.length > 0 &&
      this.stepperDetails.currentSubStep < currentSubSteps.length
    ) {
      this.stepperDetails.currentSubStep = this.stepperDetails.currentSubStep + 1;
    } else if (currentStep < this.stepperDetails.steps.length) {
      this.stepperDetails.steps[currentStep - 1].completed = true;
      this.stepperDetails.steps[currentStep - 1].active = false;
      this.stepperDetails.steps[currentStep - 1].visited = true;
      this.stepperDetails.currentStep = currentStep + 1;
      this.stepperDetails.steps[currentStep].active = true;
    } else {
      this.submitFormData();
    }

    if (this.onStepChange) this.onStepChange(currentStep + 1);
  }

  onStepChange(stepNo: number) {}

  submitFormData() {
    this.httpService
      .httpPost('commons/userService/updateUserDetails', this.formData)
      .subscribe((response: any) => {
        this.showSubmittedPopup = true;
      });
  }

  onLoginRedirect() {
    this.router.navigate(['/login'], { relativeTo: this.route });
  }

  onValidatePassword(password: any) {
    const char = password.data;

    if (char) {
      if (this.digits.includes(char)) {
        this.digitLength++;
      } else if (this.alphabets.includes(char.toLowerCase())) {
        this.alphabetLength++;
      } else {
        this.specialCharacterLength++;
      }
      this.lastChar = char.toLowerCase();
    } else {
      if (this.digits.includes(this.lastChar)) {
        this.digitLength--;
      } else if (this.alphabets.includes(this.lastChar.toLowerCase())) {
        this.alphabetLength--;
      } else {
        this.specialCharacterLength--;
      }
      if (this.formData.newPassword.length > 0) {
        this.lastChar = [...this.formData.newPassword][
          this.formData.newPassword.length - 1
        ].toLowerCase();
      } else {
        this.lastChar = '';
      }
    }

    this.passwordValidations.minimumCharacter = !(this.alphabetLength < 4);
    this.passwordValidations.maximumCharacter = !(this.alphabetLength > 8);
    this.passwordValidations.minimumDigits = !(this.digitLength < 2);
    this.passwordValidations.maximumDigits = !(this.digitLength > 5);
    this.passwordValidations.minimumSpecialCharacters = !(this.specialCharacterLength < 1);
    this.passwordValidations.maximumSpecialCharacters = !(this.specialCharacterLength > 2);
    this.passwordValidations.minimumLength = !(this.formData.newPassword.length < 8);
    this.passwordValidations.maximumLength = !(this.formData.newPassword.length > 12);
  }

  validateStep(stepNo: number) {
    if (stepNo == 1) {
      return this.formData.userId && !this.invalidUser && this.formData.temporaryPassword;
    } else if (stepNo == 2) {
      return (
        this.formData.securityQuestion1 &&
        this.formData.securityQuestion2 &&
        this.formData.securityQuestion3 &&
        this.formData.securityAnswer1 &&
        this.formData.securityAnswer2 &&
        this.formData.securityAnswer3 &&
        this.formData.phishingImage &&
        this.formData.message
      );
    } else if (stepNo == 3) {
      return this.formData.otp && this.otpValidated;
    } else if (stepNo == 4) {
      return (
        this.formData.newPassword &&
        this.formData.confirmPassword &&
        this.formData.newPassword == this.formData.confirmPassword
      );
    }
    return true;
  }
}
