import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SellerBuyerService {
  contactDetailsColDefs = [
    {
      headerName: 'Sr. No',
      field: 'srNo',
    },
    {
      headerName: 'Contact Person',
      field: 'contactPersonName',
    },
    {
      headerName: 'Designation',
      field: 'designation',
    },
    {
      headerName: 'Email',
      field: 'emailId',
    },
    {
      headerName: 'Telephone Number',
      field: 'telephoneNumber',
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: 'actionCellRenderer',
    },
  ];

  ipMappingColDefs = [
    {
      headerName: 'Sr. No',
      field: 'srNo',
    },
    {
      headerName: 'Start Range',
      field: 'startRange',
    },
    {
      headerName: 'End Range',
      field: 'endRange',
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: 'actionCellRenderer',
    },
  ];

  authorizationRuleColDefs = [
    {
      headerName: 'Sr. No',
      field: 'srNo',
    },
    {
      headerName: 'Module Name',
      field: 'moduleName',
    },
    {
      headerName: 'Transaction Name',
      field: 'transactionName',
    },
    {
      headerName: 'Authorization Name',
      field: 'authorizationRule',
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: 'actionCellRenderer',
    },
  ];

  constructor() {}
}
