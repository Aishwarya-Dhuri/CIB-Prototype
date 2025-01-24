export class AccountInstructions {
  constructor(
    public momentType: string = '',
    public momentIn: string = '',
    public value: string = '',
    public accountNo: string = '',
    public priority: string = '',
    public narration: string = '',
    public remark: string = '',
  ) {}
}
