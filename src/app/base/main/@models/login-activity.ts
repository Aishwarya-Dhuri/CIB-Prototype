import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface LastLoginActivity_Request {
  dataMap: { topRecords: string };
}

export interface LastLoginActivity_Response {
  responseStatus: ResponseStatus;
  dataList: string[][];
  currentLogin: string;
  lastFailedLogin: string;
  lastLogin: string;
}
