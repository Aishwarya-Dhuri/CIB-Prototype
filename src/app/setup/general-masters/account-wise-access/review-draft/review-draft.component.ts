import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AccountWiseAccessService } from '../@services/account-wise-access.service';
import { AccountWiseAccessComponent } from '../account-wise-access.component';

@Component({
  selector: 'app-review-draft',
  templateUrl: './review-draft.component.html',
  styleUrls: ['./review-draft.component.scss'],
})
export class ReviewDraftComponent implements OnInit {
  @ViewChild('usersAccounts')
  public usersAccounts: any;

  @Input('parentRef') parentRef: AccountWiseAccessComponent;

  loading: boolean;

  showMoreUsersAccounts = false;
  minUsersAccounts: string = '';
  moreUsersAccounts: string;
  userAccountSelectedCount: number;

  customModalStyle: any = {};

  products: any[] = [];
  selectedProduct: any;

  gridColumnDefUrl: string = '';
  selectedRowData: any[] = [];
  gridOptions: any;
  gridHeader: string;

  selectedUsersAccounts: any[] = [];
  usersAccountsHeader: string;

  constructor(private accountWiseAccessService: AccountWiseAccessService) {}

  ngOnInit(): void {
    this.loading = true;

    this.products = this.accountWiseAccessService.getSelectedProductsTree();
    this.userAccountSelectedCount = this.accountWiseAccessService.getUserAccountSelectedCount();

    this.selectedRowData = [];

    if (
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[0].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[2].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[3].id
    ) {
      this.usersAccountsHeader = 'Users';
      this.gridHeader = 'Accounts';

      this.gridColumnDefUrl = this.accountWiseAccessService.accessMappingAccountColDefUrl;

      this.selectedUsersAccounts = this.accountWiseAccessService.getSelectedUsers();
    } else if (this.parentRef.selectedAccessType === this.parentRef.accessTypeList[1].id) {
      this.usersAccountsHeader = 'Accounts';
      this.gridHeader = 'Users';

      this.gridColumnDefUrl = this.accountWiseAccessService.userColDefUrl;

      this.selectedUsersAccounts = this.accountWiseAccessService.getSelectedAccounts();
    }

    this.gridOptions = {
      rowData: this.selectedRowData,
      pagination: false,
      rowModelType: 'clientSide',
    };

    setTimeout(() => {
      this.loading = false;
    });
  }

  productSelected(selectedProduct: any) {
    this.selectedProduct = selectedProduct;

    this.selectedRowData = selectedProduct.selectedData;

    this.usersAccounts.setRowData(this.selectedRowData);
  }

  showMoreOptions(e: MouseEvent): void {
    this.showMoreUsersAccounts = true;

    let transform = 'translate(-' + e.offsetX + 'px, ' + -Math.abs(e.offsetY) + 'px)';
    this.customModalStyle = {
      position: 'absolute',
      top: e.pageY + 'px',
      left: e.pageX + 'px',
      transform: transform,
      'box-shadow': '0px 0px 10px #ebebeb !important',
      width: 'auto',
      'z-index': '1',
      padding: '0.75rem',
    };
  }
}
