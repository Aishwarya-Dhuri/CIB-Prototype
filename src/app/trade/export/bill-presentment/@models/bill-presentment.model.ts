export class BillPresentment {
  constructor(
    public typeOfBillPresentment: string = '',
    public type: string = '',
    public lcNumber: string = '',
    public lcIssueDate: string = '',
    public buyerName: string = '',
    public billDate: string = '',
    public billCurrency: string = '',
    public billAmount: string = '',
    public status: string = '',
    public initiateType: string = '',
    public beneficiaryOrExporterDetails = [new BeneficiaryOrExporterDetails()],
    public tradeBillDetails = [new TradeBillDetails()],
    public paymentDetails = [new PaymentDetails()],
    public shippingDetails = [new ShippingDetails()],
    public supportingDocuments = [new SupportingDocuments()],
    public collectionInstruction = [new CollectionInstruction()],
    public clauses = [new Clauses()],
    public termsAndCondition = [new TermsAndCondition()],
  ) {}
}
export class BeneficiaryOrExporterDetails {
  constructor(
    public name: string = '',
    public address1: string = '',
    public address2: string = '',
    public address3: string = '',
    public mobileNumber: string = '',
    public email: string = '',
    public ieCode: string = '',
    public cifId: string = '',
  ) {}
}
export class TradeBillDetails {
  constructor(
    public typeOfBillPresentment: string = '',
    public type: string = '',
    public buyerCode: string = '',
    public buyerName: string = '',
    public buyerAddress: string = '',
    public country: string = '',
    public pinCode: string = '',
    public mobileNumber: string = '',
    public email: string = '',
    public bankSwiftCode: string = '',
    public bankName: string = '',
    public bankAddress: string = '',
    public buyerAccountNumber: string = '',
    public lcNumber: string = '',
    public lcOriginalNumber: string = '',
    public lcIssueDate: string = '',
    public lcCurrency: string = '',
    public lcAmount: string = '',
    public lcAvailableAmount: string = '',
    public billCurrency: string = '',
    public billAmount: string = '',
    public invoiceNumber: string = '',
    public billDate: string = '',
    public billingAddress: string = '',
    public deliveryAddress: string = '',
    public remarks: string = '',
  ) {}
}
export class PaymentDetails {
  constructor(
    public accountToBeCredited: string = '',
    public accountToBeDebitForCharges: string = '',
    public debitAccountBalance: string = '',
    public tenorInDays: string = '',
    public dueDateIndicator: string = '',
    public documentName: string = '',
  ) {}
}
export class ShippingDetails {
  constructor(
    public shippingDate: string = '',
    public shipmentFrom: string = '',
    public shipmentTo: string = '',
    public portOfLoadingOrAirportDeparture: string = '',
    public portOfDischargeOrAirportOfDestination: string = '',
    public placeOfTakingInChargeOrDispatchFromOrPlaceOfReceipt: string = '',
    public placeOfFinalDestinationOrForFinalDestinationOrForTransportationToOrPlaceOfDelivery: string = '',
    public vesselName: string = '',
    public reasonsForLateSubmissionOfDocuments: string = '',
    public descriptionOfGoods: string = '',
    public remark: string = '',
  ) {}
}
export class SupportingDocuments {
  constructor(
    public isSignedBillsOfLading: boolean = false,
    public signedBillOriginalCount: string = '',
    public signedBillCopyCount: string = '',
    public signedBillRefNo: string = '',
    public signedBillDocument: any[] = [],

    public isCertificateOfOrigin: boolean = false,
    public certificateOfOriginOriginalCount: string = '',
    public certificateOfOriginCopyCount: string = '',
    public certificateOfOriginRefNo: string = '',
    public certificateOfOriginDocument: any[] = [],

    public isAirwayBill: boolean = false,
    public airwayBillOriginalCount: string = '',
    public airwayBillCopyCount: string = '',
    public airwayBillRefNo: string = '',
    public airwayBillDocument: any[] = [],

    public isBeneficiaryCertificate: boolean = false,
    public beneficiaryCertificateOriginalCount: string = '',
    public beneficiaryCertificateCopyCount: string = '',
    public beneficiaryCertificateRefNo: string = '',
    public beneficiaryCertificateDocument: any[] = [],

    public isBillPresentDAPay26: boolean = false,
    public billPresentDAPay26OriginalCount: string = '',
    public billPresentDAPay26CopyCount: string = '',
    public billPresentDAPay26RefNo: string = '',
    public billPresentDAPay26Document: any[] = [],
  ) {}
}
export class CollectionInstruction {
  constructor(
    public specialInstruction: string = '',
    public contactName: string = '',
    public contactNumber: string = '',
    public collectionInstructions: [] = [],
  ) {}
}
export class Clauses {
  constructor(public isClausesCheck: boolean = false, public documentMappingList: any[] = []) {}
}
export class TermsAndCondition {
  constructor(public agreeToTermsAndCondition: boolean = false) {}
}
