export class MandateFileUpload {
  public product: string;
  public productName: string;
  public file: any[];
  public suppDoc: any[];
  public corporateCode: string;
  public corporateName: string;

  constructor() {
    this.product = '';
    this.productName = '';
    this.file = [];
    this.suppDoc = [];
    this.corporateCode = '400401';
    this.corporateName = 'Toyota Automotive Div';
  }
}
