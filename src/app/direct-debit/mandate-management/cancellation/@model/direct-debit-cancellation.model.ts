export class DirectDebitCancellation {
  cancellationRemarks?: any;
  uploadedFileName?: string;
  signatureFileName?: string;
  signatureFileSize?: number;
  constructor() {
    this.cancellationRemarks = '';
    this.uploadedFileName = '';
    this.signatureFileName = '';
    this.signatureFileSize = 0;
  }
}
