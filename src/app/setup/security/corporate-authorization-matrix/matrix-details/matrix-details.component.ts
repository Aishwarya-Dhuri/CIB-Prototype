import { Component, Input, OnInit } from '@angular/core';
import { CorporateAuthorizationMatrixComponent } from '../corporate-authorization-matrix.component';

@Component({
  selector: 'aps-matrix-details',
  templateUrl: './matrix-details.component.html',
  styleUrls: ['./matrix-details.component.scss'],
})
export class MatrixDetailsComponent implements OnInit {
  @Input('parentRef') parentRef: CorporateAuthorizationMatrixComponent;

  isShowAccounts: boolean = false;

  accountColDefUrl = 'setup/security/corporateAuthorizationMatrix/private/accountColDef';
  accountRowDataUrl = 'setup/corporateOnboarding/corporateMain/private/getAllAccounts';

  constructor() {}

  ngOnInit(): void {}

  onAccountSelection(accounts: any[]) {
    this.parentRef.formData.accounts = accounts;

    const accountsMapped: string[] = [];

    accounts.forEach((account: any) => {
      accountsMapped.push(account.accountNumber);
    });

    this.parentRef.formData.accountsMapped = accountsMapped.join(', ');
  }
}
