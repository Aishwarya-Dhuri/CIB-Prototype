import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { BeneficiaryModel } from './@model/beneficiary.model';
import { cloneDeep } from 'lodash';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { DefaultAccountRendererComponent } from './@components/default-account-renderer/default-account-renderer.component';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss'],
})
export class BeneficiaryComponent implements OnInit {
  @ViewChild('accountsGrid') accountsGrid: any;

  loadingGrid = false;
  isShowBeforeDeleteModel = false;

  mode: string;

  externalBankPaymentMethods: any[] = [];
  deleteAccPaymentMethods: any[] = [];

  editAccountIndex: number = -1;
  deleteAccountId: any;

  stepperDetails: Stepper = {
    masterName: 'Beneficiary',
    currentStep: 1,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['Beneficiary Details', 'Payment Method Mapping', 'Review Details & Confirm'],
  };

  frameworkComponents = {
    defaultAccountRenderer: DefaultAccountRendererComponent,
  };

  context = {
    componentParent: this,
  };

  showAddAccount: boolean = false;
  showDefaultAccountDeletionError: boolean = false;
  defaultAccountDeletionError: string = '';

  paymentMethods: any[] = [
    {
      pmid: 1,
      corporateProductId: 1,
      label: 'Internal Fund Transfers',
      isElectronicPaymentMethod: true,
      data: '0',
      maxLimitCurrency: '',
      maxLimitCurrencyCode: '',
      maxLimitAmount: '',
      colDefsUrl: 'payments/masters/beneficiary/private/colDefs1',
      reviewColDefsUrl: 'payments/masters/beneficiary/private/reviewColDefs1',
      accounts: [],
    },
    {
      pmid: 2,
      corporateProductId: 2,
      label: 'RTGS',
      isElectronicPaymentMethod: true,
      data: '0',
      maxLimitCurrency: '',
      maxLimitCurrencyCode: '',
      maxLimitAmount: '',
      colDefsUrl: 'payments/masters/beneficiary/private/colDefs1',
      reviewColDefsUrl: 'payments/masters/beneficiary/private/reviewColDefs1',
      accounts: [],
    },
    {
      pmid: 3,
      corporateProductId: 3,
      label: 'Outward Telegraphic Transfer',
      isElectronicPaymentMethod: true,
      data: '0',
      maxLimitCurrency: '',
      maxLimitCurrencyCode: '',
      maxLimitAmount: '',
      colDefsUrl: 'payments/masters/beneficiary/private/colDefs1',
      reviewColDefsUrl: 'payments/masters/beneficiary/private/reviewColDefs1',
      accounts: [],
    },
    {
      pmid: 4,
      corporateProductId: 4,
      label: 'Cash Payout',
      isElectronicPaymentMethod: false,
      data: '0',
      maxLimitCurrency: '',
      maxLimitCurrencyCode: '',
      maxLimitAmount: '',
      colDefsUrl: 'payments/masters/beneficiary/private/colDefs2',
      reviewColDefsUrl: 'payments/masters/beneficiary/private/reviewColDefs2',
      accounts: [],
    },
    {
      pmid: 5,
      corporateProductId: 5,
      label: 'Corporate Cheque',
      isElectronicPaymentMethod: false,
      data: '0',
      maxLimitCurrency: '',
      maxLimitCurrencyCode: '',
      maxLimitAmount: '',
      colDefsUrl: 'payments/masters/beneficiary/private/colDefs2',
      reviewColDefsUrl: 'payments/masters/beneficiary/private/reviewColDefs2',
      accounts: [],
    },
    {
      pmid: 6,
      corporateProductId: 6,
      label: 'Own Cheque',
      isElectronicPaymentMethod: false,
      data: '0',
      maxLimitCurrency: '',
      maxLimitCurrencyCode: '',
      maxLimitAmount: '',
      colDefsUrl: 'payments/masters/beneficiary/private/colDefs2',
      reviewColDefsUrl: 'payments/masters/beneficiary/private/reviewColDefs2',
      accounts: [],
    },
    {
      pmid: 7,
      corporateProductId: 7,
      label: 'IMPS',
      isElectronicPaymentMethod: true,
      data: '0',
      maxLimitCurrency: '',
      maxLimitCurrencyCode: '',
      maxLimitAmount: '',
      colDefsUrl: 'payments/masters/beneficiary/private/colDefs1',
      reviewColDefsUrl: 'payments/masters/beneficiary/private/reviewColDefs1',
      accounts: [],
    },
    {
      pmid: 8,
      corporateProductId: 8,
      label: 'NEFT',
      isElectronicPaymentMethod: true,
      data: '0',
      maxLimitCurrency: '',
      maxLimitCurrencyCode: '',
      maxLimitAmount: '',
      colDefsUrl: 'payments/masters/beneficiary/private/colDefs1',
      reviewColDefsUrl: 'payments/masters/beneficiary/private/reviewColDefs1',
      accounts: [],
    },
    {
      pmid: 9,
      corporateProductId: 9,
      label: 'Virtual ID (UPI).',
      isElectronicPaymentMethod: true,
      data: '0',
      maxLimitCurrency: '',
      maxLimitCurrencyCode: '',
      maxLimitAmount: '',
      colDefsUrl: 'payments/masters/beneficiary/private/colDefs',
      reviewColDefsUrl: 'payments/masters/beneficiary/private/reviewColDefs',
      accounts: [],
    },
  ];

