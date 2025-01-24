import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectableService } from 'ag-grid-community';
import { HttpService } from 'src/app/shared/@services/http.service';
import { SelfOnboardingService } from '../@services/self-onboarding.service';

@Component({
  selector: 'app-save-self-onboarding',
  templateUrl: './save-self-onboarding.component.html',
  styleUrls: ['./save-self-onboarding.component.scss'],
})
export class SaveSelfOnboardingComponent implements OnInit, OnDestroy {
  step: number = 0;
  lastStep: number = 0;

  demoVideo: boolean = false;
  showSuccess: boolean = false;
  reviewSubmit: boolean = false;
  howToUseThis: boolean = false;
  shoeSaveAsDraft: boolean = false;

  @ViewChild('companyInformation') companyInformation: any;
  @ViewChild('userDetails') userDetails: any;
  @ViewChild('productDetails') productDetails: any;

  applicationNumber: string = '1232020191920';

  stepImages = [
    './../../../../assets/images/company-information.png',
    './../../../../assets/images/user-details.png',
    './../../../../assets/images/product-details.png',
    './../../../../assets/images/document-upload.png',
  ];

  steps = [
    {
      step: 0,
      label: '1',
      completed: 25,
      disabled: false,
      heading: 'Company Information',
      subHeading: 'Enter the corporate details as registered with the bank',
    },
    {
      step: 1,
      label: '2',
      completed: 0,
      disabled: true,
      heading: 'User Details',
      subHeading: 'Enter the details of other users from your organisation',
    },
    {
      step: 2,
      label: '3',
      completed: 0,
      disabled: true,
      heading: 'Product Details',
      subHeading: 'Kindly select the product and services you would like to avail',
    },
    {
      step: 3,
      label: '4',
      completed: 0,
      disabled: true,
      heading: 'Document Upload',
      subHeading: 'Kindly attach supporting documents related to the holding company as required',
    },
  ];

  constructor(
    public selfOnboardingService: SelfOnboardingService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    if (this.selfOnboardingService.registrationType === 'existing') {
      this.steps.splice(3, 1);
    }
  }

  isMobile() {
    return window.innerWidth <= 991;
  }

  saveAsDraft() {
    if (
      this.selfOnboardingService.registrationType === 'new' ||
      this.selfOnboardingService.registrationType === 'existing'
    ) {
      this.httpService
        .httpPost('self-onboarding/draft/private/create', this.selfOnboardingService.selfOnboarding)
        .subscribe((resData: any) => {
          this.applicationNumber = resData.dataMap.id;
          this.showSuccess = true;
        });
    } else if (this.selfOnboardingService.registrationType === 'draft') {
      this.httpService
        .httpPost('self-onboarding/draft/private/update', this.selfOnboardingService.selfOnboarding)
        .subscribe((resData: any) => {
          this.applicationNumber = resData.dataMap.id;
          this.showSuccess = true;
        });
    }
  }

  next() {
    if (this.reviewSubmit) {
      if (this.selfOnboardingService.registrationType === 'existing') {
        this.httpService
          .httpPost('self-onboarding/private/update', this.selfOnboardingService.selfOnboarding)
          .subscribe((resData: any) => {
            this.applicationNumber = resData.dataMap.id;
            this.showSuccess = true;
          });
      } else {
        this.httpService
          .httpPost('self-onboarding/private/create', this.selfOnboardingService.selfOnboarding)
          .subscribe((resData: any) => {
            this.applicationNumber = resData.dataMap.id;
            this.showSuccess = true;
          });
      }
    } else if (
      (this.selfOnboardingService.registrationType === 'draft' && this.step === 3) ||
      (this.selfOnboardingService.registrationType === 'new' && this.step === 3) ||
      (this.selfOnboardingService.registrationType === 'existing' && this.step === 2)
    ) {
      if (this.step === 2) {
        if (!this.productDetails.reviewSelectedProduct) {
          this.productDetails.next();
          return;
        } else if (!this.productDetails.isValidate()) {
          return;
        }
      }

      this.steps[this.step].completed = 100;
      this.reviewSubmit = true;
    } else {
      if (this.step === 0) {
        if (!this.companyInformation.isValidate()) {
          return;
        }
      } else if (this.step === 1) {
        if (!this.userDetails.isValidate()) {
          return;
        }
      } else if (this.step === 2) {
        if (!this.productDetails.reviewSelectedProduct) {
          this.productDetails.next();
          return;
        }
        if (!this.productDetails.isValidate()) {
          return;
        }
      }

      this.steps[this.step].completed = 100;
      this.lastStep = this.step;
      this.step = this.step + 1;
    }
  }

  previous() {
    if (this.reviewSubmit) {
      this.reviewSubmit = false;
    } else if (this.step === 2 && this.productDetails.reviewSelectedProduct) {
      this.productDetails.previous();
    } else {
      this.lastStep = this.step;
      this.step = this.step - 1;
    }
  }

  ngOnDestroy() {
    this.selfOnboardingService.resetSelfOnboarding();
  }
}
