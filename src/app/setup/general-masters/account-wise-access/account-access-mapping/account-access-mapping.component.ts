import { Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { AccountWiseAccessService } from '../@services/account-wise-access.service';
import { cloneDeep } from 'lodash';
import { UserService } from 'src/app/shared/@services/user.service';
import { AccountWiseAccessComponent } from '../account-wise-access.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-account-access-mapping',
  templateUrl: './account-access-mapping.component.html',
  styleUrls: ['./account-access-mapping.component.scss'],
})
export class AccountAccessMappingComponent implements OnInit, OnDestroy {
  @ViewChild('usersAccounts')
  public usersAccounts: any;

  @Input('parentRef') parentRef: AccountWiseAccessComponent;

  loading: boolean;

  userAccountSelectedCount: number = 0;

  copyFromUsers = false;
  copyFromAccounts = false;
  copyFromProduct = false;
  selectingRows = false;

  copyProducts: any[] = [];

  tabs: string[] = ['All', 'Selected', 'Unselected'];
  currentTab: string;

  customModalStyle: any = {};

  selectedUsersAccounts: any[] = [];

  usersAccountsHeader: string;
  showMoreUsersAccounts = false;

  gridOptions: any;
  gridHeader: string;
  gridColumnDefsUrl: string = '';

  allRowData: any[] = [];
  selectedRowData: any[] = [];
  unselectedRowData: any[] = [];

  products: any[] = [];
  currentProduct: any;
  selectedProducts: any[] = [];
  selectedProductsTree: any[] = [];

