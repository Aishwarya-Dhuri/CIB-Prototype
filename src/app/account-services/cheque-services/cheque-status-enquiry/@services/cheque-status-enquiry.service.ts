import { Injectable } from '@angular/core';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class ChequeStatusEnquiryService {
  inquiryType: string = 'Cheque Issued';
  selectedFilters: Filter[] = [];

  constructor() {}
}