  selectedPaymentMethodIndex: number = 0;

  noOfAddresses = 1;

  formData: BeneficiaryModel;

  currencyList: any[] = [];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private currencyService: CurrencyService,
    private viewService: ViewService,
    private httpService: HttpService,
  ) {
    this.formData = new BeneficiaryModel();
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Beneficiary - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Beneficiary' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'VIEW') {
      this.stepperDetails.currentStep = this.stepperDetails.headings.length;
    }

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/masters/beneficiary/private/view', data)
        .subscribe((formData: BeneficiaryModel) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'EDIT') {
            formData.paymentMethods.forEach((paymentMethod: any) => {
              const index = this.paymentMethods.findIndex(
                (pmd: any) => pmd.pmid === paymentMethod.pmid,
              );
              if (index >= 0) {
                if (this.paymentMethods[index].pmid === paymentMethod.pmid) {
                  this.paymentMethods[index] = paymentMethod;
                }
              }
            });
          } else {
            this.paymentMethods = formData.paymentMethods;
          }
        });
    }

    this.currencyService.getCurrencyList().subscribe((currencyList: any[]) => {
      this.currencyList = currencyList;
      if (currencyList.length > 0) {
        this.formData.limitCurrency = currencyList[0].id;
        this.formData.limitCurrencyCode = currencyList[0].displayName;
        this.paymentMethods[this.selectedPaymentMethodIndex].maxLimitCurrency = currencyList[0].id;
        this.paymentMethods[this.selectedPaymentMethodIndex].maxLimitCurrency =
          currencyList[0].displayName;
      }
    });
  }

  getSubHeading(stepNo: number) {
    if (stepNo === 1) {
      return `${this.formData.beneficiaryCode ? this.formData.beneficiaryCode + ' | ' : ''}${
        this.formData.beneficiaryType ? this.formData.beneficiaryType : ''
      }`;
    } else if (stepNo === 2) {
      let paymentMethods = 0;
      let records = 0;

      this.paymentMethods.forEach((paymentMethod: any) => {
        if (paymentMethod.data !== '0') {
          paymentMethods++;
          records = records + paymentMethod.accounts.length;
        }
      });
      return `${paymentMethods} Payment Methods | ${records} Records`;
    }
    return `Step ${stepNo} Completed`;
  }

  leafNodeSelected(product: any) {
    const index = this.paymentMethods.findIndex((p: any) => p.pmid === product.pmid);

    if (index >= 0) {
      this.showAddAccount = false;
      this.selectedPaymentMethodIndex = index;
      this.accountsGrid.refreshGridList();

      if (!this.paymentMethods[this.selectedPaymentMethodIndex].maxLimitCurrency) {
        this.paymentMethods[this.selectedPaymentMethodIndex].maxLimitCurrency =
          this.currencyList[0].id;
        this.paymentMethods[this.selectedPaymentMethodIndex].maxLimitCurrencyCode =
          this.currencyList[0].displayName;
      }

      this.refreshGrid();
    }
  }

  addAccount(e: any) {
    let account = e.account;

    account['actions'] = [
      {
        index: 1,
        paramList: 'accid',
        methodName: 'editAccount',
        type: 'ICON',
        label: 'Edit',
        icon: 'fa-pencil',
      },
      {
        index: 2,
        paramList: 'accid',
        methodName: 'deleteAccount',
        type: 'ICON',
        label: 'Delete',
        icon: 'fa-trash-alt',
      },
    ];

    if (this.paymentMethods[this.selectedPaymentMethodIndex].isElectronicPaymentMethod) {
      if (this.paymentMethods[this.selectedPaymentMethodIndex].accounts.length === 0) {
        account.defaultAccount = true;
      } else if (account.defaultAccount) {
        this.paymentMethods[this.selectedPaymentMethodIndex].accounts = this.paymentMethods[
          this.selectedPaymentMethodIndex
        ].accounts.map((acc: any) => {
          acc.defaultAccount = false;
          return acc;
        });
      }
    }

    if (this.editAccountIndex >= 0) {
      this.paymentMethods[this.selectedPaymentMethodIndex].accounts[this.editAccountIndex] =
        cloneDeep(account);
      this.editAccountIndex = -1;
    } else {
      this.paymentMethods[this.selectedPaymentMethodIndex].accounts.push(cloneDeep(account));
    }

    this.paymentMethods[this.selectedPaymentMethodIndex].data =
      this.paymentMethods[this.selectedPaymentMethodIndex].accounts.length.toString();
    this.showAddAccount = false;

    if (this.accountsGrid) {
      this.accountsGrid.refreshGridList();
    }
  }

  addAccountForExternalPaymentMethod(e: any) {
    let account = e.account;
    account['actions'] = [
      {
        index: 1,
        paramList: 'accid',
        methodName: 'editAccount',
        type: 'ICON',
        label: 'Edit',
        icon: 'fa-pencil',
      },
      {
        index: 2,
        paramList: 'accid',
        methodName: 'showBeforeDeleteModel',
        type: 'ICON',
        label: 'Delete',
        icon: 'fa-trash-alt',
      },
    ];

    if (this.paymentMethods[this.selectedPaymentMethodIndex].isElectronicPaymentMethod) {
      if (this.paymentMethods[this.selectedPaymentMethodIndex].accounts.length === 0) {
        account.defaultAccount = true;
      } else if (account.defaultAccount) {
        this.paymentMethods[this.selectedPaymentMethodIndex].accounts = this.paymentMethods[
          this.selectedPaymentMethodIndex
        ].accounts.map((acc: any) => {
          acc.defaultAccount = false;
          return acc;
        });
      }
    }

    if (this.editAccountIndex >= 0) {
      this.paymentMethods[this.selectedPaymentMethodIndex].accounts[this.editAccountIndex] =
        cloneDeep(account);
    } else {
      this.paymentMethods[this.selectedPaymentMethodIndex].accounts.push(cloneDeep(account));
    }

    this.paymentMethods[this.selectedPaymentMethodIndex].data =
      this.paymentMethods[this.selectedPaymentMethodIndex].accounts.length.toString();
    this.showAddAccount = false;

    if (this.accountsGrid) {
      this.accountsGrid.refreshGridList();
    }

    e.paymentMethods.forEach((paymentMethod: string) => {
      const index = this.paymentMethods.findIndex((pm: any) => pm.label === paymentMethod);

      if (index >= 0) {
        // code to be check later (BUG in the code)

        if (this.editAccountIndex >= 0) {
          const i = this.paymentMethods[index].accounts.findIndex(
            (acc: any) => acc.accid === account.accid,
          );

          if (i >= 0) {
            // TO BE CHECKED START
            if (this.paymentMethods[index].isElectronicPaymentMethod) {
              if (account.defaultAccount) {
                this.paymentMethods[index].accounts = this.paymentMethods[index].accounts.map(
                  (acc: any) => {
                    acc.defaultAccount = false;
                    return acc;
                  },
                );
              }
            }
            // TO BE CHECKED END

            this.paymentMethods[index].accounts[i] = cloneDeep(account);
          }
        } else {
          // TO BE CHECKED START
          if (this.paymentMethods[index].isElectronicPaymentMethod) {
            if (account.defaultAccount) {
              this.paymentMethods[index].accounts = this.paymentMethods[index].accounts.map(
                (acc: any) => {
                  acc.defaultAccount = false;
                  return acc;
                },
              );
            }
          }
          // TO BE CHECKED END

          const newAccount = cloneDeep(account);
          newAccount.accid = newAccount.accid + 1;
          this.paymentMethods[index].accounts.push(newAccount);
        }

        this.paymentMethods[index].data = this.paymentMethods[index].accounts.length.toString();
      }
    });

    if (this.editAccountIndex >= 0) {
      this.editAccountIndex = -1;
    }
  }

  editAccount(id: any) {
    this.editAccountIndex = this.paymentMethods[this.selectedPaymentMethodIndex].accounts.findIndex(
      (account: any) => account.accid === id,
    );

    if (this.editAccountIndex >= 0) {
      this.showAddAccount = true;
    }
  }

  deleteAccount(id: any) {
    const index = this.paymentMethods[this.selectedPaymentMethodIndex].accounts.findIndex(
      (account: any) => account.accid === id,
    );

    if (index >= 0) {
      if (this.paymentMethods[this.selectedPaymentMethodIndex].isElectronicPaymentMethod) {
        if (this.paymentMethods[this.selectedPaymentMethodIndex].accounts[index].defaultAccount) {
          this.defaultAccountDeletionError =
            "You can't delete default account, please change default account and try again.";
          this.showDefaultAccountDeletionError = true;
          return;
        }
      }

      this.paymentMethods[this.selectedPaymentMethodIndex].accounts.splice(index, 1);
      this.paymentMethods[this.selectedPaymentMethodIndex].data =
        this.paymentMethods[this.selectedPaymentMethodIndex].accounts.length.toString();
    }

    if (this.accountsGrid) {
      this.accountsGrid.refreshGridList();
    }
  }

  showBeforeDeleteModel(id: any) {
    this.deleteAccountId = id;

    if (this.paymentMethods[this.selectedPaymentMethodIndex].label === 'RTGS') {
      this.externalBankPaymentMethods = ['IMPS', 'NEFT'];
    } else if (this.paymentMethods[this.selectedPaymentMethodIndex].label === 'IMPS') {
      this.externalBankPaymentMethods = ['RTGS', 'NEFT'];
    } else if (this.paymentMethods[this.selectedPaymentMethodIndex].label === 'NEFT') {
      this.externalBankPaymentMethods = ['IMPS', 'RTGS'];
    }

    this.isShowBeforeDeleteModel = true;
  }

  deleteAccForDomesticPaymentMethod() {
    const index = this.paymentMethods[this.selectedPaymentMethodIndex].accounts.findIndex(
      (account: any) => account.accid === this.deleteAccountId,
    );

    if (index >= 0) {
      if (this.paymentMethods[this.selectedPaymentMethodIndex].isElectronicPaymentMethod) {
        if (this.paymentMethods[this.selectedPaymentMethodIndex].accounts[index].defaultAccount) {
          this.defaultAccountDeletionError =
            "You can't delete default account, please change default account and try again.";
          this.showDefaultAccountDeletionError = true;

          this.externalBankPaymentMethods = [];
          this.deleteAccPaymentMethods = [];
          this.deleteAccountId = null;
          this.isShowBeforeDeleteModel = false;
          return;
        } else {
          const defaultAccountsInPaymentMethods: any[] = [];

          this.deleteAccPaymentMethods.forEach((paymentMethod: string) => {
            const i = this.paymentMethods.findIndex((pm: any) => pm.label === paymentMethod);

            if (i >= 0) {
              const j = this.paymentMethods[i].accounts.findIndex(
                (acc: any) => acc.accid === this.deleteAccountId,
              );

              /*  this.paymentMethods[i].accounts.forEach((acc: any) => {
                console.log(acc.accid, this.deleteAccountId);
              });

              console.log(j); */

              if (this.paymentMethods[i].accounts[j].defaultAccount) {
                defaultAccountsInPaymentMethods.push(paymentMethod);
              }
            }
          });

          if (defaultAccountsInPaymentMethods.length > 0) {
            this.defaultAccountDeletionError = `This account is default account in ${defaultAccountsInPaymentMethods.join(
              ', ',
            )}, please change default account and try again.`;

            this.externalBankPaymentMethods = [];
            this.deleteAccPaymentMethods = [];
            this.deleteAccountId = null;
            this.isShowBeforeDeleteModel = false;

            this.showDefaultAccountDeletionError = true;
            return;
          }
        }
      }

      this.paymentMethods[this.selectedPaymentMethodIndex].accounts.splice(index, 1);
      this.paymentMethods[this.selectedPaymentMethodIndex].data =
        this.paymentMethods[this.selectedPaymentMethodIndex].accounts.length.toString();

      this.deleteAccPaymentMethods.forEach((paymentMethod: string) => {
        const i = this.paymentMethods.findIndex((pm: any) => pm.label === paymentMethod);

        if (i >= 0) {
          const j = this.paymentMethods[i].accounts.findIndex(
            (acc: any) => acc.accid === this.deleteAccountId,
          );

          if (j >= 0) {
            this.paymentMethods[i].accounts.splice(j, 1);
            this.paymentMethods[i].data = this.paymentMethods[i].accounts.length.toString();
          }
        }
      });

      if (this.accountsGrid) {
        this.accountsGrid.refreshGridList();
      }
    }

    this.externalBankPaymentMethods = [];
    this.deleteAccPaymentMethods = [];
    this.deleteAccountId = null;
    this.isShowBeforeDeleteModel = false;
  }

  refreshGrid() {
    this.loadingGrid = true;

    setTimeout(() => {
      this.loadingGrid = false;
    }, 100);
  }

  addAddress() {
    if (this.noOfAddresses === 3) {
      return;
    }
    this.noOfAddresses++;
  }

  beforeSubmit() {
    return true;
  }

  onStepChange(stepNo: number) {
    if (stepNo === 1) {
    } else if (stepNo === 2) {
    } else if (stepNo === 3) {
      const paymentMethods = [];

      this.paymentMethods.forEach((paymentMethod: any) => {
        if (paymentMethod.data !== '0') {
          paymentMethods.push(paymentMethod);
        }
      });

      this.formData.paymentMethods = paymentMethods;

      this.selectedPaymentMethodIndex = 0;
    }
  }

  removeAddress() {
    if (this.noOfAddresses === 2) {
      this.formData.address2 = this.formData.address3;
      this.formData.address3 = '';
    } else if (this.noOfAddresses === 3) {
      this.formData.address3 = '';
    }
    if (this.noOfAddresses === 1) {
      return;
    }
    this.noOfAddresses--;
  }
}