  constructor(
    private accountWiseAccessService: AccountWiseAccessService,
    private httpService: HttpService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.currentTab = this.tabs[0];

    this.userAccountSelectedCount = this.accountWiseAccessService.getUserAccountSelectedCount();
    this.selectedProductsTree = this.accountWiseAccessService.getSelectedProductsTree();
    this.selectedProducts = this.accountWiseAccessService.getSelectedProducts();
    this.allRowData = [];
    this.selectedRowData = [];
    this.unselectedRowData = [];

    if (
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[0].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[2].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[3].id
    ) {
      // User to Account --- OR --- Product to User --- OR --- Template to User

      this.usersAccountsHeader = 'Users';
      this.gridHeader = 'Accounts';

      this.gridColumnDefsUrl =
        this.accountWiseAccessService.accessMappingAccountHeaderSelectionColDefUrl;

      this.selectedUsersAccounts = this.accountWiseAccessService.getSelectedUsers();
    } else if (this.parentRef.selectedAccessType === this.parentRef.accessTypeList[1].id) {
      // Account to User
      this.usersAccountsHeader = 'Accounts';
      this.gridHeader = 'Users';

      this.gridColumnDefsUrl = this.accountWiseAccessService.userHeaderSelectionColDefUrl;

      this.selectedUsersAccounts = this.accountWiseAccessService.getSelectedAccounts();
    }

    this.gridOptions = {
      rowData: this.allRowData,
      pagination: false,
      rowModelType: 'clientSide',
      rowSelection: 'multiple',
    };

    this.products = this.accountWiseAccessService.getProducts();

    if (this.products.length == 0) {
      const data = { dataMap: { corporateId: this.userService.userDetails.corporateId } };

      this.httpService
        .httpPost('setup/generalMaster/accountWiseAccess/private/getProducts', data)
        .subscribe((response: any) => {
          this.products = response.data;

          if (this.selectedProductsTree.length > 0) {
            this.setSelectedProductTree();
          }

          this.copyProducts = cloneDeep(response.data).map((product: any) => {
            product.children = [];
            return product;
          });

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onGridReady() {
    let selectedDataGridRowData = [];

    if (
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[0].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[2].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[3].id
    ) {
      selectedDataGridRowData = this.accountWiseAccessService.getSelectedAccounts();
    } else if (this.parentRef.selectedAccessType === this.parentRef.accessTypeList[1].id) {
      selectedDataGridRowData = this.accountWiseAccessService.getSelectedUsers();
    }

    if (selectedDataGridRowData.length > 0) {
      selectedDataGridRowData.forEach((data: any) => {
        this.usersAccounts.selectRow(data, 'uaid');
      });
    }
  }

  rowSelected(rowData: any) {
    if (this.selectingRows) {
      return;
    }

    if (rowData.node.selected) {
      this.selectedRowData.push(rowData.data);

      this.userAccountSelectedCount++;

      this.currentProduct.selectedData.push(rowData.data);

      this.currentProduct.data = +this.currentProduct.data + 1;

      const index = this.unselectedRowData.findIndex(
        (usersAccounts: any) => usersAccounts.uaid === rowData.data.uaid,
      );

      if (index >= 0) {
        this.unselectedRowData.splice(index, 1);
      }
    } else {
      this.unselectedRowData.push(rowData.data);

      this.userAccountSelectedCount--;

      this.currentProduct.data = +this.currentProduct.data - 1;

      const index = this.selectedRowData.findIndex(
        (usersAccounts: any) => usersAccounts.uaid === rowData.data.uaid,
      );

      if (index >= 0) {
        this.selectedRowData.splice(index, 1);
      }

      const productDataIndex = this.currentProduct.selectedData.findIndex(
        (usersAccounts: any) => usersAccounts.uaid === rowData.data.uaid,
      );

      if (productDataIndex >= 0) {
        this.currentProduct.selectedData.splice(productDataIndex, 1);
      }
    }
  }

  changeTab(tab: string) {
    if (this.currentTab !== tab) {
      this.currentTab = tab;

      this.selectingRows = true;

      if (tab === this.tabs[0]) {
        this.usersAccounts.setRowData(this.allRowData);

        this.selectedRowData.forEach((data: any) => {
          this.usersAccounts.selectRow(data, 'uaid');
        });
      } else if (tab === this.tabs[1]) {
        this.usersAccounts.setRowData(this.selectedRowData);

        this.usersAccounts.selectAllRow();
      } else if (tab === this.tabs[2]) {
        this.usersAccounts.setRowData(this.unselectedRowData);
      }

      setTimeout(() => {
        this.selectingRows = false;
      });
    }
  }

  nodeChecked(event: any) {
    console.log(event);
    if (event.checked) {
      this.labelClicked(event.treeNode);
    }
  }

  labelClicked(event: any) {
    const currentProduct = event;

    this.currentProduct = currentProduct;

    let rowData: any[] = [];

    if (
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[0].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[2].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[3].id
    ) {
      //getAccountRowData

      rowData = currentProduct.accounts ? currentProduct.accounts : [];
    } else {
      rowData = currentProduct.users ? currentProduct.users : [];
    }

    this.allRowData = cloneDeep(rowData);

    this.unselectedRowData = cloneDeep(rowData);

    this.selectedRowData = currentProduct.selectedData
      ? cloneDeep(currentProduct.selectedData)
      : [];

    this.selectedRowData.forEach((selectedData: any) => {
      const index = this.unselectedRowData.findIndex(
        (usersAccounts: any) => usersAccounts.uaid === selectedData.uaid,
      );

      if (index >= 0) {
        this.unselectedRowData.splice(index, 1);
      }
    });

    this.selectingRows = true;

    if (this.currentTab === this.tabs[0]) {
      this.usersAccounts.setRowData(this.allRowData);

      this.selectedRowData.forEach((data: any) => {
        this.usersAccounts.selectRow(data, 'uaid');
      });
    } else if (this.currentTab === this.tabs[1]) {
      this.usersAccounts.setRowData(this.selectedRowData);

      this.usersAccounts.selectAllRow();
    } else if (this.currentTab === this.tabs[2]) {
      this.usersAccounts.setRowData(this.unselectedRowData);
    }

    setTimeout(() => {
      this.selectingRows = false;
    });
  }

  leafNodeChecked(event: any) {
    // Work In Progress
    if (event.checked) {
      this.selectedProducts.push(event.leafNode);
    } else {
      const index = this.selectedProducts.findIndex(
        (product: any) => product.label === event.leafNode.label,
      );

      if (index >= 0) {
        this.selectedProducts.splice(index, 1);
      }
    }
  }

  getTabUsersAccountsLength(tab: string) {
    if (tab === this.tabs[0]) {
      return this.allRowData.length;
    } else if (tab === this.tabs[1]) {
      return this.selectedRowData.length;
    } else if (tab === this.tabs[2]) {
      return this.unselectedRowData.length;
    }
    return 0;
  }

  getSelectedProducts(products: any[]) {
    return products.filter((o) => {
      if (o.children) o.children = this.getSelectedProducts(o.children);
      return o.check === true || o.partialCheck === true;
    });
  }

  setSelectedProductTree() {
    this.selectedProductsTree.forEach((treeProduct: any) => {
      const pIndex = this.products.findIndex((product: any) => product.key == treeProduct.key);

      if (pIndex >= 0) {
        this.products[pIndex].check = treeProduct.check;
        this.products[pIndex].partialCheck = treeProduct.partialCheck;
        this.products[pIndex].selectedData = treeProduct.selectedData;
        this.products[pIndex].data = treeProduct.data;

        if (treeProduct.children && treeProduct.children.length > 0) {
          treeProduct.children.forEach((subTreeProduct: any) => {
            const spIndex = this.products[pIndex].children.findIndex(
              (subProduct: any) => subProduct.key == subTreeProduct.key,
            );

            if (spIndex >= 0) {
              this.products[pIndex].children[spIndex].check = subTreeProduct.check;
              this.products[pIndex].children[spIndex].partialCheck = subTreeProduct.partialCheck;
              this.products[pIndex].children[spIndex].selectedData = subTreeProduct.selectedData;
              this.products[pIndex].children[spIndex].data = subTreeProduct.data;

              if (subTreeProduct.children && subTreeProduct.children.length > 0) {
                subTreeProduct.children.forEach((subTreeProductChild: any) => {
                  const spcIndex = this.products[pIndex].children[spIndex].children.findIndex(
                    (subProductChild: any) => subProductChild.key == subTreeProductChild.key,
                  );

                  if (spcIndex >= 0) {
                    this.products[pIndex].children[spIndex].children[spcIndex].check =
                      treeProduct.check;
                    this.products[pIndex].children[spIndex].children[spcIndex].partialCheck =
                      treeProduct.partialCheck;
                    this.products[pIndex].children[spIndex].children[spcIndex].selectedData =
                      treeProduct.selectedData;
                    this.products[pIndex].children[spIndex].children[spcIndex].data =
                      treeProduct.data;

                    this.selectedProducts.push(
                      this.products[pIndex].children[spIndex].children[spcIndex],
                    );
                  }
                });
              }
            } else {
              this.selectedProducts.push(this.products[pIndex].children[spIndex]);
            }
          });
        } else {
          this.selectedProducts.push(this.products[pIndex]);
        }
      }
    });
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

  ngOnDestroy() {
    this.accountWiseAccessService.setProducts(this.products);

    const products: any[] = cloneDeep(this.products);

    this.selectedProductsTree = this.getSelectedProducts(products);
    this.accountWiseAccessService.setSelectedProductsTree(this.selectedProductsTree);
    this.accountWiseAccessService.setSelectedProducts(this.selectedProducts);
    this.accountWiseAccessService.setUserAccountSelectedCount(this.userAccountSelectedCount);
    if (this.parentRef.selectedAccessType === this.parentRef.accessTypeList[0].id) {
      this.accountWiseAccessService.setSelectedAccounts(this.selectedRowData);
    } else if (this.parentRef.selectedAccessType === this.parentRef.accessTypeList[1].id) {
      this.accountWiseAccessService.setSelectedUsers(this.selectedRowData);
    }
  }
}
