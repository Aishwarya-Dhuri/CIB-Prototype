import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { CorporateProductService } from '../@services/corporate-product.service';

@Component({
  selector: 'app-corporate-view',
  templateUrl: './corporate-view.component.html',
  styleUrls: ['./corporate-view.component.scss'],
})
export class CorporateViewComponent implements OnInit {
  loading: boolean = true;

  selectedCorporate: any;

  treeGridOptions: any = {
    rowModelType: 'clientSide',
    pagination: false,

    treeData: true,
    autoGroupColumnDef: {
      headerName: 'Product',
      cellRendererParams: { suppressCount: true },
    },
    getDataPath: function (data: any) {
      return data.product;
    },
    isGroupOpenByDefault: (params: any) => {
      return true;
    },
  };

  corporate: any;

  sections: any[] = [
    { displayName: 'Corporate Details' },
    { displayName: 'Agreement Details' },
    { displayName: 'RM Details' },
    { displayName: 'Contact Person' },
    { displayName: 'Product and Accounts Mapped  ' },
    { displayName: 'External Accounts' },
    { displayName: 'Authorization Rules' },
    { displayName: 'Parameter Details' },
    { displayName: 'User Details' },
  ];

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

  section: any;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private corporateProductService: CorporateProductService,
    private currencyService: CurrencyService,
    public userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Corporate Group Profile',
      subHeading: null,

      refresh: true,

