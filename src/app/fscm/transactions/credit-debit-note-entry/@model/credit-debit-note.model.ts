export class CreditDebitNote {
  constructor(
    public batchNo: string = new Date().getTime().toString(),
    public creditNoteOrDebitNote: string = 'Credit Note',
    public sponsorId: string = '',
    public sponsorCode: string = '',
    public sponsorName: string = '',
    public sellerBuyerId: string = '',
    public sellerBuyerCode: string = '',
    public sellerBuyerName: string = '',
    public productCategory: string = '',
    public programReferenceNumber: string = '',
    public entitySubCodeId: string = '',
    public entitySubCode: string = '',
    public entitySubCodeDescription: string = '',
    public invoiceNumber: string = '',
    public invoiceAmount: string = '',
    public invoiceGenerationDate: string = '',
    public invoiceDueDate: string = '',
    public creditDebitNoteDate: string = '',
    public creditDebitNoteAmount: string = '',
    public creditDebitNoteReferenceNumber: string = '',
    public creditNoteDetails: CreditNoteDetails[] = [new CreditNoteDetails()],
    public debitNoteDetails: DebitNoteDetails[] = [new DebitNoteDetails()],
    public creditDebitNoteEnrichments: CreditDebitNoteEnrichments[] = [],
  ) {}
}

export class CreditNoteDetails {
  constructor(
    public creditNoteReferenceNumber: string = '',
    public creditNoteDate: string = '',
    public allocationNumber: string = '',
    public documentType: string = '',
    public creditNoteAmount: string = '',
    public validTillDate: string = '',
    public remarks: string = '',
  ) {}
}

export class DebitNoteDetails {
  constructor(
    public debitNoteReferenceNumber: string = '',
    public debitNoteDate: string = '',
    public allocationNumber: string = '',
    public documentType: string = '',
    public debitNoteAmount: string = '',
    public validTillDate: string = '',
    public remarks: string = '',
  ) {}
}

export class CreditDebitNoteEnrichments {
  constructor() {}
}
