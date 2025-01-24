export class StopPaymentRevoke {
  public releaseRemarks: string

  constructor(
    public stopPayRevokeDate: string = ''
  ) {
    this.releaseRemarks = ''
  }
}
