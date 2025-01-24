import { DatePipe } from '@angular/common';

export class LetterOfCredit {
  constructor(
    public irrevocable = false,
    public transferable = false,
    public proformaInvoiceNo = '',
    public corporateReferenceNo = '',
    public currency = 'INR',
    public amount = '',
    public latestDateOfShipment = '',
    public minimumToleranceAmend = '',
    public maximumToleranceAmend = '',
    public notExceedingAmend= '',
    public expiryDateAmend = '',
    public minimumTolerance = '',
    public maximumTolerance = '',
    public increaseOfDocumentaryCreditAmount = '',
    public decreaseOfDocumentaryCreditAmount = '',
    public increaseOfDocumentaryCreditAmountAmend = '',
    public decreaseOfDocumentaryCreditAmountAmend = '',
    public notExceeding = '',
    public expiryDate = '',
    public placeOfExpiry = '',
    public transactionDate = '',
    public effectiveDate = '',
    public applicantName = '',
    public noOfAmendments = '0',
    public draftAt = 'Sight',
    public status = 'Authorized',
    public instructionsToBank = '',
    public letterofCreditRefNo = '',

    public letterOfCreditDetails: LetterOfCreditDetails[] = [new LetterOfCreditDetails()],
    public applicantDetails: ApplicantDetails[] = [new ApplicantDetails()],
    public beneficiaryDetails: BeneficiaryDetails[] = [new BeneficiaryDetails()],
    public paymentDetails: PaymentDetails[] = [new PaymentDetails()],
    public shippingDetails: ShippingDetails[] = [new ShippingDetails()],
    public supportingDocuments: SupportingDocuments[] = [new SupportingDocuments()],
    public clauses = [new Clauses()],
    public termsAndCondition: TermsAndCondition[] = [new TermsAndCondition()],
    public initiateType?: string,
    public issueDate?: string,
    public amends?: number,
  ) {}
}

export class LetterOfCreditDetails {
  constructor(
    public irrevocable = false,
    public transferable = false,
    public proformaInvoiceNo = '',
    public corporateReferenceNo = '',
    public currency = 'INR',
    public amount = '',
    public minimumTolerance = '',
    public maximumTolerance = '',
    public notExceeding = '',
    public expiryDate = '',
    public minimumToleranceAmend = '',
    public maximumToleranceAmend = '',
    public notExceedingAmend = '',
    public expiryDateAmend = '',
    public placeOfExpiry = '',
    public transactionDate = '',
    public effectiveDate = '',
    public increaseOfDocumentaryCreditAmount = '',
    public decreaseOfDocumentaryCreditAmount = '',
    public increaseOfDocumentaryCreditAmountAmend = '',
    public decreaseOfDocumentaryCreditAmountAmend = '',
    public additionalDocuments = '',
    public instructionsToBank = '',
    public letterofCreditRefNo = '',
  ) {}
}

export class ApplicantDetails {
  constructor(
    public applicantName = 'Pepsico',
    public applicantEmail = 'info.dxb@pepsico.in',
    public applicantMobileNo = '+91 7000000000',
    public applicantAddress = '7th Street, Near Stadium Metro Station',
    public onBehalfOf = false,
    public name = '',
    public email = '',
    public mobileNumber = '',
    public address1 = [new Address(true, '')],
    public address2 = [new Address(false, '')],
    public address3 = [new Address(false, '')],
  ) {}
}

export class Address {
  constructor(public show = true, public address = '') {}
}

export class Beneficiary{
  constructor(
    public frequencyOfExecution = '',
    public beneficiaryCode = '',
    public beneficiaryName = '',
    public email = '',
    public bankSwiftCode = '',
    public beneficiaryAddress1 = [new Address(true, '')],
    public beneficiaryAddress2 = [new Address(false, '')],
    public beneficiaryAddress3 = [new Address(false, '')],
    public country = '',
    public beneficiaryAccountNumber = '',
    public beneficiaryBankName = '',
    public beneficiaryBankAddress1 = [new Address(true, '')],
    public beneficiaryBankAddress2 = [new Address(false, '')],
    public beneficiaryBankAddress3 = [new Address(false, '')],
    public beneficiaryDetails: BeneficiaryDetails[] = [new BeneficiaryDetails()],

  ) {}
}

export class BeneficiaryDetails {
  constructor(
    public frequencyOfExecution = '',
    public beneficiaryCode = '',
    public beneficiaryName = '',
    public email = '',
    public bankSwiftCode = '',
    public beneficiaryAddress1 = [new Address(true, '')],
    public beneficiaryAddress2 = [new Address(false, '')],
    public beneficiaryAddress3 = [new Address(false, '')],
    public country = '',
    public beneficiaryAccountNumber = '',
    public beneficiaryBankName = '',
    public beneficiaryBankAddress1 = [new Address(true, '')],
    public beneficiaryBankAddress2 = [new Address(false, '')],
    public beneficiaryBankAddress3 = [new Address(false, '')],
  ) {}
}

export class PaymentDetails {
  constructor(
    public creditAvailableWith = '',
    public bankName = '',
    public bankSwiftCode = '',
    public bankAddress1 = [new Address(true, '')],
    public bankAddress2 = [new Address(false, '')],
    public bankAddress3 = [new Address(false, '')],
    public creditAvailableBy = '',
    public draftAt = 'Sight',
    public numberOfDays = '',
    public selectBeforeAfter = '',
    public document = '',
    public documentType = '',
    public deferredPaymentDetails = '',
    public mixedPaymentDetails = '',
    public confirmationInstruction = '',
    public accountNumberForCharges = '',
    public accountNumberForSettlement = '',
    public charges = [new Charges()],
  ) {}
}

export class Charges {
  constructor(
    public chargesType = '',
    public chargeDetails = '',
    public confirmation = false,
    public confirmationBourneBy = '',
    public legalization = false,
    public legalizationBourneBy = '',
    public outsideCountry = false,
    public outsideCountryBourneBy = '',
    public amendment = false,
    public amendmentBourneBy = '',
    public reimbursement = false,
    public reimbursementBourneBy = '',
  ) {}
}

export class ShippingDetails {
  constructor(
    public placeOfTakingIncharge = '',
    public modeOfShipment = '',
    public latestDateOfShipment = '',
    public partialShipment = '' ,
    public transhipment ='',
    public portAirportOfLoading = '',
    public portAirportOfDischarge = '',
    public finalDestination = '',
    public periodOfPresentation = '',
    public descriptionOfGoodsServices = '',
    public shippingMarks = '',
    public timeOfShipment = '',
    public shipmentFrom = '',
    public shipmentTo = '',
    public placeOfTakingCharge = '',
    public portOfLoading = '',
    public portOfDischarge = '',
    public goodsDescription = '',
    public termsOfShipment = '',
  ) {}
}

export class SupportingDocuments {
  constructor(
    public lcIrrevocable = false,
    public lcIrrevocableRefNo = '',
    public lcIrrevocableDocument = [],
    public proformaInvoice = false,
    public proformaInvoiceRefNo = '',
    public proformaInvoiceDocument = [],
    public insurancePolicy = false,
    public insurancePolicyRefNo = '',
    public insurancePolicyDocument = [],

    public sdproformaInvoice = false,
    public sdproformaInvoiceRefNo = '',
    public sdproformaInvoiceDocument = []
  ) {}
}

export class Clauses {
  constructor(public isClausesCheck: boolean = false, public documentMappingList: any[] = []) {}
}

export class TermsAndCondition {
  constructor(
    public agreeToTermsAndCondition = false,
    public additionalCondition = '',
    public specialCondition = '',
  ) {}
}
