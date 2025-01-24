import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { AccountWiseAccessService } from './@services/account-wise-access.service';
import { AccountAccessMappingComponent } from './account-access-mapping/account-access-mapping.component';
import { AccountTypeSelectionComponent } from './account-type-selection/account-type-selection.component';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-account-wise-access',
  templateUrl: './account-wise-access.component.html',
  styleUrls: ['./account-wise-access.component.scss'],
})
export class AccountWiseAccessComponent implements OnInit, OnDestroy {
  @ViewChild('accountTypeSelection') accountTypeSelectionComponent: AccountTypeSelectionComponent;
  @ViewChild('accountAccessMapping') accountAccessMappingComponent: AccountAccessMappingComponent;

  loading: boolean = true;

  showTemplates = false;

  mode: string;

  formData: any = {
    accessType: '',
    users: [],
    accounts: [],
    products: [],
  };

  accessTypeList: any[];
  selectedAccessType: string;
  selectedAccessTypeName: string;

  stepperDetails = {
    masterName: 'Account Wise Access',
    currentStep: 1,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['Select Access Type', 'Access Mapping', 'Review Details & Confirm'],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private accountWiseAccessService: AccountWiseAccessService,
    private viewService: ViewService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.accessTypeList = [
      { id: 'USERS_TO_ACCOUNTS', displayName: 'Users to Accounts' },
      { id: 'ACCOUNTS_TO_USERS', displayName: 'Accounts to Users' },
      { id: 'PRODUCTS_TO_USERS', displayName: 'Products to Users' },
      { id: 'TEMPLATE_TO_USERS', displayName: 'Template to Users' },
    ];

    this.accessTypeChanged(this.accessTypeList[0]);

    const actions: Actions = {
      heading: 'Account Wise Access - Initiate',
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
      { label: 'Account Wise Access' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'VIEW') {
      this.stepperDetails.currentStep = this.stepperDetails.headings.length;
    }

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('setup/generalMasters/accountWiseAccess/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.prepareFormData(formData);

          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  getSubHeading(stepNo: number): string {
    if (stepNo == 1) {
      return this.selectedAccessTypeName;
    } else if (stepNo == 2) {
      return (
        'Products / Sub Products Mapped :' +
        this.accountWiseAccessService.getSelectedProductsTree().length.toString()
      );
    }
    return 'Step' + stepNo + ' Details';
  }

  prepareFormData(formData: any) {
    this.formData = formData;

    const accessType: any = this.accessTypeList.find((at: any) => at.id == formData.accessType);

    this.accessTypeChanged(accessType);

    this.formData.accessType = this.selectedAccessType;

    this.selectedAccessType === this.accessTypeList[1].id
      ? this.accountWiseAccessService.setUserAccountSelectedCount(formData.noOfUsers)
      : this.accountWiseAccessService.setUserAccountSelectedCount(formData.noOfAccounts);

    this.accountWiseAccessService.setSelectedProductsTree(this.formData.products);

    if (
      this.selectedAccessType === this.accessTypeList[0].id ||
      this.selectedAccessType === this.accessTypeList[2].id ||
      this.selectedAccessType === this.accessTypeList[3].id
    ) {
      this.accountWiseAccessService.setSelectedUsers(formData.users);
    } else if (this.selectedAccessType === this.accessTypeList[1].id) {
      this.accountWiseAccessService.setSelectedAccounts(formData.accounts);
    }
  }

  beforeSaveDraft() {
    this.prepareBeforeFormData();
    this.formData.products = this.prepareTreeData(
      this.accountWiseAccessService.getSelectedProductsTree(),
    );
    return true;
  }

  beforeSaveTemplate() {
    this.prepareBeforeFormData();
    this.formData.products = this.prepareTreeData(
      this.accountWiseAccessService.getSelectedProductsTree(),
    );
    // this.formData.selectedProducts = this.prepareTreeData(
    //   this.accountWiseAccessService.getSelectedProductsTree(),
    // );
    return true;
  }

  beforeSubmit() {
    this.prepareBeforeFormData();
    this.formData.products = this.prepareTreeData(
      this.accountWiseAccessService.getSelectedProductsTree(),
    );

    this.prepareBeforeSubmit();
    return true;
  }

  prepareBeforeSubmit() {
    const data: any = {
      noOfUsers: this.formData.noOfUsers,
      batchId: '1234',
      noOfProducts: this.formData.noOfProducts,
      noOfAccounts: this.formData.noOfAccounts,
      accessType: this.formData.accessType,
      mappingDetList: [],
    };

    this.formData.users.forEach((user: any) => {
      this.formData.products.forEach((p: any) => {
        const c0 = {
          cashproProductName: p.label,
          cashproProductKey: p.key,
          ccashproProductId: p.id,
          userId: user.userId,
          data: p.data,
          level: 0,
          subProductName: '',
          subProductKet: '',
          subProductId: '',
          serviceTemplateName: '',
          serviceTemplateKey: '',
          serviceTemplateId: '',
          accountList: p.selectedData,
        };
        data.mappingDetList.push(c0);

        p.children.forEach((pp: any) => {
          const c1 = {
            cashproProductName: p.label,
            cashproProductKey: p.key,
            ccashproProductId: p.id,
            userId: user.userId,
            subProductName: pp.label,
            subProductKet: pp.key,
            subProductId: pp.id,
            data: pp.data,
            level: 1,
            serviceTemplateName: '',
            serviceTemplateKey: '',
            serviceTemplateId: '',
            accountList: pp.selectedData,
          };
          data.mappingDetList.push(c1);

          p.children.forEach((ppp: any) => {
            const c2 = {
              cashproProductName: p.label,
              cashproProductKey: p.key,
              ccashproProductId: p.id,
              userId: user.userId,
              subProductName: pp.label,
              subProductKet: pp.key,
              subProductId: pp.id,
              serviceTemplateName: ppp.label,
              serviceTemplateKey: ppp.key,
              serviceTemplateId: ppp.id,
              data: ppp.data,
              level: 2,
              accountList: ppp.selectedData,
            };

            data.mappingDetList.push(c2);
          });
        });
      });
    });
  }

  prepareBeforeLoad(formData: any) {
    const child0 = formData.filter((data0: any) => data0.level == 0);

    const children0 = [];

    child0.forEach((c0: any) => {
      const child1 = formData.filter(
        (data1: any) => data1.level == 1 && data1.ccashproProductId == c0.ccashproProductId,
      );

      const children1 = [];

      child1.forEach((c1: any) => {
        const child2 = formData.filter(
          (data2: any) =>
            data2.level == 2 &&
            data2.ccashproProductId == c0.ccashproProductId &&
            data2.subProductId == c1.subProductId,
        );

        const children2 = [];

        child2.forEach((c2: any) => {
          children2.push({
            label: c2.serviceTemplateName,
            key: c2.serviceTemplateKey,
            id: c2.serviceTemplateId,
            data: c2.data,
            selectedData: c2.accountList,
          });
        });

        children1.push({
          label: c1.subProductName,
          key: c1.subProductKey,
          id: c1.subProductId,
          data: c1.data,
          selectedData: c1.accountList,
          children: children2,
        });
      });

      children0.push({
        label: c0.subProductName,
        key: c0.subProductKey,
        id: c0.subProductId,
        data: c0.data,
        selectedData: c0.accountList,
        children: children1,
      });
    });

    const data = {
      products: children0,
    };
  }

  private prepareBeforeFormData() {
    this.formData.accessType = this.selectedAccessType;

    this.formData.noOfUsers =
      this.selectedAccessType === this.accessTypeList[1].id
        ? this.accountWiseAccessService.getUserAccountSelectedCount()
        : this.accountWiseAccessService.getSelectedUsers().length;

    this.formData.noOfAccounts =
      this.selectedAccessType === this.accessTypeList[1].id
        ? this.accountWiseAccessService.getSelectedAccounts().length
        : this.accountWiseAccessService.getUserAccountSelectedCount();

    this.formData.noOfProducts = this.accountWiseAccessService.getSelectedProducts().length;

    if (
      this.selectedAccessType === this.accessTypeList[0].id ||
      this.selectedAccessType === this.accessTypeList[2].id ||
      this.selectedAccessType === this.accessTypeList[3].id
    ) {
      this.formData.users = this.accountWiseAccessService.getSelectedUsers();
    } else if (this.selectedAccessType === this.accessTypeList[1].id) {
      this.formData.accounts = this.accountWiseAccessService.getSelectedAccounts();
    }
  }

  prepareTreeData(products: any[]) {
    return products.map((product: any) => {
      delete product.accounts;
      delete product.users;

      if (product.children && product.children.length > 0) {
        product.children = this.prepareTreeData(product.children);
      }

      return product;
    });
  }

  accessTypeChanged(accessType?: any) {
    this.loading = true;
    this.selectedAccessType = accessType.id;
    this.selectedAccessTypeName = accessType.displayName;

    if (
      this.accountTypeSelectionComponent &&
      (accessType.id === this.accessTypeList[0].id || accessType.id === this.accessTypeList[1].id)
    ) {
      this.accountTypeSelectionComponent.setGridData();
    } else if (accessType.id === this.accessTypeList[3].id) {
      this.showTemplates = true;
      if (!this.mode) {
        this.loading = false;
      }
      return;
    }

    this.showTemplates = false;

    this.loading = false;
  }

  useThisTemplate() {
    this.loading = true;

    const template = this.accountWiseAccessService.getSelectedTemplate();

    const data = {
      dataMap: { id: template.id },
    };

    this.httpService
      .httpPost('setup/generalMasters/accountWiseAccess/private/viewTemplate', data)
      .subscribe((formData: any) => {
        this.viewService.clearAll();
        this.prepareFormData(formData);
      });

    this.showTemplates = false;
  }

  ngOnDestroy(): void {
    this.accountWiseAccessService.resetAccountWiseAccess();
  }
}
