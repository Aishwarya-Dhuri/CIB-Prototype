import { ResponseStatus } from 'src/app/shared/@models/response-status';
export interface Favourite_Response {
  type: string;
  isLoggable: boolean;
  responseStatus: ResponseStatus;
  name: string;
  state: string;
  entityIdentifier: string;
  entity: string;
}
