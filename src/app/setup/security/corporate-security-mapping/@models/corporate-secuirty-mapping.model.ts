export class CorporateSecurityMapping {
  // User Details
  corporateId: string;
  corporateName: string;
  corporateCode: string;
  userId?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  genderId: string;
  encryptionTypeId: string;
  encryptionRequired: string;
  keyId: string;
  encryptionKey: string;

  public uploadKeyFile: any[];

  encryptionTypeName: string;
  utilityTypeId: string;
  utilityTypeName: string;
  h2hReportId: string;
  h2hReportName: string;
  sourceFolder: string;
  destinationFolder: string;
  genderName: string;
  email?: string;
  telephoneNo?: string;
  faxNo?: string;
  userAlias?: string;
  signatureCode?: string;
  uploadedFileName?: string;
  signatureFileName?: string;
  signatureFileSize?: number;
  isResetUser?: boolean;
  isLockUser?: boolean;

  // Organization Details
  employeeCode: string;
  designation: string;
  department: string;
  categoryId: string;
  categoryName: string;
  profileId: string | number;
  profileName: string;
  corporateBranchId: string | number;
  corporateBranchName: string;
  organizationMobileNumber: string;
  organizationFax: string;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  pinCode?: string;
  locationName?: string;
  state?: string;
  country?: string;

  // Security Details
  userAuthorize?: string;
  defaultDashboardId: string;
  defaultDashboardName?: string;
  userAuth?: string;
  ipMappingRestriction?: string;
  ipMapping: IpMapping[];
  transactionSelfAuthorizer?: boolean;
  accountWiseAccess?: AccountWiseAccess[];
  mappedAccounts?: Number;
  masterSelfAuthorizer?: boolean;
  selfServiceRequest?: boolean;
  enableOTP?: boolean;
  otpChannel?: string;
  mobilityAccess?: boolean;
  isMultiCountry?: boolean;

  // Roles
  roles?: RoleDetail[];

  // login Restriction
  isLoginRestrictions: boolean;
  defaultLandingPage: string;
  corporateLoginRestrictions?: CorporateLoginRestriction[];
  effectiveFrom: string;
  effectiveTill?: string;

  // Group User Details
  isGroupUser: boolean;
  groupUserDetails?: groupUserDetails[];

  // Others
  themeDetails?: ThemeDetails[];
  languageDetails?: LanguageDetails[];
  securityQuestionAnswers?: SecurityQuestionAnswer[];
  loginPreferenceDetails?: LoginPreferenceDetails[];
  phishingDetails?: PhishingDetails[];

  constructor() {
    // user details
    this.corporateId = '';
    this.userId = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.genderId = '';
    this.encryptionTypeId = '';
    this.encryptionRequired = '';
    this.keyId = '';
    this.encryptionKey = '';

    this.uploadKeyFile = [];

    this.encryptionTypeName = '';
    this.utilityTypeId = '';
    this.utilityTypeName = '';
    this.h2hReportId = '';
    this.h2hReportName = '';
    this.sourceFolder = '';
    this.destinationFolder = '';
    this.genderName = '';
    this.email = '';
    this.telephoneNo = '';
    this.faxNo = '';
    this.userAlias = '';
    this.signatureCode = '';
    this.uploadedFileName = '';
    this.signatureFileName = '';
    this.signatureFileSize = 0;
    this.isLockUser = false;
    this.isResetUser = false;

    // organization Details
    this.employeeCode = '';
    this.designation = '';
    this.department = '';
    this.categoryId = '';
    this.categoryName = '';
    this.profileId = '';
    this.profileName = '';
    this.corporateBranchId = '';
    this.corporateBranchName = '';
    this.organizationMobileNumber = '';
    this.organizationFax = '';
    this.address1 = '';
    this.address2 = '';
    this.address3 = '';
    this.city = '';
    this.pinCode = '';
    this.locationName = '';
    this.state = '';
    this.country = '';

    // Security Details
    this.userAuthorize = 'Normal User';
    this.defaultDashboardId = '';
    this.defaultDashboardName = '';
    this.userAuth = 'soft';
    this.ipMappingRestriction = 'No';
    this.ipMapping = [];
    this.transactionSelfAuthorizer = false;
    this.accountWiseAccess = [];
    this.mappedAccounts = 0;
    this.masterSelfAuthorizer = false;
    this.selfServiceRequest = false;
    this.enableOTP = false;
    this.otpChannel = '';
    this.mobilityAccess = false;
    this.isMultiCountry = false;

    // login Restriction
    this.isLoginRestrictions = false;
    this.defaultLandingPage = '';
    this.corporateLoginRestrictions = [];
    this.effectiveFrom = '';
    this.effectiveTill = '';

    // Group User Details
    this.isGroupUser = false;
    this.groupUserDetails = [];

    // Roles
    this.roles = [];

    // Others
    this.securityQuestionAnswers = [];
    this.themeDetails = [new ThemeDetails()];
    this.languageDetails = [new LanguageDetails()];
    this.loginPreferenceDetails = [new LoginPreferenceDetails()];
    this.phishingDetails = [new PhishingDetails()];
  }
}

