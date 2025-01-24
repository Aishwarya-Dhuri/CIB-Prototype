export class StopPaymentRequest {
  public reason: string;
  public startDate: string;
  public endDate: string;
  public holdDays: string;

  constructor() {
    this.reason = '';
    this.startDate = '';
    this.endDate = '';
    this.holdDays = '';
  }
}
