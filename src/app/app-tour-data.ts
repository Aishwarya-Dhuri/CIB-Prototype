import Step from 'shepherd.js/src/types/step';

export const tourButtons = {
  cancel: {
    classes: 'btn btn-tertiary p-mx-1 text-size-16',
    secondary: true,
    text: 'Exit',
    type: 'cancel',
  },
  next: {
    classes: 'btn btn-primary p-mx-1 text-size-16',
    text: 'Next',
    type: 'next',
  },
  back: {
    classes: 'btn btn-secondary p-mx-1 text-size-16',
    secondary: true,
    text: 'Back',
    type: 'back',
  },
};

export const defaultStepOptions: Step.StepOptions = {
  scrollTo: true,
  arrow: true,
  modalOverlayOpeningPadding: 6,
  modalOverlayOpeningRadius: 6,
  cancelIcon: {
    enabled: true,
  },
  popperOptions: {
    modifiers: [{ name: 'offset', options: { offset: [0, 20] } }],
  },
};

export const URL_STEPS_MAP: {
  [key: string]: Step.StepOptions[];
} = {
  // '/login': [
  //   {
  //     attachTo: {
  //       element: '.tour-login-step1',
  //       on: 'bottom',
  //     },
  //     id: 'tour-login-step1',
  //     title: 'Login Heading',
  //     text: 'This is login message, Welcome to safe and secure banking with enhanced security.',
  //   },
  //   {
  //     attachTo: {
  //       element: '.p-tabview-nav',
  //       on: 'bottom',
  //     },
  //     id: 'tour-login-step2',
  //     title: 'Login Type',
  //     text: `Diffrent login types are provided to enter into system, 
  //       like Login ID, Biometric, MPIN and QR Code. 
  //       On clicking of any of these tabs required form will be shown`,
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-login-step3',
  //       on: 'bottom',
  //     },
  //     id: 'tour-login-step3',
  //     title: 'Step Details',
  //     text: 'It will show current step progress',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-login-step4',
  //       on: 'bottom',
  //     },
  //     id: 'tour-login-step4',
  //     title: 'Corporate Code',
  //     text: 'Enter Corporate Code here to proceed login with',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-login-step5',
  //       on: 'bottom',
  //     },
  //     id: 'tour-login-step5',
  //     title: 'User Name',
  //     text: 'Enter Username to get phishing details',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-login-step6',
  //       on: 'bottom',
  //     },
  //     id: 'tour-login-step6',
  //     title: 'Phishing Details',
  //     text: 'Validate these phishing details and message, If Valid the click on checkbox',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-login-step7',
  //       on: 'bottom',
  //     },
  //     id: 'tour-login-step7',
  //     title: 'Login Password',
  //     text: 'Enter Password here',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-login-step8',
  //       on: 'bottom',
  //     },
  //     id: 'tour-login-step8',
  //     title: 'Links',
  //     text: 'If you forgot password click here or you want virtual keyborad click on link',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-login-step9',
  //       on: 'bottom',
  //     },
  //     id: 'tour-login-step9',
  //     title: 'Accept Terms and Conditions',
  //     text: 'Click on this checkbox to accept it',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-login-step10',
  //       on: 'bottom',
  //     },
  //     id: 'tour-login-step10',
  //     title: 'Reset',
  //     text: 'Click on this button to reset the details',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-login-step11',
  //       on: 'bottom',
  //     },
  //     id: 'tour-login-step11',
  //     title: 'Procced',
  //     text: 'Click on this button to proceed',
  //   },
  // ],
  // '/dashboard/payments': [
  //   {
  //     attachTo: {
  //       element: '.tour-dashboard-step1',
  //       on: 'bottom',
  //     },
  //     id: 'tour-dashboard-step1',
  //     title: 'Main Header',
  //     text: 'This is main header',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-dashboard-step2',
  //       on: 'right',
  //     },
  //     id: 'tour-dashboard-step2',
  //     title: 'Mega Menu',
  //     text: 'Mega menus are toggles from here',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-dashboard-step3',
  //       on: 'bottom',
  //     },
  //     scrollTo: false,
  //     id: 'tour-dashboard-step3',
  //     title: 'Breadcrum Bar',
  //     text: 'Breadcrum details are shown here',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-dashboard-step4',
  //       on: 'bottom',
  //     },
  //     scrollTo: false,
  //     id: 'tour-dashboard-step4',
  //     title: 'Page Actions',
  //     text: 'Page actions are shown here, like grid column switch, print, refresh etc.',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-dashboard-step5',
  //       on: 'bottom',
  //     },
  //     id: 'tour-dashboard-step5',
  //     title: 'Bank Logo',
  //     text: 'This is bank logo',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-dashboard-step6',
  //       on: 'bottom',
  //     },
  //     id: 'tour-dashboard-step6',
  //     title: 'Product Logo',
  //     text: 'This is product logo',
  //   },
  //   {
  //     attachTo: {
  //       element: '.tour-dashboard-step7',
  //       on: 'bottom',
  //     },
  //     id: 'tour-dashboard-step7',
  //     title: 'Login Type Selection',
  //     text: 'This is Login Type Selection',
  //   },

  //   {
  //     attachTo: {
  //       element: '.tour-dashboard-step7',
  //       on: 'bottom',
  //     },
  //     id: 'tour-dashboard-step8',
  //     title: 'Login Type Selection',
  //     text: 'This is Login Type Selection',
  //   },
  // ],




  '/payments/transactions/singlePaymentRequest': [

    {
      attachTo: {
        element: '.tour-dashboard-step3',
        on: 'bottom',
      },
      scrollTo: false,
      id: 'tour-dashboard-step3',
      title: 'Single Payment Summary Page',
      text: 'You are in the fund transfer screen and there are various ways to do this',
    },


    {
      attachTo: {
        element: '.tour-singlePaymentRequest-step4',
        on: 'bottom',
      },
      scrollTo: false,
      id: 'tour-singlePaymentRequest-step4',
      title: 'Initiate - Payment Method Wise',
      text: 'Click here if you know the payment method via which this payment needs to be initiated.',
    },

    {
      attachTo: {
        element: '.tour-singlePaymentRequest-step5',
        on: 'bottom',
      },
      scrollTo: false,
      id: 'tour-singlePaymentRequest-step5',
      title: 'Quick Pay',
      text: 'For a quick IFT Transaction, fill this form!',
    },

    {
      attachTo: {
        element: '.tour-singlePaymentRequest-step6',
        on: 'bottom',
      },
      scrollTo: false,
      id: 'tour-singlePaymentRequest-step6',
      title: 'Listing',
      text: 'Click here to see all the Payments done by you!',
    }
  ]
};
