import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface Programs_Request {
  filters: ProgramFilter[];
}

export interface ProgramFilter {
  name: string;
  value: string;
  type: string;
}

export interface Programs_Response {
  responseStatus: ResponseStatus;
  dataList: Program[];
  entityIdentifier: string;
  loggable: boolean;
}

export interface Program {
  id: string;
  displayName: string;
  enrichments: {
    parentTemplateId: string;
    programRefNo: string;
    serviceTemplateId: string;
  };
}
