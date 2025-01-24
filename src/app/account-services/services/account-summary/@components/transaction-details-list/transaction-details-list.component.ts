import { Component, Input, ViewChild, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { RunningBalanceRendererComponent } from '../running-balance-renderer/running-balance-renderer.component';

@Component({
  selector: 'app-transaction-details-list',
  templateUrl: './transaction-details-list.component.html',
  styleUrls: ['./transaction-details-list.component.scss'],
})
export class TransactionDetailsListComponent implements OnInit, OnChanges {
  @ViewChild('transactionDetails') transactionDetailsGrid: any;

  loading: boolean = true;

  colDefUrl = 'accountServices/services/accountSummary/private/accountStatementColDefs';

  @Input('account') account: any;
  @Input('summaryType') summaryType: any;

  viewport: string;

  rowData: any[] = [];

  frameworkComponents: any = { runningBalanceRenderer: RunningBalanceRendererComponent };

  gridOptions = {
    rowModelType: 'clientSide',
  };

  constructor(
    private httpService: HttpService,
    private viewportService: ViewportService,
    private router: Router,
    private route: ActivatedRoute,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loading = true;

    const data = { dataMap: { accountNumber: this.account.accountNo } };

    let URL = 'accountServices/services/accountSummary/private/getAccountStatement';

    if (this.summaryType == 'Credit Card') {
      this.colDefUrl = 'accountServices/services/accountSummary/private/creditCardStatementColDefs';
      URL = 'accountServices/services/accountSummary/private/getCreditCardStatement';
    }

    if (this.summaryType == 'Virtual Account') {
      URL = 'accountServices/services/accountSummary/private/getVirtualAccountStatement';
    }

    this.httpService.httpPost(URL, data).subscribe((response: any) => {
      this.rowData = response.data;
      this.loading = false;
    });
  }

  onSinglePaymentInitiation() {
    this.router.navigate(['/payments/transactions/singlePaymentRequest'], {
      relativeTo: this.route,
    });
  }

  onFdInitiation() {
    this.router.navigate(['/accountServices/fixedDeposit/fdInitiation'], {
      relativeTo: this.route,
    });
  }

  onStatementDownload() {
    this.router.navigate(['/accountServices/creditCard/creditCardStatementDownload'], {
      relativeTo: this.route,
    });
  }

  onDebitCreditAdvice(data: any) {
    console.log(data);
  }

  advice(id: string): void {
    this.viewService.setId(id);
  }

  swiftGpiDataFlow(id: string): void {
    this.viewService.setId(id);
    this.router.navigateByUrl('accountServices/services/accountSummary/dataflow');
  }

  raiseDispute(id: string): void {
    this.viewService.setId(id);
    this.router.navigateByUrl('accountServices/services/accountSummary/raiseDispute');
  }
}
