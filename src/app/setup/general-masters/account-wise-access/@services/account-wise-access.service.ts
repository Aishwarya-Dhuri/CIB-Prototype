import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class AccountWiseAccessService {
  private selectedUsers: any[] = [];
  private products: any[] = [];
  private selectedProducts: any[] = [];
  private selectedProductsTree: any[] = [];
  private selectedAccounts: any[] = [];
  private selectedTemplate: any = {};
  private userAccountSelectedCount: number = 0;

  accessMappingAccountColDefUrl =
    'setup/generalMasters/accountWiseAccess/private/accessMappingAccountColDef';
  accessMappingAccountHeaderSelectionColDefUrl =
    'setup/generalMasters/accountWiseAccess/private/accessMappingAccountHeaderSelectionColDef';
  accountColDefUrl = 'setup/generalMasters/accountWiseAccess/private/accountColDef';
  accountHeaderSelectionColDefUrl =
    'setup/generalMasters/accountWiseAccess/private/accountHeaderSelectionColDef';
  accountsRowDataUrl = 'setup/generalMaster/accountWiseAccess/private/getAccounts';

  userColDefUrl = 'setup/generalMasters/accountWiseAccess/private/userColDef';
  userHeaderSelectionColDefUrl =
    'setup/generalMasters/accountWiseAccess/private/userHeaderSelectionColDef';
  usersRowDataUrl = 'setup/generalMaster/accountWiseAccess/private/getUsers';

  productsDataUrl = 'setup/generalMaster/accountWiseAccess/private/getProducts';

  constructor() {}

  setSelectedUsers(selectedUsers: any[]) {
    this.selectedUsers = selectedUsers;
  }

  getSelectedUsers() {
    return cloneDeep(this.selectedUsers);
  }

  setProducts(products: any[]) {
    this.products = products;
  }

  getProducts() {
    return cloneDeep(this.products);
  }

  setSelectedProducts(selectedProducts: any[]) {
    this.selectedProducts = selectedProducts;
  }

  getSelectedProducts() {
    return this.selectedProducts;
  }

  setSelectedProductsTree(selectedProductsTree: any[]) {
    this.selectedProductsTree = selectedProductsTree;
  }

  getSelectedProductsTree() {
    return this.selectedProductsTree;
  }

  setSelectedAccounts(selectedAccounts: any[]) {
    this.selectedAccounts = selectedAccounts;
  }

  getSelectedAccounts() {
    return this.selectedAccounts;
  }

  setSelectedTemplate(selectedTemplate: any) {
    this.selectedTemplate = selectedTemplate;
  }

  getSelectedTemplate() {
    return this.selectedTemplate;
  }

  setUserAccountSelectedCount(userAccountSelectedCount: any) {
    this.userAccountSelectedCount = userAccountSelectedCount;
  }

  getUserAccountSelectedCount() {
    return this.userAccountSelectedCount;
  }

  resetAccountWiseAccess() {
    this.selectedUsers = [];
    this.selectedProducts = [];
    this.selectedProductsTree = [];
    this.selectedAccounts = [];
    this.products = [];
    this.selectedTemplate = {};
    this.userAccountSelectedCount = 0;
  }
}
