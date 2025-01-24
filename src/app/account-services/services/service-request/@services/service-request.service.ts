import { Injectable } from '@angular/core';
import { ServiceRequestModel } from '../@model/service-requesr.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceRequestService {
  _fieldTypes = {
    srClass: 'Bank@Work',
    srType: 'Adhoc Request',
    srSubType: 'QR standee',
    isMultipleRequests: false,
    corporateCode: '999200',
    corporateName: 'Toyota Motors Malaysia',
    fieldList: [
      {
        name: 'Usertype',
        displayName: 'User type',
        type: 'String',
        fieldType: 'SELECT',
        urlData: 'CORPORATE_USER',
        mandatory: false,
        fieldLabel: 'User type',
        fieldSeqNo: '1',
      },
      {
        name: 'FirstName',
        displayName: 'First Name',
        type: 'String',
        fieldType: 'TEXT',
        mandatory: false,
        fieldLabel: 'First Name',
        fieldSeqNo: '2',
      },
      {
        name: 'LastName',
        displayName: 'Last Name',
        type: 'String',
        fieldType: 'TEXT',
        mandatory: false,
        fieldLabel: 'Last Name',
        fieldSeqNo: '3',
      },
      {
        name: 'Product',
        displayName: 'Product',
        type: 'String',
        fieldType: 'SELECT',
        urlData: 'PRODUCT_1',
        mandatory: false,
        fieldLabel: 'Product',
        fieldSeqNo: '4',
      },
      {
        name: 'Account',
        displayName: 'Account',
        type: 'String',
        fieldType: 'SELECT',
        dataKeyUrl: 'CORPORATE_ACCOUNT',
        mandatory: false,
        fieldLabel: 'Account',
        fieldSeqNo: '5',
      },
      {
        name: 'MobileNumber',
        displayName: 'Mobile Number',
        type: 'String',
        fieldType: 'TEXT',
        mandatory: false,
        fieldLabel: 'Mobile Number',
        fieldSeqNo: '6',
      },
      {
        name: 'Email ID',
        displayName: 'Email ID',
        type: 'String',
        fieldType: 'TEXT',
        mandatory: false,
        fieldLabel: 'Email ID',
        fieldSeqNo: '7',
      },
      {
        name: 'Role',
        displayName: 'Role',
        type: 'String',
        fieldType: 'SELECT',
        urlData: 'CORPORATE_ROLE',
        mandatory: false,
        fieldLabel: 'Role',
        fieldSeqNo: '8',
      },
      {
        name: 'Remarks',
        displayName: 'Remarks',
        type: 'String',
        fieldType: 'TEXT',
        mandatory: false,
        fieldLabel: 'Remarks',
        fieldSeqNo: '9',
      },
    ],
  };

  constructor() {}
}
