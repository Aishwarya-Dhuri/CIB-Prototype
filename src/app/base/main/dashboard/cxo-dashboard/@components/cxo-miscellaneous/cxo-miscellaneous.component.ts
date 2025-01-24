import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-cxo-miscellaneous',
  templateUrl: './cxo-miscellaneous.component.html',
  styleUrls: ['./cxo-miscellaneous.component.scss'],
})
export class CxoMiscellaneousComponent implements OnInit {
  loading: boolean = true;

  tabs: string[] = ['Overdue Payables', 'High Value Transactions'];
  selectedTab: string = this.tabs[0];

  gridOptions: any = {
    rowModelType: 'clientSide',
    pagination: false,
  };

  context: any = {
    componentParent: this,
  };

  overduePayablesData: any[] = [];
  overduePayablesColDefUrl: string =
    'commons/dashboardService/cxoDashboard/miscellaneous/private/overduePayablesColDefs';

  highValueTransactionsData: any[] = [];
  highValueTransactionsColDefUrl: string =
    'commons/dashboardService/cxoDashboard/miscellaneous/private/highValueTransactionsColDefs';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost('dashboard/cxo/private/getMiscellaneousData')
      .subscribe((response: any) => {
        this.overduePayablesData = response.data.overduePayables.products;
        this.highValueTransactionsData = response.data.highValueTransactions.products;

        this.loading = false;
      });
  }
}
