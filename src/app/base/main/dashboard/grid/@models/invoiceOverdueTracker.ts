import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface InvoiceOverdueTracker_Request {
  dataMap: { dayRanges: string };
}

export interface InvoiceOverdueTrackerDetails_Request {
  dataMap: {
    entityName: string;
    filters: {
      name: string;
      value: string;
      type: string;
      displayName: string;
    }[];
    pageNumber: number;
  };
}

export interface InvoiceOverdueTracker_Response {
  responseStatus: ResponseStatus;
  dataMap: { [dateRange: string]: number };
  entityIdentifier: string;
  entity: string;
  loggable: boolean;
}

export interface InvoiceOverdueTrackerDetails_Response {
  responseStatus: ResponseStatus;
  headers: InvoiceOverdueTrackerDetailsHeader[];
  dataList: string[][];
  entityIdentifier: string;
  loggable: boolean;
}

export interface InvoiceOverdueTrackerDetailsHeader {
  displayName: string;
  type: string;
  method: string;
  isDisplay: string;
}
