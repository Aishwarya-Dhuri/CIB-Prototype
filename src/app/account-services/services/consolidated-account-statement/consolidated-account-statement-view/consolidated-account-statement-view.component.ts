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
import { ConsolidatedAccountStatementService } from '../@services/consolidated-account-statement.service';

@Component({
  selector: 'app-consolidated-account-statement-view',
  templateUrl: './consolidated-account-statement-view.component.html',
  styleUrls: ['./consolidated-account-statement-view.component.scss']
})
export class ConsolidatedAccountStatementViewComponent implements OnInit {
  @ViewChild('consolidatedAccountStatement') consolidatedAccountStatement: any;

  loading: boolean;

  viewPort: string = '';
  accounts: string = '';
  currency: string = '';
  currencyName: string = '';
  accountsList: any[] = [];
  amountList: any;
  colDefUrl: string = 'accountServices/services/accountSummary/private/consolidatedAccountStatementColDefs';
  rowDataUrl: string = 'accountServices/services/accountSummary/private/getConsolidatedAccountStatement';

  gridOptions = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
  };

  searchFilters: any = [];
  filters: any[] = [];

  constructor(

    private viewPortService: ViewportService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private userService: UserService,
    private currencyService: CurrencyService,
    private router: Router,
    private consolidatedAccountStatmentService: ConsolidatedAccountStatementService
  ) { }

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Consolidated Account Statement View',
      subHeading: null,
      widgetsActions: false,
      refresh: true,
      widgets: false,
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
      { label: 'Consolidated Account Statement' },
      { label: 'View' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.searchFilters = this.consolidatedAccountStatmentService.searchFilters;

    if (this.searchFilters && this.searchFilters.length == 0) {
      this.router.navigateByUrl('/accountServices/services/consolidatedAccountStatement');

      return;
    }

    this.searchFilters.forEach((filter: any) => {
      if (filter.value) {
        this.filters.push({
          displayName: filter.displayName,
          displayValue: filter.value,
        });
      }
    });

    this.getCurrency();
    this.getAccountListByCorporate();

    this.viewPortService.getViewport().subscribe((res) => {
      this.viewPort = res;
    });
  }


  getRowData(accountNumber: string): void {
    const reqBody = { dataMap: { accountNumber: accountNumber } };
    this.httpService.httpPost(this.rowDataUrl, reqBody).subscribe((response: any) => {
      this.consolidatedAccountStatement.setRowData(response.data);
    });
  }

  onClear() {
    this.consolidatedAccountStatmentService.searchFilters = [];
    this.router.navigateByUrl('/accountServices/services/consolidatedAccountStatement');
  }

  onModify() {
    this.router.navigateByUrl('/accountServices/services/consolidatedAccountStatement');
  }

  getAccountListByCorporate() {
    const data = { dataMap: { corporateId: this.userService.userDetails.corporateId } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        this.accountsList = response.dataList;
        this.accounts = this.consolidatedAccountStatmentService.selectedAccount;
        this.getRowData(this.consolidatedAccountStatmentService.selectedAccountNumber);
        this.amountList = this.accountsList.find((res) => res.id === this.accounts)?.enrichments;
        this.loading = false;
      });
  }

  onChangeCurrency(currency: any) {
    this.currencyName = currency.displayName;
  }

  getCurrency() {
    this.currencyService.getCurrencyId().subscribe((res) => {
      this.currency = res;
    });
    this.currencyService.getCurrencyName().subscribe((res) => {
      this.currencyName = res;
    });
  }

  setAmountsByAccount(accountId) {
    if (accountId) {
      this.amountList = this.accountsList.find((res) => res.id === accountId).enrichments;
      this.getRowData(this.amountList.accountNo);
    }
  }




  downloadReport(id, reportId, reportFileType) {
    const reqData = {
      dataMap: {
        id: id,
        reportId: reportId,
        fileType: reportFileType,
      },
    };
    this.httpService
      .httpPost('reports/private/downloadReport', reqData)
      .subscribe((response: any) => {
        if (response.responseStatus.status == 0) {
          this.httpService.httpDownload(response.dataMap.filePath);
        }
      });
  }

}
