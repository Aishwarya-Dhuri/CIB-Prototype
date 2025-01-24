export class BankGuarantee {
  constructor(
    public noOfAmendments: string = '',
    public bankGuaranteeNo: string = '',
    public typeOfApplicationOrUndertaking: string = '',
    public corporateReferenceNo: string = '',
    public transactionDate: string = '',
    public applicant: string = '',
    public applicantName: string = '',
    public beneficiaryName: string = '',
    public currency: string = '',
    public amount: string = '',
    public expiryDate: string = '',
    public claimExpiryDate: string = '',
    public status: string = '',
    public initiationType: string = '',
    public bankGuaranteeDetails = [new BankGuaranteeDetails()],
    public applicantDetails = [new ApplicantDetails()],
    public beneficiaryDetails = [new BeneficiaryDetails()],
    public transactionDetails = [new TransactionDetails()],
    public supportingDocuments = [new SupportingDocuments()],
    public termsAndCondition = [new TermsAndCondition()],
  ) { }
}

export class BankGuaranteeDetails {
  constructor(
    public typeOfApplicationOrUndertaking: string = '',
    public applicableRule: string = '',
    public description: string = '',
    public corporateReferenceNo: string = '',
    public transactionDate: string = '',
    public issuanceFor: string = '',
    public adviceMode: string = '',
  ) { }
}

export class ApplicantDetails {
  constructor(
    public applicant: string = '',
    public applicantName: string = '',
    public applicantEmail: string = '',
    public applicantMobileNo: string = '',
    public applicantAddress: string = '',
    public onBehalfOf: boolean = false,
    public name: string = '',
    public telephoneNo: string = '',
    public address1: Address[] = [new Address(true, '')],
    public address2: Address[] = [new Address(false, '')],
    public address3: Address[] = [new Address(false, '')],
    public nameForClarification: string = '',
    public mobileNumberForClarification: string = '',
  ) { }
}
export class Address {
  constructor(public show: boolean = true, public address: string = '') { }
}

export class BeneficiaryDetails {
  constructor(
    public frequencyOfExecution: string = '',
    public beneficiaryCode: string = '',
    public beneficiaryName: string = '',
    public beneficiaryAddress1: Address[] = [new Address(true, '')],
    public beneficiaryAddress2: Address[] = [new Address(false, '')],
    public beneficiaryAddress3: Address[] = [new Address(false, '')],
    public country: string = '',
    public email: string = '',
    public bankSwiftCode: string = '',
    public beneficiaryAccountNumber: string = '',
    public beneficiaryBankName: string = '',
    public beneficiaryBankAddress1: Address[] = [new Address(true, '')],
    public beneficiaryBankAddress2: Address[] = [new Address(false, '')],
    public beneficiaryBankAddress3: Address[] = [new Address(false, '')],
  ) { }
}

export class TransactionDetails {
  constructor(
    public currency: string = '',
    public amount: string = '',
    public effectiveDate: string = '',
    public validity: string = 'Fixed',
    public expiryDate: string = '',
    public claimExpiryDate: string = '',
    public guaranteeFormat: string = 'As Per Bank Format',
    public supportingDocument: any[] = [],
    public preferredLanguageOfGuarantee: string = 'English',
    public name: string = '',
    public telephoneNo: string = '',
    public idProof: string = '',
    public purposeOfGuarantee: string = '',
    public accountNumberForCharges: string = '',
    public otherInstructions: string = '',
  ) { }
}

export class SupportingDocuments {
  constructor(
    public bgStandard359: boolean = false,
    public bgStandard359RefNo: string = '',
    public bgStandard359Document: any[] = [],
  ) { }
}

export class TermsAndCondition {
  constructor(public agreeToTermsAndCondition: boolean = false) { }
}
