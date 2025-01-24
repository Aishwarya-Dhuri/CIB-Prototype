import { ResponseStatus } from 'src/app/shared/@models/response-status';
import { LoginDetails } from '../landing-page/action-panel/@model/login-detail';

export interface BasicAuthentication_Request {
  clientDetails: { source: string };
  password: string;
  userName: string;
  versionDetails: { version: number };
  corporateCode?: string;
}

export interface BasicAuthentication_Response {
  responseStatus: ResponseStatus;
  securityId: string;
  userDetails: UserDetails;
  loginPreferenceDetails: LoginDetails;
  enrichmentMap: {
    baseCountryId: string;
    baseCurrencyCode: string;
    languageSelected: string;
    passwordPolicyType: string;
    baseCurrencyId: string;
    baseCountryCode: string;
  };
  currentServerTime: string;
  entityIdentifier: string;
  loggable: boolean;
}

export interface UserDetails {
  type: string;
  applicationDate: string;
  loginId: string;
  isLoggable: boolean;
  responseStatus: ResponseStatus;
  authorized: boolean;
  callMakerCheckerStrategy: boolean;
  entityIdentifier: string;
  enabled: boolean;
  active: boolean;
  isAuthorizeReject: boolean;
  isViewAuthorizer: boolean;
  isSelfAuth: boolean;
  userName: string;
  corporatecode: string;
  name: string;
  corporateId: string;
  profileId: string;
  profileName: string;
  profileImage: string;
  lastLogin: string;
  isGroupUser: string;
  tokenValidated: boolean;
  displayWelcomeCardAtLogin: boolean;
  authType: string[];
  moduleDetails: {
    [module: string]: { productId: string; currentDate: string };
  };
  corporateBranchId: string;
  corporateBranchCode: string;
  corporateBranch: string;
  landingPage: string;
  landingPageId: string;
  consolidatedwidget: string;
  entity: string;
  landingPageAdvertisement: string[];
  advertisementClicked: boolean[];
  advertisementUrl: string[];
  corporateName: string;
  userLoginRestrictions: [];
  acrossBranchAuthorization: boolean;
  favouriteModules: FavouriteModule[];
  theme: string;
  isHubUser: string;
  appSettingId: string | number;
}

export interface FavouriteModule {
  type: string;
  isLoggable: boolean;
  responseStatus: ResponseStatus;
  name: string;
  state: string;
  entity: string;
  entityIdentifier: string;
}
