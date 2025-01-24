import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface Summary_Request {
  dataMap: { program?: string; dataMap?: string };
}

export interface Summary_Response {
  responseStatus?: ResponseStatus;
  dataMap?: {
    data?: Summary[];
  };
  entityIdentifier?: string;
  entity?: string;
  loggable?: boolean;
}

export interface Summary {
  key?: string;
  type?: string;
  yAxis?: number;
  values?: {
    x?: number;
    y?: number;
    value?: number;
    key?: string;
    label?: string;
    link?: string;
  }[];
}
