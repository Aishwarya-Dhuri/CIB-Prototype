import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface CorporatePasswordPolicy_Response {
  responseStatus: ResponseStatus;
  dataMap: {
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
  };
  entityIdentifier: string;
  entity: string;
  loggable: boolean;
}
