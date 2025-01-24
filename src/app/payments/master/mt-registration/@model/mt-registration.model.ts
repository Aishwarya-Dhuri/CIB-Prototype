export class MTRegistrationModel {
  constructor(
    public messageType: string = '',
    public statementType: string = '',
    public channel: string = '',
    public isConversionRequired: boolean = false,
    public conversionFormat: string = '',
    public isAccounts: boolean = true,
    public isVirtualAccounts: boolean = false,
    public tag28Logic: string = 'Existing Logic',

    public outgoingBank: OutgoingBankModel[] = [new OutgoingBankModel()],
    public receivingBank: ReceivingBankModel[] = [new ReceivingBankModel()],
    public frequency: FrequencyModel[] = [new FrequencyModel()],
    public tagMapping: TagMapping[] = [new TagMapping()],
    public accountStatement: AccountStatementModel[] = [new AccountStatementModel()],
    public virtualAccountFrequency: VirtualAccountFrequency[] = [new VirtualAccountFrequency()],
  ) {}
}

class OutgoingBankModel {
  constructor(
    public bicCode: string = '',
    public bankName: string = '',
    public account: string = '',
    public accountIdentification: string = '',
  ) {}
}

class ReceivingBankModel {
  constructor(
    public code: string = '',
    public bankName: string = '',
    public account: string = '',
    public accountIdentification: string = '',
  ) {}
}

class FrequencyModel {
  constructor(
    public frequencyType: string = 'Daily',
    public startTime: string = '',
    public endTime: string = '',
    public frequency: string = '',
    public startDate: string = '',
    public endDate: string = '',
    public day: string = '',
    public date: string = '',
  ) {}
}

class AccountStatementModel {
  constructor(
    public accountNumber: string = '',
    public recipents: string = '',
    public statementType: string = '',
  ) {}
}

class TagMapping {
  constructor(
    public refForAccountOwner: string = '',
    public refForAccountServicingInstitution: string = '',
    public supplementaryDetails: string = '',
    public line1: string = '',
    public line2: string = '',
    public line3: string = '',
    public line4: string = '',
    public line5: string = '',
    public line6: string = '',
  ) {}
}

class VirtualAccountFrequency {
  constructor(
    public frequencyType: string = 'Daily',
    public startTime: string = '',
    public endTime: string = '',
    public frequency: string = '',
    public startDate: string = '',
    public endDate: string = '',
    public day: string = '',
    public date: string = '',
  ) {}
}
