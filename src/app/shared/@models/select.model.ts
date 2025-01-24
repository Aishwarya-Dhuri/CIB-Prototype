export class GroupSelect {
  id: string;
  displayName: string;
  items?: Select[];

  constructor() {
    this.id = '';
    this.displayName = '';
    this.items = [];
  }
}

export class Select {
  id: string;
  displayName: string;
  enrichments?: any;

  constructor() {
    this.id = '';
    this.displayName = '';
    this.enrichments = {};
  }
}
