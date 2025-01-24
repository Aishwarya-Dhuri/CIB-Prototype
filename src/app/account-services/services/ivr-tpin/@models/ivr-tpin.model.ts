export class IvrTpin {
  id: string;
  displayName: string;
  currentTpin: string;
  newTpin: string;
  confirmNewTpin: string;
  oneTimePassword: string;
  userId: string;
  constructor() {
    this.id = '';
    this.displayName = 'Toyota Motors';
    this.userId = '';
    this.currentTpin = '';
    this.newTpin = '';
    this.confirmNewTpin = '';
    this.oneTimePassword = '';
  }
}
