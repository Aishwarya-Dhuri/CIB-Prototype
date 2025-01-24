export class DebitCardControl {
  public id: string;
  public cardNumber: string;
  public cardType: string;
  public primaryAccountId: string;
  public primaryAccountDisplayName: string;
  public embossedName: string;
  public status: string;
  public cardIssuanceDate: string;
  public expiryDate: string;
  public changeInfo: string;
  public isBlockCard: boolean;
  public changedTabs: string[];

  public changePin: ChangePin[];
  public switchPrimaryAccount: SwitchPrimaryAccount[];
  public blockCard: BlockCard[];
  public cardActiveInactive: CardActiveInactive[];
  public limitControl: LimitControl[];
  public merchantCardControlGroupSetting: MerchantCardControlGroupSetting[];

  constructor() {
    this.id = '';
    this.cardNumber = '';
    this.cardType = '';
    this.primaryAccountId = '';
    this.primaryAccountDisplayName = '';
    this.embossedName = '';
    this.status = '';
    this.cardIssuanceDate = '';
    this.expiryDate = '';
    this.changeInfo = '';
    this.changedTabs = [];
    this.isBlockCard = false;
    this.changePin = [new ChangePin()];
    this.switchPrimaryAccount = [new SwitchPrimaryAccount()];
    this.blockCard = [new BlockCard()];
    this.cardActiveInactive = [new CardActiveInactive()];
    this.limitControl = [new LimitControl()];
    this.merchantCardControlGroupSetting = [new MerchantCardControlGroupSetting()];
  }
}
export class ChangePin {
  public isChanged: boolean;
  public displayName: string;
  public key: string;
  public newPin: string;
  public confirmPin: string;
  constructor() {
    this.isChanged = false;
    this.displayName = 'Change Pin';
    this.key = 'changePin';
    this.newPin = '';
    this.confirmPin = '';
  }
}
export class SwitchPrimaryAccount {
  public primaryAccountId: string;
  public primaryAccountDisplayName: string;
  public isChanged: boolean;
  public displayName: string;
  public key: string;
  constructor() {
    this.primaryAccountId = '';
    this.primaryAccountDisplayName = '';
    this.isChanged = false;
    this.displayName = 'Switch Primary Account';
    this.key = 'switchPrimaryAccount';
  }
}
export class BlockCard {
  public isBlockCard: boolean;
  public reasonForBlock: string;
  public isReplacementRequired: boolean;
  public isReportFraud: boolean;
  public isRaiseDispute: boolean;
  public isChanged: boolean;
  public displayName: string;
  public key: string;
  constructor() {
    this.isBlockCard = false;
    this.reasonForBlock = '';
    this.isReplacementRequired = false;
    this.isReportFraud = false;
    this.isRaiseDispute = false;
    this.isChanged = false;
    this.displayName = 'Block Card / Report Fraud / Dispute';
    this.key = 'blockCard';
  }
}
export class CardActiveInactive {
  isCardStatus: boolean;
  cardStatus: string;
  public isChanged: boolean;
  public displayName: string;
  public key: string;
  constructor() {
    this.isCardStatus = false;
    this.cardStatus = '';
    this.isChanged = false;
    this.displayName = 'Debit Card Active / Inactive';
    this.key = 'cardActiveInactive';
  }
}
export class LimitControl {
  public isCardStatus: boolean;
  public isDomesticAtmLimit: boolean;
  public domesticAtmLimit: string;
  public isDomesticPosLimit: boolean;
  public domesticPosLimit: string;
  public isDomesticMerchantOutletLimit: boolean;
  public domesticMerchantOutletLimit: string;
  public isDomesticContactlessLimit: boolean;
  public domesticContactlessLimit: string;
  public isInternationalAtmLimit: boolean;
  public internationalAtmLimit: string;
  public isInternationPosLimit: boolean;
  public internationalPosLimit: string;
  public isInternationalMerchantOutletLimit: boolean;
  public internationalMerchantOutletLimit: string;
  public isInternationalContactlessLimit: boolean;
  public internationalContactlessLimit: string;
  public isChanged: boolean;
  public displayName: string;
  public key: string;
  constructor() {
    this.isCardStatus = false;
    this.isDomesticAtmLimit = false;
    this.domesticAtmLimit = '';
    this.isDomesticPosLimit = false;
    this.domesticPosLimit = '';
    this.isDomesticMerchantOutletLimit = false;
    this.domesticMerchantOutletLimit = '';
    this.isDomesticContactlessLimit = false;
    this.domesticContactlessLimit = '';
    this.isInternationalAtmLimit = false;
    this.internationalAtmLimit = '';
    this.isInternationPosLimit = false;
    this.internationalPosLimit = '';
    this.isInternationalMerchantOutletLimit = false;
    this.internationalMerchantOutletLimit = '';
    this.isInternationalContactlessLimit = false;
    this.internationalContactlessLimit = '';
    this.isChanged = false;
    this.displayName = 'Card / Limit Control';
    this.key = 'limitControl';
  }
}
export class MerchantCardControlGroupSetting {
  public isAutomobileAndTransportation: boolean;
  public isCommercialAndBusinessPayments: boolean;
  public isFoodAndDepartmentStore: boolean;
  public isFuel: boolean;
  public isGovernmentServices: boolean;
  public isHotelAmusementAndEntertainment: boolean;
  public isMiscellaneous: boolean;
  public isTelecomAndUtilities: boolean;
  public isToysDepartment: boolean;
  public isChanged: boolean;
  public displayName: string;
  public key: string;
  constructor() {
    this.isAutomobileAndTransportation = false;
    this.isCommercialAndBusinessPayments = false;
    this.isFoodAndDepartmentStore = false;
    this.isFuel = false;
    this.isGovernmentServices = false;
    this.isHotelAmusementAndEntertainment = false;
    this.isMiscellaneous = false;
    this.isTelecomAndUtilities = false;
    this.isToysDepartment = false;
    this.isChanged = false;
    this.displayName = 'Merchant Card Control Group Setting';
    this.key = 'merchantCardControlGroupSetting';
  }
}
