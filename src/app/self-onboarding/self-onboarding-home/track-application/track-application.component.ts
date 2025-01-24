import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { SelfOnboarding } from '../../@models/self-onboarding.model';

@Component({
  selector: 'app-track-application',
  templateUrl: './track-application.component.html',
  styleUrls: ['./track-application.component.scss'],
})
export class TrackApplicationComponent implements OnInit {
  appNo: boolean = false;
  sendOtp: boolean = false;
  verify: boolean = false;

  selfOnboarding: SelfOnboarding;

  applicationNumber: string = '';
  mobileNumber: string = '';
  verifyCode: string = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {}

  cancel() {
    this.appNo = false;
    this.sendOtp = false;
    this.verify = false;

    this.applicationNumber = '';
    this.mobileNumber = '';
    this.verifyCode = '';
    this.selfOnboarding = null;
  }

  onVerify() {
    this.httpService
      .httpPost('self-onboarding/private/view', { dataMap: { id: this.applicationNumber } })
      .subscribe((resData: any) => {
        this.selfOnboarding = resData;
        this.verify = true;
      });
  }
}
