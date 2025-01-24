export interface GetCorporatePasswordPolicy_Response {
  responseStatus: Response;
  dataMap: PasswordPolicy;
  entityIdentifier: string;
  entity: string;
  loggable: boolean;
}

export interface PasswordPolicy {
  minimumPasswordLength: string;
  isCaseSensitive: string;
  minimumDigits: string;
  maximumDigits: string;
  minimumCharacters: string;
  maximumSpecialCharacters: string;
  maximumPasswordLength: string;
  maximumCharacters: string;
  otp: string;
  minimumSpecialCharacters: string;
}
