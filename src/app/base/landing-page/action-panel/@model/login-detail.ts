import { Select } from 'src/app/shared/@models/select.model';

export class LoginDetails {
  countryId: string | number;
  countryName: string;
  bankType: 'Conventional' | 'Islamic';
  loginType: 'individual' | 'group';
  groupId: string | number;
  groupName: string;
  defaultDashboardId: string | number;
  defaultDashboardName: string;
  defaultDashboardUrl: string;
  isLoginPreference: boolean;

  constructor() {
    this.countryId = '';
    this.countryName = '';
    this.bankType = 'Conventional';
    this.loginType = 'individual';
    this.groupId = '';
    this.groupName = '';
    this.defaultDashboardId = '101';
    this.defaultDashboardName = 'Consolidated Dashboard';
    this.defaultDashboardUrl = '/dashboard/consolidated';
    this.isLoginPreference = false;
  }
}
