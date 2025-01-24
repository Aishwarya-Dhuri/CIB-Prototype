import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AgGridListingComponent } from '../../../../shared/@components/ag-grid-listing/ag-grid-listing.component';
import { NgForm } from '@angular/forms';
import { ToasterService } from '../../../../shared/@services/toaster.service';

@Injectable({
  providedIn: 'root',
})
export class VaIssuanceSummaryService {
  selectedAccount: any;
  selectedSubEntity: any;
  selectedVA: any;
  selectedCorporate: any;

  constructor(private toasterService: ToasterService) {}

  getContactColDef(): Observable<any[]> {
    const contactColDef = [
      { headerName: 'Sr. No ', field: 'srNo' },
      { headerName: 'Contact Person Name', field: 'contactDetName' },
      { headerName: 'Designation', field: 'contactDetDesignation' },
      { headerName: 'Email Id', field: 'contactDetEmail' },
      { headerName: 'Telephone Number', field: 'contactDetMobile' },
      { cellRenderer: 'actionCellRenderer', field: 'actions', headerName: 'Actions' },
    ];
    return of(contactColDef);
  }

  getOverrideInData(): Observable<any[]> {
    const overrideInData = [
      { id: 'ADHOCLIMITINPERCENT', displayName: '% Limit above Allocate Amt' },
      { id: 'ADHOCLIMIT', displayName: 'Actual Amt above Allocate Amt' },
    ];
    return of(overrideInData);
  }

  getLimitPeriodData(): Observable<any[]> {
    const limitPeriodData = [
      { id: 'Daily', displayName: 'Daily' },
      { id: 'Weekly', displayName: 'Weekly' },
      { id: 'Monthly', displayName: 'Monthly' },
    ];
    return of(limitPeriodData);
  }

  getLimitPeriodDayData(): Observable<any[]> {
    const limitPeriodDayData = [
      { id: 'Sun', displayName: 'Sun' },
      { id: 'Mon', displayName: 'Mon' },
      { id: 'Tue', displayName: 'Tue' },
      { id: 'Wed', displayName: 'Wed' },
      { id: 'Thu', displayName: 'Thu' },
      { id: 'Fri', displayName: 'Fri' },
      { id: 'Sat', displayName: 'Sat' },
    ];
    return of(limitPeriodDayData);
  }

  getLimitPeriodDate(): Observable<any[]> {
    const limitPeriodDateData = [];
    for (let i = 1; i <= 31; i++) {
      limitPeriodDateData.push({ id: i + '', displayName: i + '' });
    }
    return of(limitPeriodDateData);
  }

  addContact(gridRef: AgGridListingComponent, dataObj: any[], type, tempObj) {
    const actions = [
      {
        color: 'primary',
        displayName: 'Edit',
        icon: 'pi pi-pencil',
        index: 2,
        methodName: 'edit' + type,
        paramList: 'srNo',
        type: 'ICON',
        url: '',
      },
      {
        color: 'warn',
        displayName: 'Delete',
        icon: 'pi pi-trash',
        index: 2,
        methodName: 'delete' + type,
        paramList: 'srNo',
        type: 'ICON',
        url: '',
      },
    ];
    tempObj.srNo = dataObj.length + 1;
    tempObj.actions = actions;
    dataObj.push(tempObj);
    if (gridRef) {
      gridRef.refreshGridList();
    }
  }

  modifyDataObj(obj: any[], srNo, gridRef) {
    const data = obj.splice(srNo - 1, 1);
    obj.map((val, index) => (val.srNo = index + 1));
    gridRef.refreshGridList();
    return data;
  }

  clearGridData(gridRef: AgGridListingComponent) {
    try {
      // gridRef.setRowData([]);
      if (gridRef) {
        gridRef.refreshGridList();
      }
    } catch (e) {
      console.error(e);
    }
  }

  resetForm(form: NgForm, exceptionsFields) {
    const val = form.form.get(exceptionsFields).value;
    form.reset();
    form.form.get(exceptionsFields).patchValue(val);
  }

  validateContact(contactList, currentContact): boolean {
    //return false if duplicate contactNo OR name entered
    const duplicateContact = contactList.some(
      (contact) =>
        contact.contactDetMobile === currentContact.contactDetMobile ||
        contact.contactDetName === currentContact.contactDetName,
    );
    if (duplicateContact) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'Duplicate contact person name or telephone number',
      });
    }
    return !duplicateContact;
  }
}
