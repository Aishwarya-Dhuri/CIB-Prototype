import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ActionRendererComponent } from '../@components/action-renderer/action-renderer.component';
import { AccountStatementService } from '../@services/account-statement.service';
import { cloneDeep } from 'lodash';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-account-statement-view',
  templateUrl: './account-statement-view.component.html',
  styleUrls: ['./account-statement-view.component.scss'],
})
export class AccountStatementViewComponent implements OnInit {
  @ViewChild('accountStatement') accountStatement: any;

  loading: boolean;

  viewPort: string;
  accounts: string = '';
  currency: any = '';
  currencyName: string = '';
  accountsList: any[] = [];
  amountList: any;
  colData: any[] = [];
  rowDataUrl: string = 'accountServices/services/accountSummary/private/getAccountStatement';

  gridOptions = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
  };

  searchFilters: any[] = [];

  filters: any[] = [];

  frameworkComponents = {
    actionCellRenderer: ActionRendererComponent,
  };

  constructor(
    private viewPortService: ViewportService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private currencyService: CurrencyService,
    private httpService: HttpService,
    private router: Router,
    private accountStatementService: AccountStatementService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Account Statement View',
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
      { label: 'Account Services' },
      { label: 'Service' },
      { label: 'Account Statement' },
      { label: 'View' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.searchFilters = this.accountStatementService.searchFilters;

    if (this.searchFilters && this.searchFilters.length == 0) {
      this.router.navigateByUrl('/accountServices/services/accountStatement');

      return;
    }
    this.searchFilters.forEach((filter: any) => {
      if (filter.value && filter.displayName != 'Date') {
        this.filters.push({
          displayName: filter.displayName,
          displayValue: filter?.displayValue ? filter.displayValue : filter.value,
          type: filter.type,
        });
      }
    });

    this.accounts = this.accountStatementService.selectedAccount;

    this.getCurrency();

    this.getAccountListByCorporate();
    this.getColData();

    this.viewPortService.getViewport().subscribe((res) => {
      this.viewPort = res;
    });
  }

  onChangeCurrency(currency: any) {
    this.currencyName = currency.displayName;
    this.getCurrencyValidate(this.amountList.currencyId, currency.id);
  }

  getRowData(accountNumber: string): void {
    const reqBody = { dataMap: { accountNumber: accountNumber } };
    this.httpService.httpPost(this.rowDataUrl, reqBody).subscribe((response: any) => {
      this.accountStatement.setRowData(response.data);
    });
  }

  getColData(): void {
    this.httpService
      .httpPost('accountServices/services/accountStatement/private/accountStatementColDefs')
      .subscribe((response) => {
        this.colData = response;
      });
  }

  onClear() {
    this.accountStatementService.searchFilters = [];
    this.router.navigateByUrl('/accountServices/services/accountStatement');
  }

  onModify() {
    this.router.navigateByUrl('/accountServices/services/accountStatement');
  }

  getAccountListByCorporate(): void {
    const data = { dataMap: { corporateId: this.userService.userDetails.corporateId } };

    let url = 'setup/corporateOnboarding/corporateMain/private/accountList';

    if (this.searchFilters[0].value == 'IBAN') {
      let url = 'setup/corporateOnboarding/corporateMain/private/ibanAccountList';
    }

    this.httpService.httpPost(url, data).subscribe((response: any) => {
      this.accountsList = response.dataList;
      this.getRowData(this.accountStatementService.selectedAccountNumber);
      this.amountList = this.accountsList.find((res) => res.id === this.accounts)?.enrichments;
      this.loading = false;
    });
  }

  getCurrency(): void {
    this.currencyService.getCurrencyId().subscribe((res) => {
      this.currency = res;
    });
    this.currencyService.getCurrencyName().subscribe((res) => {
      this.currencyName = res;
    });
  }

  setAmountsByAccount(accountId: string): void {
    if (accountId) {
      this.amountList = this.accountsList.find((res) => res.id === accountId)?.enrichments;
      this.getRowData(this.amountList.accountNo);
      this.getCurrencyValidate(this.amountList.currencyId, this.currency);
    }
  }

  getCurrencyValidate(accountCurreny: string, currency: string): void {
    if (accountCurreny != currency) {
      const colDef = this.colData.find((res) => res.field == 'currencyBalance');

      if (!colDef) {
        this.colData.unshift({
          headerName: 'Balance',
          field: 'currencyBalance',
          cellRenderer: 'currencyRenderer',
        });
        const colDefs = cloneDeep(this.colData);
        this.colData = [];

        setTimeout(() => {
          this.colData = colDefs;

          this.getRowData(this.accountStatementService.selectedAccountNumber);
        }, 100);
      }
    }
  }

  advice(id: string): void {
    this.viewService.setId(id);
  }

  swiftGpiDataFlow(id: string): void {
    this.viewService.setId(id);
    this.router.navigateByUrl('accountServices/services/accountStatement/dataflow');
  }
}
