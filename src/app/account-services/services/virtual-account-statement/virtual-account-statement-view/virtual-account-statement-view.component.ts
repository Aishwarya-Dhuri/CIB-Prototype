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

import { VirtualAccountStatementService } from '../@services/virtual-account-statement.service';
import { cloneDeep } from 'lodash';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ActionRendererComponent } from '../../account-statement/@components/action-renderer/action-renderer.component';

@Component({
  selector: 'app-virtual-account-statement-view',
  templateUrl: './virtual-account-statement-view.component.html',
  styleUrls: ['./virtual-account-statement-view.component.scss'],
})
export class VirtualAccountStatementViewComponent implements OnInit {
  @ViewChild('accountStatement') accountStatement: any;

  loading: boolean;

  viewPort: string;
  accounts: string = '';
  currency: any = '';
  currencyName: string = '';
  virtualAccountsList: any[] = [];
  amountList: any;
  colData: any[] = [];
  rowDataUrl: string = 'accountServices/services/accountSummary/private/getVirtualAccountStatement';

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
    private virtualAccountStatementService: VirtualAccountStatementService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Virtual Account Statement View',
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
      { label: 'Virtual Account Statement' },
      { label: 'View' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.searchFilters = this.virtualAccountStatementService.searchFilters;

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

    this.accounts = this.virtualAccountStatementService.selectedVirtualAccount;

    this.getCurrency();

    this.getAccountListByAccount();
    this.getColData();

    this.viewPortService.getViewport().subscribe((res) => {
      this.viewPort = res;
    });
  }

  getRowData(accountNumber: string): void {
    const reqBody = { dataMap: { accountNumber: accountNumber } };
    this.httpService.httpPost(this.rowDataUrl, reqBody).subscribe((response: any) => {
      this.accountStatement.setRowData(response.data);
    });
  }

  getColData(): void {
    this.httpService
      .httpPost('accountServices/services/accountStatement/private/virtualAccountStatementColDefs')
      .subscribe((response) => {
        this.colData = response;
      });
  }

  onClear() {
    this.virtualAccountStatementService.searchFilters = [];
    this.router.navigateByUrl('/accountServices/services/virtualAccountStatement');
  }

  onModify() {
    this.router.navigateByUrl('/accountServices/services/virtualAccountStatement');
  }

  getAccountListByAccount(): void {
    const data = {
      dataMap: { accountNo: this.virtualAccountStatementService.selectedAccountNumber },
    };

    let url = 'setup/corporateOnboarding/corporateMain/private/virtualAccountList';

    this.httpService.httpPost(url, data).subscribe((response: any) => {
      this.virtualAccountsList = response.dataList;
      this.getRowData(this.virtualAccountStatementService.selectedVirtualAccountNumber);
      this.amountList = this.virtualAccountsList.find(
        (res) => res.id === this.accounts,
      )?.enrichments;
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

  onChangeVirtualAccount(accountId: string): void {
    if (accountId) {
      this.amountList = this.virtualAccountsList.find((res) => res.id === accountId)?.enrichments;
      this.getRowData(this.amountList.virtualAccountNumber);
    }
  }

  advice(id: string): void {
    this.viewService.setId(id);
  }

  swiftGpiDataFlow(id: string): void {
    this.viewService.setId(id);
    this.router.navigateByUrl('accountServices/services/virtualAccountStatement/dataflow');
  }
}
