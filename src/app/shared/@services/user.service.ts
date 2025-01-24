import { Injectable } from '@angular/core';
import { LoginDetails } from 'src/app/base/landing-page/action-panel/@model/login-detail';
import { Select } from '../@models/select.model';
import { HttpService } from './http.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userName: string;
  corporateId: string;
  groupId: string;
  applicationDate: string;
  userDetails: any = { accountDetails: {} };
  dashboardRouteUrl: string = '/dashboard/consolidated';
  loginPreferenceDetails: LoginDetails = new LoginDetails();

  private lastActivities = new BehaviorSubject<boolean>(false);
  private dashboardType = new BehaviorSubject<string>('consolidated');

  private switchLoginType: BehaviorSubject<string> = new BehaviorSubject<string>('');

  setLoginType(loginType: string) {
    this.switchLoginType.next(loginType);
  }

  getLoginType() {
    return this.switchLoginType;
  }

  dashboardList: Select[] = [
    {
      displayName: 'Consolidated Dashboard',
      id: '100',
      enrichments: { routerUrl: '/setting/userPersonalization' },
    },
    {
      displayName: 'User Personalization',
      id: '101',
      enrichments: { routerUrl: '/dashboard/consolidated' },
    },
    {
      displayName: 'Payment Dashboard',
      id: '2',
      enrichments: { routerUrl: '/dashboard/payments' },
    },
    { displayName: 'Setup Dashboard', id: '1', enrichments: { routerUrl: '/dashboard/commons' } },
    // { displayName: 'FSCM Dashboard', id: '6', enrichments: { routerUrl: '/dashboard/fscm' } },
    // { displayName: 'VAM Dashboard', id: '10', enrichments: { routerUrl: '/dashboard/vam' } },
    // { displayName: 'Trade Dashboard', id: '11', enrichments: { routerUrl: '/dashboard/trade' } },
    // { displayName: 'RMS Dashboard', id: '12', enrichments: { routerUrl: '/dashboard/rms' } },
  ];

  ipMappingColDefs = [
    {
      headerName: 'Sr. No',
      field: 'srNo',
    },
    {
      headerName: 'Start Range',
      field: 'startRange',
    },
    {
      headerName: 'End Range',
      field: 'endRange',
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: 'actionCellRenderer',
    },
  ];

  userGroups: any[] = [
    { id: 1, displayName: 'Toyota Group', enrichments: {} },
    { id: 4, displayName: 'Toyota Mobility', enrichments: {} },
  ];

  group: any;

  countries: any[] = [
   
	{
      id: 1,
      displayName: 'USD',
      enrichments: {
        id: 2,
        country: 'USD',
        currency: 'USD',
        flag: 'us-flag.png',
        fxRate: 0.012,
        corporates: [],
        top: 0.4,
        left: 0.69,
      },
    }, 
    {
      id: 2,
      displayName: 'India',
      enrichments: {
        id: 1,
        country: 'India',
        currency: 'INR',
        fxRate: 0.5,
        flag: 'in-flag.png',
        corporates: [],
        top: 0.4,
        left: 0.69,
      },
    },
        {
      id: 3,
      displayName: 'Singapore',
      enrichments: {
        id: 3,
        country: 'Singapore',
        currency: 'SGD',
        fxRate: 1.3,
        flag: 'sgd-flag.png',
        corporates: [],
        top: 0.37,
        left: 0.635,
      },
    },
    {
      id: 4,
      displayName: 'Malaysia',
      enrichments: {
        id: 4,
        country: 'Malaysia',
        currency: 'MYR',
        fxRate: 1.2,
        flag: 'malaysia-flag.png',
        corporates: [],
        top: 0.3,
        left: 0.7,
      },
    },
  ];

  islamicCountries: any[] = [
    {
      id: 1,
      displayName: 'UAE',
      enrichments: {
        id: 1,
        country: 'UAE',
        currency: 'AED',
        fxRate: 1,
        flag: 'uae-flag.png',
        corporates: [],
        top: 0.4,
        left: 0.69,
      },
    },
    {
      id: 2,
      displayName: 'Saudi Arabia',
      enrichments: {
        id: 2,
        country: 'Saudi Arabia',
        currency: 'SAR',
        fxRate: 2,
        flag: 'saudi-flag.png',
        corporates: [],
        top: 0.325,
        left: 0.2,
      },
    },
  ];

  country: any;

  constructor(private httpService: HttpService) {
    // sessionStorage.removeItem('securityId');
    this.updateSessionData();
    /* remove start */
    this.setDummyDefaultValues();
    /* remove ends */

    this.country = this.countries[0];
    this.group = this.userGroups[0];
  }

  /* remove start */
  setDummyDefaultValues(): void {
    this.corporateId = '100083';
    this.applicationDate = '25-Dec-2021';
    this.userName = 'tovmaker';

    let smallCorporateUser = {
      loginId: 'smemaker',
      corporateId: '100050',
      corporateCode: '555200',
      corporateName: 'Oiltek Sdn Bhd',
      groupName: '',
      groupId: '',
      corporateType: 'S',
      applicationDate: '31-Jan-2022',
      smsVerification: true,
      mobileVerification: true,
      deviceVerification: true,
      webVerification: true,
      isSelfAuth: false,
      fullName: 'James Tan',
      firstName: 'James',
      lastName: 'Tan',
      mobileNumber: 9087654321,
      profileName: 'Chief Executive Officer',
      isGroupUser: 'N',
      isMultiCountryUser: 'N',
      authType: ['SOFTTOKEN'],
      landingPage: 'Payments',
      consolidatedwidget: 'Y',
      currentServerTimeSec: '16:11:00',
      currentServerTimeA: '04:11 PM',
      lastLoginDateTime: '31-Jan-2022 02:11 pm',
      lastFailedLogin: '29-Jan-2022 04:11:00',
      lastLoginTime: '02:11 pm',
      lastCorporateLoginDateTime: '03:11 PM, 31 Jan 2022',
      tokenUsed: 'TI12456',
      token: 'xxx12456',
      profilePicFileName: './../../../assets/images/avatar.jpg',
      corporateImage: './../../../assets/images/corporate-S.png',
      groupImage: './../../../assets/images/corporate-S.png',
      quickActions: [
        { displayName: 'Single Payment', link: '' },
        { displayName: 'Add Beneficiary', link: '' },
        { displayName: 'Bulk Payment', link: '' },
        { displayName: 'Apply For Loan', link: '' },
        { displayName: 'Start Investing', link: '' },
        { displayName: 'Create VA', link: '' },
      ],
      accountDetails: {
        accountNumber: 555200000012,
        accountType: 'CASA Account',
        accountBalance: 9500,
      },
      loginPreferenceDetails: {
        bankType: 'Conventional',
      },
    };

    let largeCorporateUser = {
      loginId: 'ssmaker',
      corporateId: '100083',
      corporateCode: '999200',
      corporateName: 'Toyota Motors UAE',
      groupName: 'Toyota Motors',
      groupId: '1',
      corporateType: 'L',
      applicationDate: '24-Dec-2021',
      smsVerification: true,
      mobileVerification: true,
      deviceVerification: true,
      webVerification: true,
      isSelfAuth: false,
      fullName: 'James Tan',
      firstName: 'James',
      lastName: 'Tan',
      mobileNumber: 9087654321,
      profileName: 'Chief Executive Officer',
      isGroupUser: 'N',
      isMultiCountryUser: 'Y',
      authType: ['SOFTTOKEN'],
      landingPage: 'Payments',
      consolidatedwidget: 'Y',
      currentServerTimeSec: '15:20:07',
      currentServerTimeA: '03:20 PM',
      lastLoginDateTime: '24-Dec-2021 01:20 pm',
      lastFailedLogin: '22-Dec-2021 03:20:07',
      lastLoginTime: '01:20 pm',
      lastCorporateLoginDateTime: '02:20 PM, 24 Dec 2021',
      tokenUsed: 'TI12456',
      token: 'xxx12456',
      profilePicFileName: 'assets/images/avatar.jpg',
      corporateImage: 'assets/images/corporate-L.png',
      quickActions: [
        { displayName: 'Single Payment', link: '' },
        { displayName: 'Add Beneficiary', link: '' },
        { displayName: 'Bulk Payment', link: '' },
        { displayName: 'Apply For Loan', link: '' },
        { displayName: 'Start Investing', link: '' },
        { displayName: 'Create VA', link: '' },
      ],
      accountDetails: {
        accountNumber: 999200000011,
        accountType: 'Business Savings',
        accountBalance: 788800,
      },

      loginPreferenceDetails: {
        bankType: 'Conventional',
      },
    };

    this.userDetails = largeCorporateUser;
    this.corporateId = this.userDetails.corporateId;
    this.groupId = this.userDetails.groupId;
    this.applicationDate = this.userDetails?.applicationDate
      ? this.userDetails.applicationDate
      : '05-Jan-2022';
    this.userName = this.userDetails.userName;

    this.loginPreferenceDetails.loginType =
      this.userDetails.isGroupUser == 'Y' ? 'group' : 'individual';
    this.dashboardRouteUrl = '/dashboard/consolidated';
  }
  /* remove ends */

  updateSessionData(): void {
    this.httpService.httpPost('login/private/getUserSessionData').subscribe((response: any) => {
      this.userDetails = response.userDetails;
      this.corporateId = response.userDetails.corporateId;
      this.applicationDate = this.userDetails?.applicationDate
        ? this.userDetails.applicationDate
        : '05-Jan-2022';
      this.userName = response.userDetails.userName;
    });
  }

  getApplicationDate(): string {
    return this.applicationDate;
  }

  getCorporateId(): string {
    return this.corporateId;
  }

  resetLoginDetails() {
    this.userDetails = { accountDetails: {} };
    this.applicationDate = '';
    this.corporateId = '';
    this.userName = 'null';
    this.loginPreferenceDetails = new LoginDetails();
  }

  setLastActivities(lastActivities: boolean) {
    this.lastActivities.next(lastActivities);
  }

  getlastActivities() {
    return this.lastActivities;
  }

  setDashboardType(dashboardType: string) {
    this.dashboardType.next(dashboardType);
  }

  getDashboardType() {
    return this.dashboardType;
  }
}
