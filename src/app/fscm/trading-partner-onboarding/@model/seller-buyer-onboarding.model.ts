export class TradePartnerOnboarding {
  constructor(
    public type: string = 'Seller',
    public customerType: string = '',
    public code: string = '',
    public name: string = '',
    public nameLocal: string = '',
    // public cbsSegmentCode: string = '',
    public taxIdentificationNumber: string = '',
    public taxBranch: string = '',
    public logo: any[] = [],
    public address1: string = '',
    public address2: string = '',
    public address3: string = '',
    public location: string = '',
    public province: string = '',
    public country: string = '',
    public city: string = '',
    public postalCode: string = '',
    public emailId: string = '',
    public mobileNumber: string = '',
    public telephoneNumber: string = '',
    public contactDetails: ContactDetails[] = [],

    public parameters: TradePartnerOnboardingParameters[] = [
      new TradePartnerOnboardingParameters(),
    ],

    public authenticationRules: TradePartnerOnboardingAuthenticationRule[] = [],
  ) {}
}

class ContactDetails {
  constructor(
    public srNo: string | number = '',
    public contactPersonName: string = '',
    public emailId: string = '',
    public designation: string = '',
    public telephoneNumber: string = '',
    public actions: any[] = [],
  ) {}
}

export class TradePartnerOnboardingParameters {
  constructor(
    public securityOfficer: SecurityOfficer[] = [new SecurityOfficer()],
    public otherParameterConfiguration: OtherParameterConfiguration[] = [
      new OtherParameterConfiguration(),
    ],
    public isIpMapping: string = '',
    public ipMapping: IpMapping[] = [],
  ) {}
}

class SecurityOfficer {
  constructor(public corporateUserAdministrationBy: string = '') {}
}

class OtherParameterConfiguration {
  constructor(
    public holidayAccess: string = '',
    public reportAccessOnHoliday: string = '',
    public verificationRequired: string = '',
    public noOfVerifiers: string = '',
  ) {}
}

class IpMapping {
  constructor(
    public srNo: string | number = '',
    public startRange: string = '',
    public endRange: string = '',
    public actions: any[] = [],
  ) {}
}

export class TradePartnerOnboardingAuthenticationRule {
  constructor(
    public srNo: string | number = '',
    public moduleName: string = '',
    public transactionName: string = '',
    public authorizationRule: string = '',
    public actions: any[] = [],
  ) {}
}
