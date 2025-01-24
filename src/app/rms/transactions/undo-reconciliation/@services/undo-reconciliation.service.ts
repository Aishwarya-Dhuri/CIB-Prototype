import { Injectable } from '@angular/core';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class UndoReconciliationService {
  // searchFilters: any = {
  //   corporateClientName: '',
  //   program: '',
  //   accountNumber: '',
  // };

  // invoiceFilters: any = [
  //   {
  //     displayName: 'Invoice Number',
  //     value: '',
  //     show: true,
  //   },
  //   {
  //     displayName: 'Invoice Amount',
  //     value: '',
  //     show: true,
  //   },
  //   {
  //     displayName: 'Invoice Date',
  //     value: '',
  //     show: true,
  //   },
  //   {
  //     displayName: 'Invoice Due Date',
  //     value: '',
  //     show: false,
  //   },
  // ];

  // paymentFilters: any = [
  //   {
  //     displayName: 'Transaction Ref No.',
  //     value: '',
  //     show: true,
  //   },
  //   {
  //     displayName: 'Payment Amount',
  //     value: '',
  //     show: true,
  //   },
  //   {
  //     displayName: 'Payment Date',
  //     value: '',
  //     show: true,
  //   },
  //   {
  //     displayName: 'Payment Method',
  //     value: '',
  //     show: false,
  //   },
  // ];

  searchFilters: Filter[] = [];
  invoiceFilter: Filter[] = [];
  paymentFilter: Filter[] = [];

  constructor() {}
}
