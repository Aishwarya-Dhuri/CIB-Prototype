import { SelfOnboarding } from '../@models/self-onboarding.model';

export const selfOnboardingExistingData: SelfOnboarding = {
  status: 'New Request',
  companyInformation: [
    {
      status: 'New Request',
      requestType: 'New',
      companyName: 'APS',
      customerId: '',
      accountNumber: '',
      taxIdentificationNumber: '123456',
      address: '12, ABC, XYZ',
      contactName: 'Shubham',
      designation: 'SE',
      emailId: '',
      mobileNumber: '',
      showOneTimePassword: false,
      oneTimePassword: '',
      showOtp: false,
      otpVerified: false,
    },
  ],
  userDetails: [
    {
      firstName: 'Shubham',
      lastName: 'More',
      userId: 'shubham.more',
      gender: 'male',
      emailId: 'shubham@aps.com',
      mobileNumber: '9876543210',
      accessRole: 'maker',
      profile: 'manager',
      authorizationLogic: 'Limited',
      currency: 'INR',
      authorizationLimit: '100090',
      receiveAlerts: true,
    },
  ],
  productDetails: [
    {
      selectedPlan: [
        {
          planType: 'Basic Banking',
          products: [
            {
              displayName: 'Account Services',
              authenticationRule: '',
              limitType: '',
              authenticationLimit: '',
            },
            {
              displayName: 'Payments',
              authenticationRule: '',
              limitType: '',
              authenticationLimit: '',
            },
            {
              displayName: 'Card Services',
              authenticationRule: '',
              limitType: '',
              authenticationLimit: '',
            },
            {
              displayName: 'Service Request',
              authenticationRule: '',
              limitType: '',
              authenticationLimit: '',
            },
            {
              displayName: 'All basic Digital banking features',
              authenticationRule: '',
              limitType: '',

              authenticationLimit: '',
            },
          ],
        },
      ],
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
      companyTradeLicense: [
        {
          progress: 100,
          status: 'Complete',
          fileName: 'Desert.jpg',
          fileSize: 845941,
          sysFileName: 'sys10051991_Desert.jpg',
        },
      ],
      memorandumOfAssociation: [
        {
          progress: 100,
          status: 'Complete',
          fileName: 'Chrysanthemum.tif',
          fileSize: 1813344,
          sysFileName: 'sys10051991_Chrysanthemum.tif',
        },
      ],
      shareCertificates: [],
      boardOfDirectors: [],
      otherDocuments: [],
      uploadOperatingMandate: [],
    },
  ],
};
