export class ChequePrintingReconcile {
  batchNumber: string;
  corporateProduct: string;
  activationDate: string;
  totalInstrument: string;
  totalAmount: string;
  inventoryStartNo: string;
  inventoryEndNo: string;
  totalInventory: string;
  instrumentDate: string;
  remarkForSpoilUnsed: string;
  accountNumber: string;
  routingCode: string;
  transactionCode: string;
  branch: string;
  printFormat: string;

  constructor() {
    this.batchNumber = '1660820406277'
    this.corporateProduct = 'SINGLE'
    this.activationDate = '18-Aug-2022'
    this.totalInstrument = '1'
    this.totalAmount = '1,000.00'
    this.inventoryStartNo = ''
    this.inventoryEndNo = ''
    this.totalInventory = ''
    this.instrumentDate = ''
    this.remarkForSpoilUnsed = ''
    this.accountNumber = '151111000001-INR'
    this.routingCode = '784456224'
    this.transactionCode = '0000000012'
    this.branch = '151111HUB'
    this.printFormat = 'Three Cheques Per Page Layout'
  }
}
