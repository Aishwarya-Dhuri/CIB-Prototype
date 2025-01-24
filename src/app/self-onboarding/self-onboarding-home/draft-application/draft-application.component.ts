import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';
import { SelfOnboardingService } from '../../@services/self-onboarding.service';

@Component({
  selector: 'app-draft-application',
  templateUrl: './draft-application.component.html',
  styleUrls: ['./draft-application.component.scss'],
})
export class DraftApplicationComponent implements OnInit {
  appNo: boolean = false;
  sendOtp: boolean = false;
  verify: boolean = false;

  applicationNumber: string = '';
  mobileNumber: string = '';
  verifyCode: string = '';

  constructor(
    private selfOnboardingService: SelfOnboardingService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  onVerify() {
    this.httpService
      .httpPost('self-onboarding/draft/private/view', { dataMap: { id: this.applicationNumber } })
      .subscribe((resData: any) => {
        this.verify = true;
        this.selfOnboardingService.registrationType = 'draft';
        this.selfOnboardingService.selfOnboarding = resData;
        this.router.navigate(['./draft'], { relativeTo: this.route });
      });
  }

  cancel() {
    this.appNo = false;
    this.sendOtp = false;
    this.verify = false;

    this.applicationNumber = '';
    this.mobileNumber = '';
    this.verifyCode = '';
  }
}
