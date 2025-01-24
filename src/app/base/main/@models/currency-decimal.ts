export interface CurrencyDecimal_Response {
  responseStatus: {
    message: string;
    dataMap: {
      currencyMap: {
        [currency: string]: number;
      };
    };
  };
  entityIdentifier: string;
  entity: string;
  loggable: boolean;
}
