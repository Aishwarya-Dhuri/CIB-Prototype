export interface SelfOnboarding {
  status: string; // 'New Request', 'On Hold', 'Rejected', 'Verified', 'Registered'
  companyInformation: CompanyInformation[];
  userDetails: UserDetails[];
  productDetails: ProductDetails[];
  documentDetails: DocumentDetails[];
}

export interface CompanyInformation {
  status: string; // 'New Request', 'On Hold', 'Rejected', 'Verified', 'Registered'
  requestType: string; // 'New', 'Existing'
  companyName: string;
  customerId: string;
  accountNumber: string;
  taxIdentificationNumber: string;
  address: string;
  contactName: string;
  designation: string;
  emailId: string;
  mobileNumber: string;
  showOneTimePassword: boolean;
  oneTimePassword: string;
  showOtp: boolean;
  otpVerified: boolean;
}

export interface UserDetails {
  firstName: string;
  lastName: string;
  userId: string;
  gender: string;
  emailId: string;
  mobileNumber: string;
  accessRole: string;
  profile: string;
  authorizationLogic: string;
  currency: string;
  authorizationLimit: string;
  receiveAlerts: boolean;
}

export interface ProductDetails {
  selectedPlan: {
    planType: string;
    products: {
      displayName: string;
      authenticationRule: string;
      limitType: string;
      authenticationLimit: string;
    }[];
  }[];
  addOnServices: {
    custodianServices: {
      show: boolean;
    }[];
    wealthManagement: {
      show: boolean;
    }[];
    treasuryServices: {
      show: boolean;
    }[];
    agriGoldloan: {
      show: boolean;
    }[];
    capitalLoans: {
      show: boolean;
    }[];
  }[];
}

export interface DocumentDetails {
  companyTradeLicense: any[];
  memorandumOfAssociation: any[];
  shareCertificates: any[];
  boardOfDirectors: any[];
  otherDocuments: any[];
  uploadOperatingMandate: any[];
}
