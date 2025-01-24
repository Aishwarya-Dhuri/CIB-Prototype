export class SuspendAccount {
  constructor(
    public suspendedBy: string = 'Days',
    public days: string = '',
    public suspendedFrom: string = '',
    public suspendedTill: string = '',
    public remark: string = '',
  ) {}
}
