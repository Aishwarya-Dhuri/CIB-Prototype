import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface UserPersonalizedDetails_Request {
  dataMap: {
    moduleId: string;
    widgetOrder?: WidgetOrder[];
  };
}

export interface UserPersonalizedDetails_Response {
  responseStatus: ResponseStatus;
  dataList: { id?: string; displayName?: string }[];
  entityIdentifier: string;
  loggable: boolean;
}

export interface WidgetOrder {
  aliasName?: string;
  sizeY?: number;
  sizeX?: number;
  type?: string;
  id?: string;
  filters?: {
    name?: string;
    value?: { selectedAccNo?: string };
  };
  maxSizeX?: number;
  maxSizeY?: number;
  minSizeY?: number;
  minSizeX?: number;
  row?: number;
  col?: number;
}
