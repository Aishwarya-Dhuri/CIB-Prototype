import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface LoginActivity {
  responseStatus: ResponseStatus;
  dataList: string[][];
  currentLogin: string;
  lastFailedLogin: string;
  lastLogin: string;
}
