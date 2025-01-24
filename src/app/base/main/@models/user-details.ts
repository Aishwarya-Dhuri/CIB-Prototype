import { ResponseStatus } from 'src/app/shared/@models/response-status';
import { Favourite_Response } from './favourite';

export interface UserDetail_Response {
  userDetails: {
    profilePicFileName: string;
    userName: string;
    userRole: string;
    corporateImage: string;
    corporateLogin: string;
    corporateName: string;
    token: string;
    lastLogin: string;
  };
  accountDetails: {
    accountNumber: string;
    accountType: string;
    accountBalance: string;
  };
  quickActions: {
    displayName: string;
    link: string;
  }[];

  // type: string;
  // isLoggable: boolean;
  // responseStatus: ResponseStatus;
  // authorized: boolean;
  // callMakerCheckerStrategy: boolean;
  // entityIdentifier: string;
  // enabled: boolean;
  // active: boolean;
  // isAuthorizeReject: boolean;
  // isViewAuthorizer: boolean;
  // userName: string;
  // name: string;
  // profileId: string;
  // profileName: string;
  // profileImage: string;
  // lastLogin: Date;
  // tokenValidated: boolean;
  // entity: string;
  // branchName: string;
  // acrossBranchAuthorization: boolean;
  // moduleDetails: Map<string, ModuleDetail>;
  // landingPageAdvertisement: string[];
  // advertisementClicked: boolean[];
  // advertisementUrl: string[];
  // favouriteModules: Favourite_Response[];
}

export interface ModuleDetail {
  productId: string;
  currentDate: Date;
}
