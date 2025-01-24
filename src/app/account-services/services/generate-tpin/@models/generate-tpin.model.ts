export class GenerateTpin {
  id: string;
  displayName: string;
  currentTpin: string;
  Tpin: string;
  confirmNewTpin: string;
  oneTimePassword: string;
  userId: string;
  constructor() {
    this.id = '';
    this.displayName = 'Toyota Motors';
    this.userId = '';
    this.currentTpin = '';
    this.Tpin = '';
    this.confirmNewTpin = '';
    this.oneTimePassword = '';
  }
}
