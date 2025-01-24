import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss'],
})
export class AccountStatementWidgetComponent implements OnInit {
  @Input('index') index: any;
  @Input('title') title: any;
  @Input('id') id: any;
  @Input('serviceUrl') serviceUrl: any;
  @Input('showChangeChartOption') showChangeChartOption: any;

  step: number = 1;
  formData: any;
  accountNoList: Select[] = [];
  statementForList: Select[] = [];
  loading: boolean;

  onScreenStatementColDef: string =
    'accountServices/services/accountSummary/private/accountStatementColDefs';
  onScreenStatements: any[];

  @Output() action = new EventEmitter<{ type: string; i?: number }>();

  constructor(private httpService: HttpService, private userService: UserService) {
    this.resetFormData();
  }

  ngOnInit() {
    this.getAccountNoList();
    this.getStatementForList();
  }

  resetFormData(): void {
    this.formData = {
      accountNo: '',
      statementType: 'DETAIL',
      statementFor: 'CURRENT_MONTH',
      downloadType: 'ON_SCREEN',
      dateRange: '',
    };
  }

  getAccountNoList(): void {
    const data = { dataMap: { corporateId: this.userService.userDetails.corporateId } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        this.accountNoList = response.dataList;
      });
  }

  getStatementForList(): void {
    this.statementForList = [
      { id: 'CURRENT_MONTH', displayName: 'Current month' },
      { id: 'PREVIOUS_MONTH', displayName: 'Previous Month' },
      { id: 'FISCAL_YEAR', displayName: 'Fiscal Year' },
      { id: 'RANGE', displayName: 'Custom date range' },
    ];
  }

  onSubmit(): void {
    const accountNo = this.accountNoList.find((a: any) => a.id === this.formData.accountNo)
      .enrichments.accountNo;
    if (this.formData.downloadType == 'ON_SCREEN') {
      this.step = 2;
      this.loading = true;
      const data = { dataMap: { accountNumber: accountNo } };
      this.httpService
        .httpPost('accountServices/services/accountSummary/private/getAccountStatement', data)
        .subscribe((response: any) => {
          this.onScreenStatements = response.data;
          this.resetFormData();
          this.loading = false;
        });
    } else {
      this.httpService.httpDownload(
        'accountStatements/' +
          this.formData.statementType +
          '/' +
          accountNo +
          this.formData.downloadType,
      );
      this.step = -1;
      this.resetFormData();
      setTimeout(() => {
        this.step = 1;
      }, 10);
    }
  }

  actionEvent(e: { type: string; event?: any }) {
    this.action.emit({ type: e.type, i: this.index });
  }
}
