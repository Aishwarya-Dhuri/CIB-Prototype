import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface PhishingDetails_Request {
  dataMap: any;
}

export interface PhishingDetails_Response {
  responseStatus: ResponseStatus;
  dataMap: {
    loginId: string;
    categoryCode: string;
    phishingImageFileName: string;
    message: string;
    categoryName: string;
    phishingImageId: string;
    systemGeneratedImageFileName: string;
    appSettingId: string | number;
  };
  entityIdentifier: string;
  entity: string;
  loggable: boolean;
}
