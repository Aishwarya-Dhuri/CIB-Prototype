import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CorporateProductService {
  selectedGroup: any;

  selectedCorporate: any;

  insights: any[] = [
    {
      icon: 'fa-info-circle',
      label: 'Four accounts were added on 12 OCT 2021.',
    },
    {
      icon: 'fa-info-circle',
      label: 'RM details have been updated',
    },
    {
      icon: 'fa-info-circle',
      label: 'Your corporate category has been GOLD for past 5 years.',
    },
    {
      icon: 'fa-info-circle',
      label: 'Two corporates have been given credit line enhancements in the past quarter',
    },
  ];

  constructor() {}
}
