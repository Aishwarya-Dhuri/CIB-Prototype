import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BankGuaranteeAmendService {
  filters: any[] = [];
  repair = false;
  viewMode = false;
  editMode = false;
  selectedAmendId: string = '';

  steps = [
    {
      amendStatus: 'error',
      displayLabel: 'Amend Details',
    },
    {
      amendStatus: 'error',
      displayLabel: 'Bank Guarantee Details',
      displayFields: [{ displayName: 'Corporate Ref No', value: 'COR001' }],
    },
    {
      displayLabel: 'Applicant Details',
    },
    {
      displayLabel: 'Beneficiary Details',
      amendStatus: 'error',
      displayFields: [{ displayName: 'Beneficiary Code', value: 'Bene220000665' }],
    },
    {
      amendStatus: 'error',
      displayLabel: 'Transaction Details',
      key: 'transactionDetails',
      displayFields: [{ displayName: 'Amount', value: '20000' }],
    },
    {
      displayLabel: 'Supporting Documents',
    },
    {
      displayLabel: 'Terms And Conditions',
    },
  ];

  activeStepIndex = 0;

  bankGuarantee = {
    bankGuaranteeDetails: {
      typeOfApplicationOrUndertaking: '',
      applicableRule: '',
      corporateReferenceNo: '',
      transactionDate: '',
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
    transactionDetails: {
      currency: '',
      amount: '',
      effectiveDate: '',
      validity: 'Fixed',
      expiryDate: '',
      claimExpiryDate: '',
      guaranteeFormat: 'As Per Bank Format',
      supportingDocument: [],
      preferredLanguageOfGuaranteee: 'English',
      name: '',
      telephoneNo: '',
      idProof: '',
      purposeOfGuarantee: '',
      accountNumberForCharges: '',
    },
    supportingDocuments: {
      bgStandard359: true,
      bgStandard359RefNo: '12345',
      bgStandard359Document: [
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
    termsAndCondition: {
      agreeToTermsAndCondition: true,
    },
  };

  constructor() {}
}
