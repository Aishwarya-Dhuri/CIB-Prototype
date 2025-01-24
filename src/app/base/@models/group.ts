import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface Group_Response {
  responseStatus: ResponseStatus;
  dataList: { id: string; displayName: string }[];
  entityIdentifier: string;
  loggable: boolean;
}
