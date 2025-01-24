import { Injectable } from '@angular/core';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class ManualReconciliationService {
  searchFilters: Filter[] = [];
  invoiceFilters: Filter[] = [];
  paymentFilters: Filter[] = [];

  constructor() {}
}
