import { DatePipe } from '@angular/common';

export class OutwardTelegraphicTransfer {
  HSCode: any;
  transaction?: PaymentDetailsCurrencyAndAmount[]
  constructor(
    public irrevocable = false,
    public transferable = false,
    public proformaInvoiceNo = '',
    public corporateReferenceNo = '',

    public corpRefNo = '',
    public currency = 'INR',
    public amount = '',
    public minimumTolerance = '',
    public maximumTolerance = '',
    public notExceeding = '',
    public expiryDate = '',
    public placeOfExpiry = '',
    public transactionDate = '',
    public effectiveDate = '',
    public applicantName = '',
    public beneficiaryName = '',
    public noOfAmendments = '0',
    public draftAt = 'Sight',
    public status = 'Authorized',
    public beneficiaryBankName = '',
    public letterOfCreditDetails: LetterOfCreditDetails[] = [new LetterOfCreditDetails()],
    public applicantDetails: ApplicantDetails[] = [new ApplicantDetails()],
    public beneficiaryDetails: BeneficiaryDetails[] = [new BeneficiaryDetails()],
    public paymentDetails: PaymentDetails[] = [new PaymentDetails()],
    public shippingDetails: ShippingDetails[] = [new ShippingDetails()],
    public supportingDocuments: SupportingDocuments[] = [new SupportingDocuments()],
    public clauses = [new Clauses()],
    public termsAndCondition: TermsAndCondition[] = [new TermsAndCondition()],
    public billDetails: BillDetails[] = [new BillDetails()],
    public financeDetails: FinanceDetails[] = [new FinanceDetails()],
    public fxRate: FxRate[] = [new FxRate()],
    public initiateType?: string,
    public issueDate?: string,
    public amends?: number,
  ) {
    this.transaction = []
  }
}


export class PaymentDetailsCurrencyAndAmount {
  initActions?: any;

  constructor(
    public id: string = new Date().getTime().toString(),
    public currency = '',
    public debitAmount = '',
  ) { }
}

export class LetterOfCreditDetails {
  HSCode: any;
  constructor(
    public irrevocable = false,
    public transferable = false,
    public corporateReferenceNo = '',
    public currency = 'INR',
    public minimumTolerance = '',
    public maximumTolerance = '',
    public notExceeding = '',
    public expiryDate = '',
    public placeOfExpiry = '',
    public transactionDate = '',
  ) { }
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
  ) { }
}

export class Address {
  constructor(public show = true, public address = '') { }
}

export class BeneficiaryDetails {
  constructor(
    public frequencyOfExecution = '',
    public beneficiaryCode = '',
    public beneficiaryName = '',
    public HSCode = '',
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
    public intermediarySwiftCode = '',
    public intermediaryBankName = '',
    public intermediaryBankAddress1 = [new Address(true, '')],
    public intermediaryBankAddress2 = [new Address(false, '')],
    public intermediaryBankAddress3 = [new Address(false, '')],
  ) { }
}

export class FinanceDetails {
  constructor(
    public creditAccNo = '',
    public interestRate = '',
    public tenorInDays = '',
    public restByLoan = '',
    public remarks = '',
  ) { }
}

export class FxRate {
  constructor(
    public fxDealNumber1 = '',
    public fxRate1 = '',
    public fxDealNumber2 = '',
    public fxRate2 = '',
    public fxDealNumber3 = '',
    public fxRate3 = '',
  ) { }
}

export class PaymentDetails {
  constructor(
    public id: string = '',
    public creditAvailableWith = '',
    public bankName = '',
    public bankSwiftCode = '',
    public bankAddress1 = [new Address(true, '')],
    public bankAddress2 = [new Address(false, '')],
    public bankAddress3 = [new Address(false, '')],
    public creditAvailableBy = '',
    public draftAt = '100% Debit',
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
    public effectiveDate = '',
    public selectedPayableCurrencyId = '',
    public selectedPayableCurrencyName = '',
    public payableAmount = '',
    public selectedDebitAccountNo = '',
    public selectedDebitAmountPayableCurrency = '',
    public debitAmtInPayableCcy = '',
    public corpRefNo = '',
    public paymentTerms = '',
    public headerFields = []
  ) {
  }
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
  ) { }
}

export class ShippingDetails {
  constructor(
    public placeOfTakingIncharge = '',
    public modeOfShipment = '',
    public latestDateOfShipping = '',
    public partialShipment = '',
    public transhipment = '',
    public portAirportOfLoading = '',
    public portAirportOfDischarge = '',
    public finalDestination = '',
    public periodOfPresentation = '',
    public descriptionOfGoodsServices = '',
    public shippingMarks = '',
    public timeOfShipment = '',
  ) { }
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
    public suppDocuments = [],
  ) { }
}

export class Clauses {
  constructor(public isClausesCheck: boolean = false, public documentMappingList: any[] = []) { }
}

export class TermsAndCondition {
  constructor(
    public agreeToTermsAndCondition = false,
    public additionalCondition = '',
    public specialCondition = '',
  ) { }
}

export class BillDetails {
  constructor(
    public proformaInvoiceNo = '',
    public hsCode = '',
    public deliveryTerm = '',
    public shipmentFrom = '',
    public shipmentTo = '',
    public foreignBankCharges = '',
    public descriptionofGoods = '',
    public billOfLadingAwbNo = '',
    public blAwbDate = '',
    public invoiceDate = '',
    public invoiceDueDate = '',
  ) { }
}
