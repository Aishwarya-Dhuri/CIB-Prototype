import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileUploadLogService {
  paymentMethod: string = '';

  selectedFilters: any[] = [];

  constructor() {}
}