      download: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Setup' },
      { label: 'Corporate Group Profile' },
      { label: 'View' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.section = this.sections[0];

    this.currencyService.getCurrencyName().subscribe((currency: string) => {
      this.corporate = {
        corporateId: this.userService.userDetails.corporateId,
        corporateIcon: this.userService.userDetails.corporateImage,
        corporateName: this.userService.userDetails.corporateName,
        category: 'Gold',
        accounts: '5',
        agreementDetails: { agreementRefNo: '54321234', agreementExpiryDate: '01 December 2022' },
        rmDetails: {
          rmName: 'Richard Miller',
          rmEmailId: 'Richard.m@bank.com',
          rmMobileNo: '91 9964098445 ',
        },
        contactPerson: {
          columnData: [
            {
              headerName: 'Person Name',
              field: 'personName',
            },
            {
              headerName: 'Designation',
              field: 'designation',
            },
            {
              headerName: 'Email ID',
              field: 'emailId',
            },
            {
              headerName: 'Telephone No',
              field: 'telephoneNo',
            },
          ],
          rowData: [
            {
              personName: 'Mark Spencer',
              designation: 'Manager',
              emailId: 'mark.spencer@thaibev.com',
              telephoneNo: '9078892310',
            },
            {
              personName: 'Britta Smith',
              designation: 'Sr Manager',
              emailId: 'britta.smith@thaibev.com',
              telephoneNo: '9078809876',
            },
            {
              personName: 'William Cooper',
              designation: 'Sr. Manager',
              emailId: 'william.cooper@thaibev.com',
              telephoneNo: '9078833443',
            },
          ],
        },
        productAndAccountMapping: {
          headers: [
            { headerName: 'Sub Product', field: 'subProduct' },
            { headerName: 'Account Number', field: 'accountNumber' },
            { headerName: 'Currency', field: 'currency' },
            { headerName: 'Account Type', field: 'accountType' },
          ],
          data: [
            {
              product: ['Payments'],
              subProduct: '',
              accountNumber: '',
              currency: '',
              accountType: '',
            },
            {
              product: ['Payments', ''],
              subProduct: 'Salary Payment',
              accountNumber: '',
              currency: '',
              accountType: '',
            },
            {
              product: ['Payments', '', ''],

              subProduct: '',
              accountNumber: '019900038803',
              currency: currency,
              accountType: 'CASA',
            },
            {
              product: ['Payments', '', ' '],
              subProduct: '',
              accountNumber: '019900038803',
              currency: currency,
              accountType: 'CASA',
            },
            {
              product: ['Payments', ' '],

              subProduct: 'Vendor Payment',
              accountNumber: '',
              currency: '',
              accountType: '',
            },
            {
              product: ['Payments', ' ', ''],

              subProduct: '',
              accountNumber: '019900038803',
              currency: currency,
              accountType: 'CASA',
            },
            {
              product: ['Payments', ' ', ' '],

              subProduct: '',
              accountNumber: '019900038803',
              currency: currency,
              accountType: 'CASA',
            },
            {
              product: ['FSCM'],
              subProduct: '',
              accountNumber: '',
              currency: '',
              accountType: '',
            },
            {
              product: ['FSCM', ''],
              subProduct: 'EIPP',
              accountNumber: '',
              currency: '',
              accountType: '',
            },
            {
              product: ['FSCM', '', ''],
              subProduct: '',
              accountNumber: '019900038803',
              currency: currency,
              accountType: 'CASA',
            },
            {
              product: ['FSCM', ' '],
              subProduct: 'Supplier Finance',
              accountNumber: '',
              currency: '',
              accountType: '',
            },
            {
              product: ['FSCM', ' ', ''],
              subProduct: '',
              accountNumber: '019900038803',
              currency: currency,
              accountType: 'CASA',
            },
            {
              product: ['FSCM', '  '],
              subProduct: 'Dealer Finance',
              accountNumber: '',
              currency: '',
              accountType: '',
            },
            {
              product: ['FSCM', '  ', ''],
              subProduct: '',
              accountNumber: '019900038803',
              currency: currency,
              accountType: 'CASA',
            },
          ],
        },
        externalAccounts: {
          columnData: [
            {
              headerName: 'Bank Name',
              field: 'bankName',
            },
            {
              headerName: 'Account Number',
              field: 'accountNumber',
            },
            {
              headerName: 'Currency',
              field: 'currency',
            },
            {
              headerName: 'Account Type',
              field: 'accountType',
            },
          ],
          rowData: [
            {
              bankName: 'Bank of America',
              accountNumber: '019900038803',
              currency: currency,
              accountType: 'CASA',
            },

            {
              bankName: 'Bank Nizwa',
              accountNumber: '019900038821',
              currency: currency,
              accountType: 'CASA',
            },

            {
              bankName: 'HDFC',
              accountNumber: '019900038800',
              currency: currency,
              accountType: 'CASA',
            },
          ],
        },
        authorizationRules: {
          columnData: [
            {
              headerName: 'Module Name',
              field: 'moduleName',
            },
            {
              headerName: 'Authorization Rule',
              field: 'authorizationRule',
            },
          ],
          rowData: [
            {
              product: ['Payment'],
              moduleName: '',
              authorizationRule: '',
            },
            {
              product: ['Payment', ''],
              moduleName: 'Payment Request',
              authorizationRule: 'Self Authorization',
            },
            {
              product: ['Payment', ' '],
              moduleName: 'SI Management',
              authorizationRule: 'Maker Checker',
            },
            {
              product: ['Payment', '  '],
              moduleName: 'Bill Payment',
              authorizationRule: 'Maker Checker',
            },
            {
              product: ['Trade'],
              moduleName: '',
              authorizationRule: '',
            },
            {
              product: ['Trade', ''],
              moduleName: 'Letter of Credit',
              authorizationRule: 'Self Authorization',
            },
            {
              product: ['Trade', ' '],
              moduleName: 'Trade Bill Acceptance',
              authorizationRule: 'Maker Checker',
            },
            {
              product: ['Trade', '  '],
              moduleName: 'Trade Bill Presentment',
              authorizationRule: 'Maker Checker',
            },
          ],
        },
        parameterDetails: {
          currencyWiseAuthMatrix: 'Yes',
          primaryCurrency: currency,
          batchPrimaryCurrency: currency,
          verificationRequired: 'Yes',
          verificationLevel: 'Batch',
        },
        userDetails: {
          numberOfUsers: '5',
          showUsers: false,
          tokenUsed: '12345',
          columnData: [
            {
              headerName: 'User ID',
              field: 'userId',
            },
            {
              headerName: 'First Name',
              field: 'firstName',
            },
            {
              headerName: 'Last Name',
              field: 'lastName',
            },
            {
              headerName: 'Designation',
              field: 'designation',
            },
            {
              headerName: 'Email',
              field: 'email',
            },
          ],
          rowData: [
            {
              userId: 'ssmaker',
              firstName: 'Suhail',
              lastName: 'Sawant',
              designation: 'Manager',
              email: 'suhail.sawant@mail.com',
            },
            {
              userId: 'sschecker',
              firstName: 'Suhail',
              lastName: 'Sawant',
              designation: 'Manager',
              email: 'suhail.sawant@mail.com',
            },
            {
              userId: 'Admin3',
              firstName: 'Max',
              lastName: 'Mane',
              designation: 'Sr Manager',
              email: 'max.mane@mail.com',
            },
            {
              userId: 'Admin4',
              firstName: 'Sam',
              lastName: 'Gerrard',
              designation: 'Manager',
              email: 'sam.gerrard@mail.com',
            },
            {
              userId: 'Admin5',
              firstName: 'Sianna',
              lastName: 'Cap',
              designation: 'Accountant',
              email: 'sianna.cap@mail.com',
            },
          ],
        },
      };

      this.selectedCorporate = this.corporateProductService.selectedCorporate;

      this.loading = false;
    });
  }

  scroll(section: any, sectionIndex: number) {
    this.section = section;

    const elementId = 'section-' + (sectionIndex + 1);

    const el = document.getElementById(elementId);

    el.scrollIntoView();
  }
}
