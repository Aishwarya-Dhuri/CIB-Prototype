import { SelfOnboarding } from '../@models/self-onboarding.model';

export const selfOnboardingData: SelfOnboarding = {
  status: 'New Request',
  companyInformation: [
    {
      status: 'New Request',
      requestType: 'New',
      companyName: '',
      customerId: '',
      accountNumber: '',
      taxIdentificationNumber: '',
      address: '',
      contactName: '',
      designation: '',
      emailId: '',
      mobileNumber: '',
      showOneTimePassword: false,
      oneTimePassword: '',
      showOtp: false,
      otpVerified: false,
    },
  ],
  userDetails: [],
  productDetails: [
    {
      selectedPlan: [],
      addOnServices: [
        {
          custodianServices: [{ show: false }],
          wealthManagement: [{ show: false }],
          treasuryServices: [{ show: false }],
          agriGoldloan: [{ show: false }],
          capitalLoans: [{ show: false }]
        },
      ],
    },
  ],
  documentDetails: [
    {
      companyTradeLicense: [],
      memorandumOfAssociation: [],
      shareCertificates: [],
      boardOfDirectors: [],
      otherDocuments: [],
      uploadOperatingMandate: [],
    },
  ],
};