export class RoleDetail {
  moduleId: string | number;
  moduleName: string;
  roleId: string | number;
  roleName: string;
  initActions?: any;
  reviewActions?: any;

  constructor() {
    this.moduleId = '';
    this.moduleName = '';
    this.roleId = '';
    this.roleName = '';
    this.initActions = [];
    this.reviewActions = [];
  }
}

export class groupUserDetails {
  isGroupAdmin: boolean;
  groupId?: string;
  groupName?: string;
  groupProfileId?: string | number;
  groupProfile?: string;

  selfAuthorization?: boolean;
  isTransactionSelfAuthorizer?: boolean;
  groupAccountWiseAccess?: AccountWiseAccess[];
  mappedAccounts?: Number;
  isMasterSelfAuthorizer?: boolean;
  isSelfServiceRequest?: boolean;

  groupRoles?: RoleDetail[];

  constructor() {
    this.isGroupAdmin = false;
    this.groupId = '';
    this.groupName = '';
    this.groupProfileId = '';
    this.groupProfile = '';

    this.selfAuthorization = false;
    this.isTransactionSelfAuthorizer = false;
    this.groupAccountWiseAccess = [];
    this.mappedAccounts = 0;

    this.isMasterSelfAuthorizer = false;
    this.isSelfServiceRequest = false;

    this.groupRoles = [];
  }
}

export class CorporateLoginRestriction {
  restriction: boolean;
  weekday: string;
  restrictionType: string;
  weekdayno: string | number;
  startTime: string;
  endTime: string;
  actions?: any;

  constructor() {
    this.restriction = true;
    this.weekday = '';
    this.restrictionType = 'D';
    this.weekdayno = '';
    this.startTime = '10:00';
    this.endTime = '17:00';
    this.actions = [];
  }
}

export class PhishingDetails {
  categoryCode: string;
  phishingImageFileName: string;
  message: string;
  categoryName: string;
  phishingImageId: number;
  systemGeneratedImageFileName: string;

  constructor() {
    this.categoryCode = 'NATURE';
    this.phishingImageFileName = 'phishing0.jpg';
    this.message = "Welcome to Integro's Corporate Internet Banking Portal.";
    this.categoryName = 'Nature';
    this.phishingImageId = 1;
    this.systemGeneratedImageFileName = 'NATURE\\phishing0.jpg';
  }
}

export class ThemeDetails {
  themeId: string | number;
  themeName: string;
  isLightMode: boolean;
  constructor() {
    this.themeId = '1';
    this.themeName = 'Aurionpro';
    this.isLightMode = true;
  }
}

export class LanguageDetails {
  languageId: string | number;
  languageName: string;
  constructor() {
    this.languageId = 'en';
    this.languageName = 'English';
  }
}

export class LoginPreferenceDetails {
  countryId: string | number;
  countryName: string;
  bankType: 'Conventional' | 'Islamic';
  loginType: 'Individual' | 'Group';
  displayWelcomeCardAtLogin: boolean;
  displayLoginPreferencesAfterLogin: boolean;
  groupId: string | number;
  groupName: string;
  defaultDashboardId: string | number;
  defaultDashboardName: string;
  defaultDashboardUrl: string;
  enableConsolidatedView: boolean;
  isLoginPreference: boolean;

  constructor() {
    this.countryId = '1';
    this.countryName = 'India';
    this.displayWelcomeCardAtLogin = false;
    this.displayLoginPreferencesAfterLogin = false;
    this.bankType = 'Conventional';
    this.loginType = 'Individual';
    this.groupId = '';
    this.groupName = '';
    this.defaultDashboardId = '101';
    this.defaultDashboardName = 'Consolidated Dashboard';
    this.defaultDashboardUrl = '/dashboard/consolidated';
    this.enableConsolidatedView = false;
    this.enableConsolidatedView = false;
    this.isLoginPreference = false;
  }
}

export class IpMapping {
  constructor(
    public srNo: string | number = '',
    public startRange: string = '',
    public endRange: string = '',
    public actions: any[] = [],
  ) { }
}

export class SecurityQuestionAnswer {
  question?: string;
  answer?: string;
  isView?: boolean;
  constructor(question?: string, answer?: string, isView?: boolean) {
    this.question = question ? question : '';
    this.answer = answer ? answer : '';
    this.isView = isView ? isView : false;
  }
}

class AccountWiseAccess {
  constructor(
    public isSelected: boolean = false,
    public corporateCode: string = '',
    public accountNumber: string = '',
    public authorizationLimit: string = '',
  ) { }
}
