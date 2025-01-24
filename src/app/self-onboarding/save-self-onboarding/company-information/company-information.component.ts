import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { CompanyInformation } from '../../@models/self-onboarding.model';
import { SelfOnboardingService } from '../../@services/self-onboarding.service';

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.scss'],
})
export class CompanyInformationComponent implements OnInit, OnDestroy {
  companyInfo: CompanyInformation[];

  @ViewChild('form') form: any;

  constructor(
    public selfOnboardingService: SelfOnboardingService,
    private httpService: HttpService,
  ) {}

  //1637763752574

  ngOnInit(): void {
    this.companyInfo = this.selfOnboardingService.selfOnboarding.companyInformation;
  }

  getApplicationInfo() {
    this.httpService
      .httpPost('self-onboarding/private/view', {
        dataMap: {
          filters: [
            {
              name: 'customerId',
              value: this.companyInfo[0].customerId
                ? this.companyInfo[0].customerId
                : this.companyInfo[0].accountNumber,
            },
          ],
        },
      })
      .subscribe((resData: any) => {
        this.selfOnboardingService.selfOnboarding = resData;
        // this.companyInfo = resData.companyInformation;
        this.selfOnboardingService.selfOnboarding.companyInformation[0].otpVerified = true;
      });
  }

  isValidate() {
    return this.selfOnboardingService.selfOnboarding.companyInformation[0].otpVerified;
  }

  ngOnDestroy() {
    if (this.selfOnboardingService.registrationType === 'new') {
      const cid = new Date().getTime().toString();
      this.companyInfo[0].customerId = cid.substring(7, 13);
    } else if (this.selfOnboardingService.registrationType === 'existing') {
      this.companyInfo[0].requestType = 'Existing';
    }
    this.selfOnboardingService.selfOnboarding.companyInformation = this.companyInfo;
  }
}
