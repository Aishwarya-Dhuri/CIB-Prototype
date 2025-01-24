export class ShippingGuarantee {
  constructor(
    public userRefNo: string = '',
    public transactionDate: string = '',
    public applicantName: string = '',
    public beneficiaryName: string = '',
    public currency: string = '',
    public amount: string = '',
    public lcNumber: string = '',
    public sgExpiryDate: string = '',
    public sgClaimExpiryDate: string = '',
    public initiateType: string = '',
    public typeOfShippingGuarantee: string = '',
    public shippingGuaranteeAmount: string = '',
    public status: string = '',

    public applicantDetails = [new ApplicantDetails()],
    public shippingGuaranteeDetails = [new ShippingGuaranteeDetails()],
    public beneficiaryDetails = [new BeneficiaryDetails()],
    public shippingDetails = [new ShippingDetails()],
    public shippingDocumentDetails = [new ShippingDocumentDetails()],
    public supportingDocuments = [new SupportingDocuments()],
    public clauses = [new Clauses()],
    public termsAndCondition = [new TermsAndCondition()],
  ) { }
}

export class ApplicantDetails {
  constructor(
    public applicantName: string = 'Galaxy',
    public applicantEmail: string = 'abc@gmail.com',
    public applicantMobileNo: string = '9876543221',
    public applicantAddress: string = 'Airport Road, Abu Dhabi',
    public ieCode: string = 'ASBPY1234Y',
  ) { }
}

export class ShippingGuaranteeDetails {
  constructor(
    public typeOfGuarantee: string = '',
    public paymentType: string = '',
    public paymentTerms: string = '',
    public lcNumber: string = '',
    public invoiceNumber: string = '',
    public invoiceDate: string = '',
    public currency: string = '',
    public currencyCode: string = '',
    public amount: string = '',
    public accountNumber: string = '',
    public descriptionOfGoods: string = '',
    public marginInstruction: string = '',
    public transactionDate: string = '',
    public sgExpiryDate: string = '',
    public sgClaimExpiryDate: string = '',
    public effectiveDate: string = '',
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

export class ShippingDetails {
  constructor(
    public modeOfShipment: string = '',
    public dateOfShipment: string = '',
    public billOfLadingOrAirwayBillNo: string = '',
    public billOfLadingOrAirwayBillDate: string = '',
    public containerNumber: string = '',
    public nameOfVesselOrFlightName: string = '',
    public voyageOrFlightNo: string = '',
    public portOfLoadingOrAirportOfDeparture: string = '',
    public portOfDischargeOrAirportOfDestination: string = '',
    public placeOfIssue: string = '',
    public otherShippingDetails: string = '',
    public shippingDisclaimers: string = '',
    public shipmentMarks: string = '',
    public shipmentAgent: string = '',
  ) { }
}

export class ShippingDocumentDetails {
  constructor(
    public shippingCompanyCode: string = '',
    public consigneeCode: string = '',
    public notifyPartyCode: string = '',
    public shippingCompany = [new ShippingCompany()],
    public consignee = [new Consignee()],
    public notifyParty = [new NotifyParty()],
  ) { }
}
export class ShippingCompany {
  constructor(
    public shippingCompanyCode: string = '',
    public shippingCompanyName: string = '',
    public shippingCompanyAddress1: Address[] = [new Address(false, '')],
    public shippingCompanyAddress2: Address[] = [new Address(false, '')],
    public shippingCompanyAddress3: Address[] = [new Address(false, '')],
    public contactPersonName: string = '',
    public mobileNo: string = '',
    public email: string = '',
    public effectiveFrom: string = '',
    public effectiveTill: string = '',
  ) { }
}
export class Consignee {
  constructor(
    public consigneeCode: string = '',
    public consigneeName: string = '',
    public consigneeAddress1: Address[] = [new Address(false, '')],
    public consigneeAddress2: Address[] = [new Address(false, '')],
    public consigneeAddress3: Address[] = [new Address(false, '')],
    public contactPersonName: string = '',
    public mobileNo: string = '',
    public email: string = '',
    public effectiveFrom: string = '',
    public effectiveTill: string = '',
  ) { }
}
export class NotifyParty {
  constructor(
    public notifyPartyCode: string = '',
    public notifyPartyName: string = '',
    public notifyPartyAddress1: Address[] = [new Address(false, '')],
    public notifyPartyAddress2: Address[] = [new Address(false, '')],
    public notifyPartyAddress3: Address[] = [new Address(false, '')],
    public contactPersonName: string = '',
    public mobileNo: string = '',
    public email: string = '',
    public effectiveFrom: string = '',
    public effectiveTill: string = '',
  ) { }
}

export class SupportingDocuments {
  constructor(
    public billOfLading: boolean = false,
    public billOfLadingRefNo: string = '',
    public billOfLadingDocument: any[] = [],
    public undertaking: boolean = false,
    public undertakingRefNo: string = '',
    public undertakingDocument: any[] = [],
  ) { }
}

export class Clauses {
  constructor(
    public corporateName: string = '',
    public billOfLadingNo: string = '',
    public marksAndNo: string = '',
    public packagesNo: string = '',
    public detailsOfVessel: string = '',
    public descriptionOfGoods: string = '',
    public invoiceCcy: string = '',
    public invoiceAmount: string = '',
    public creditCcy: string = '',
    public creditAmount: string = '',
  ) { }
}

export class TermsAndCondition {
  constructor(public agreeToTermsAndCondition: boolean = false) { }
}
