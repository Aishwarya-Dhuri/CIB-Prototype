import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LetterOfCreditAmendService {
  filters: any[] = [];

  repair = false;

  viewMode = false;
  editMode = false;

  steps = [
    {
      amendStatus: 'error',
      displayLabel: 'Amend Details',
    },
    {
      amendStatus: 'error',
      displayLabel: 'Letter Of Credit Details',
      displayFields: [{ displayName: 'Amount', value: 'USD26,600,000' }],
    },
    {
      amendStatus: 'error',
      displayLabel: 'Applicant Details',
      key: 'applicantDetails',

    },
    {
      amendStatus: 'error',
      displayLabel: 'Beneficiary Details',
      key: 'beneficiaryDetails',

    },
    {
      amendStatus: 'error',
      displayLabel: 'Payment Details',
      key: 'paymentDetails',

    },
    {
      amendStatus: 'error',
      displayLabel: 'Shipping Details',
      key: 'shippingDetails',
      displayFields: [{ displayName: 'Period Of Presentation', value: '21' }],
    },
    {
      amendStatus: 'error',
      displayLabel: 'Supporting Documents',
      key: 'supportingDocuments',

    },
    {
      amendStatus: 'error',
      displayLabel: 'Clauses',
      key: 'clauses',

    },
    {
      amendStatus: 'error',
      displayLabel: 'Terms And Conditions',
      key: 'termsAndConditions',

    },
  ];

  activeStepIndex: number = 0;

  letterOfCredit = {
    letterOfCreditDetails: {
      irrevocable: true,
      transferable: false,
      proformaInvoiceNo: '12345',
      corporateReferenceNo: '123456',
      currency: 'INR',
      amount: '658932',
      minimumTolerance: '20',
      maximumTolerance: '50',
      notExceeding: '500',
      expiryDate: '24-Nov-2021',
      placeOfExpiry: 'Mum',
      transactionDate: '22-Nov-2021',
      effectiveDate: '02-Dec-2021',
    },
    applicantDetails: {
      applicantName: 'Pepsico',
      applicantEmail: 'info.dxb@pepsico.in',
      applicantMobileNo: '+91 7000000000',
      applicantAddress: '7th Street, Near Stadium Metro Station',
      onBehalfOf: true,
      name: 'Richard',
      email: 'richrd@gmail.com',
      mobileNumber: '9876543210',
      address1: { show: true, address: '123, abc' },
      address2: { show: true, address: 'def' },
      address3: { show: false, address: '' },
    },
    beneficiaryDetails: {
      frequencyOfExecution: 'Add New Beneficiary',
      beneficiaryCode: '',
      beneficiaryName: 'B123',
      email: 'b123@gmail.con',
      bankSwiftCode: '6589654122',
      beneficiaryAddress1: { show: true, address: 'address 1234' },
      beneficiaryAddress2: { show: false, address: '' },
      beneficiaryAddress3: { show: false, address: '' },
      country: 'IND',
      beneficiaryAccountNumber: '123456787543221',
      beneficiaryBankName: 'ABCD',
      beneficiaryBankAddress1: { show: true, address: 'bank address 1234' },
      beneficiaryBankAddress2: { show: false, address: '' },
      beneficiaryBankAddress3: { show: false, address: '' },
    },
    paymentDetails: {
      creditAvailableWith: 'Other Bank',
      bankName: 'PNB',
      bankSwiftCode: '234',
      bankAddress1: { show: true, address: 'PNB 1234 address 33' },
      bankAddress2: { show: false, address: '' },
      bankAddress3: { show: false, address: '' },
      creditAvailableBy: 'Payment',
      draftAt: 'Sight',
      numberOfDays: '',
      selectBeforeAfter: '',
      document: '',
      documentType: '',
      deferredPaymentDetails: '',
      mixedPaymentDetails: '',
      confirmationInstruction: 'Instruction 1',
      accountNumberForCharges: '1234567891',
      accountNumberForSettlement: '1234567891',
      charges: {
        chargesType: 'All Charges on Beneficiary Account',
        chargeDetails: '',
        confirmation: true,
        confirmationBourneBy: 'Bene',
        legalization: false,
        legalizationBourneBy: '',
        outsideCountry: true,
        outsideCountryBourneBy: 'Applicant',
        amendment: false,
        amendmentBourneBy: '',
        reimbursement: false,
        reimbursementBourneBy: '',
      },
    },
    shippingDetails: {
      placeOfTakingIncharge: 'WB',
      modeOfShipment: 'Sea',
      latestDateOfShipping: '18-Nov-2021',
      partialShipment: 'Allowed',
      transhipment: 'Allowed',
      portAirportOfLoading: 'WB',
      portAirportOfDischarge: 'MUM',
      finalDestination: 'Rajkot',
      periodOfPresentation: '5',
      descriptionOfGoodsServices:
        'Beverage glass bottles by AB Corp is the leading player in the global Ice-Cold Merchandisers (Beverage Coolers) market and is the largest glass bottle producer in Asia, meeting the needs of beverage companies. Today AB Corp is the largest and sustainable in the Ice-Cold Merchandising (ICM) market. Production hubs are located in Turkey, India, China, Indonesia, South Africa, Nigeria and in the USA.Beverage glass bottles by AB Corp is the leading player in the global Ice-Cold Merchandisers (Beverage Coolers) market and is the largest glass bottle producer in Asia, meeting the needs of beverage companies. Today AB Corp is the largest and sustainable in the Ice-Cold Merchandising (ICM) market. Production hubs are located in Turkey, India, China, Indonesia, South Africa, Nigeria and in the USA.',
      shippingMarks: 'qwert',
      timeOfShipment: 'Cost and freight',
    },
    supportingDocuments: {
      lcIrrevocable: true,
      lcIrrevocableRefNo: '12345',
      lcIrrevocableDocument: [
        {
          fileName: 'Document.docx',
          fileSize: '5.5 MB',
        },
      ],
      proformaInvoice: false,
      proformaInvoiceRefNo: '',
      proformaInvoiceDocument: [],
      insurancePolicy: false,
      insurancePolicyRefNo: '',
      insurancePolicyDocument: [],
    },
    clauses: {
      GoodsReceivedNoteDatedNotLaterThan: true,
      latestDateOfDelivery: '17-Nov-2021',
      grn: '22',
      packingListIn: false,
      number: '',
    },
    termsAndCondition: {
      agreeToTermsAndCondition: true,
      additionalCondition: '',
      specialCondition: '',
    },
  };

  constructor() {}
}
