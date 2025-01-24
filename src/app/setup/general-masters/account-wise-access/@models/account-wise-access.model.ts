export class AccountWiseAccess {
  constructor(
    public noOfUsers: string = '',
    public batchId: string = '',
    public noOfProducts: string = '',
    public noOfAccounts: string = '',
    public accessType: string = '',
    public mappingDetList: AccountWiseAccessDet[] = [],
  ) {}
}
export class AccountWiseAccessDet {
  constructor(
    public cashproProductName: string = '',
    public cashproProductId: string = '',
    public userId: string = '',
    public subProductName: string = '', //-- first child
    public subProductId: string = '', //-- first child
    public serviceTemplateId: string = '', //-- second child
    public level: number = 0,
    public accountList: AccountWiseAccessAccount[] = [],
  ) {}
}
export class AccountWiseAccessAccount {
  constructor(public accountId: string = '') {}
}

const x = {
  noOfUsers: 2,
  batchId: '1234',
  noOfProducts: 2,
  noOfAccounts: 12,
  accessType: 'USERS_TO_ACCOUNTS',
  mappingDetList: [
    {
      cashproProductName: 'Payments',
      cashproProductKey: 'PAYMENTS',
      ccashproProductId: 1645615402059,
      data: 3,
      level: 0,
      subProductName: '',
      subProductKet: '',
      subProductId: '',
      serviceTemplateName: '',
      serviceTemplateKey: '',
      serviceTemplateId: '',
      accountList: [
        { uaid: '777000003002-MYR', accountType: 'CURRENT', aliasName: 'ACC02', currency: 'MYR' },
        { uaid: '777003000003-MYR', accountType: 'LOAN', aliasName: 'ACC01', currency: 'MYR' },
        { uaid: '777003004-MYR', accountType: 'CURRENT', aliasName: 'ACC01', currency: 'MYR' },
      ],
    },
    {
      cashproProductName: 'Payments',
      cashproProductKey: 'PAYMENTS',
      ccashproProductId: 1645615402059,
      subProductName: 'Sub Product wise Account Mapping',
      subProductKet: 'SUBPRODUCTWISEACCOUNTMAPPING',
      subProductId: 1645615402063,
      data: 3,
      level: 1,
      serviceTemplateName: '',
      serviceTemplateKey: '',
      serviceTemplateId: '',
      accountList: [
        { uaid: '777003000003-MYR', accountType: 'LOAN', aliasName: 'ACC01', currency: 'MYR' },
        { uaid: '777000003002-MYR', accountType: 'CURRENT', aliasName: 'ACC02', currency: 'MYR' },
        { uaid: '777003004-MYR', accountType: 'CURRENT', aliasName: 'ACC01', currency: 'MYR' },
      ],
    },
    {
      cashproProductName: 'Payments',
      cashproProductKey: 'PAYMENTS',
      ccashproProductId: 1645615402059,
      subProductName: 'Sub Product wise Account Mapping',
      subProductKet: 'SUBPRODUCTWISEACCOUNTMAPPING',
      subProductId: 1645615402063,
      serviceTemplateName: 'Sub Product wise Account Mapping',
      serviceTemplateKey: 'SUBPRODUCTWISEACCOUNTMAPPING',
      serviceTemplateId: 1645615402063,
      data: 3,
      level: 2,
      accountList: [
        { uaid: '777003000003-MYR', accountType: 'LOAN', aliasName: 'ACC01', currency: 'MYR' },
        { uaid: '777000003002-MYR', accountType: 'CURRENT', aliasName: 'ACC02', currency: 'MYR' },
        { uaid: '777003004-MYR', accountType: 'CURRENT', aliasName: 'ACC01', currency: 'MYR' },
      ],
    },
    {
      cashproProductName: 'Payments',
      cashproProductKey: 'PAYMENTS',
      ccashproProductId: 1645615402059,
      subProductName: 'Sub Product wise Account Mapping',
      subProductKet: 'SUBPRODUCTWISEACCOUNTMAPPING',
      subProductId: 1645615402063,
      serviceTemplateName: 'Sub Product wise Account Mapping',
      serviceTemplateKey: 'SUBPRODUCTWISEACCOUNTMAPPING',
      serviceTemplateId: 1645615402063,
      data: 3,
      level: 2,
      accountList: [
        { uaid: '777003000003-MYR', accountType: 'LOAN', aliasName: 'ACC01', currency: 'MYR' },
        { uaid: '777000003002-MYR', accountType: 'CURRENT', aliasName: 'ACC02', currency: 'MYR' },
        { uaid: '777003004-MYR', accountType: 'CURRENT', aliasName: 'ACC01', currency: 'MYR' },
      ],
    },
  ],
};
