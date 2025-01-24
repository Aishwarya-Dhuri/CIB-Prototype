export class NewAccountInstructions {
  constructor(
    public movementType: string = '',
    public movementIn: string = '',
    public value: string = '',
    public accountNo: string = '',
    public priority: string = '',
    public narration: string = '',
    public remarks: string = '',
    public currency: string = '',
    public minimumBal: string = '',
    public actions = []
  ) { }
}
