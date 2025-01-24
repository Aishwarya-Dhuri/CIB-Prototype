import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, ValidationErrors } from '@angular/forms';
import _ from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ListingAction } from 'src/app/shared/@components/ag-grid-listing/grid-action-renderer/listing-action.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { CorporateRoleComponent } from '../corporate-role/corporate-role.component';
// import { AuthorizationLimitRendererComponent } from './@components/authorization-limit-renderer/authorization-limit-renderer.component';
// import { CheckboxSelectRendererComponent } from './@components/checkbox-select-renderer/checkbox-select-renderer.component';

import {
  CorporateLoginRestriction,
  RoleDetail,
  CorporateSecurityMapping,
  groupUserDetails,
  IpMapping,
} from './@models/corporate-secuirty-mapping.model';

class UserFields {
  [key: string]: UserAccessField;
}

class UserAccessField {
  id: string;
  category: string;
  fieldName: string;
  field: string;
  criticality: string;
  cibAdmin: string;
  cibUserProfile: string;
  authRule: string;
  lock: string;
}

@Component({
  selector: 'app-corporate-security-mapping',
  templateUrl: './corporate-security-mapping.component.html',
  styleUrls: ['./corporate-security-mapping.component.scss']
})

export class CorporateSecurityMappingComponent implements OnInit {
  @ViewChild('ipMappedGrid') ipMappedGrid: any;
  @ViewChild('step1Form') step1Form: any;
  @ViewChild('step2Form') step2Form: any;
  @ViewChild('step4Form') step4Form: any;
  @ViewChild('corporateRoleView') corporateRoleView: CorporateRoleComponent;

  loading: boolean = false;

  isReviewEdit: boolean = false;
  userAccessFields: UserFields;

  isGroupUser: boolean = false;

  mode!: string;
  isLocation: boolean = false;
  formData: CorporateSecurityMapping = new CorporateSecurityMapping();
  stepperDetails: Stepper = {
    masterName: 'Corporate Security Mapping',
    stepperType: 'vertical',
    currentStep: 1,
    isOnlyFooter: true,
    isSecondLastStepLabelAsReview: true,
    isHideLastStep: true,
    headings: [
      'Security Mapping',
      'Other Details',
      'Review and Submit',
    ],
  };

  isPasswordVisible: boolean = false;
  signatureFiles: any[] = [];

  roleFormData: RoleDetail = new RoleDetail();

  groupRoleFormData: RoleDetail = new RoleDetail();
  groupUserFormData: groupUserDetails = new groupUserDetails();

  roleListReqData: any = {};
  groupRoleListReqData: any = {};

  isFireRoleList: boolean = false;

  roleGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };

  roleInitGridAPI: any;
  groupRoleReviewGridAPI: any;
  groupRoleInitGridAPI: any;
  roleReviewGridAPI: any;
  isShowRoleViewModal: boolean = false;

  loginRestrictionFormData: CorporateLoginRestriction = new CorporateLoginRestriction();

  weekDaysList: Select[] = [];
  filteredWeekDays: Select[] = [];

  loginRestrictionGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };

  ipMappedGridOptions = {
    rowModelType: 'clientSide',
    pagination: false,
    context: {
      componentParent: this,
    },
  };

  loginRestrictionInitGridAPI: any;

  loginRestrictionReviewGridAPI: any;

  editRestrictionIndex: number = -1;

  ipMapping: any = {
    startRange1: '',
    startRange2: '',
    startRange3: '',
    startRange4: '',
    endRange1: '',
    endRange2: '',
    endRange3: '',
    endRange4: '',
  };

  editingIndex: number = -1;
  editing = false;

  showAccountWiseAuthorizationLimit: boolean = false;
  showGroupAccountWiseAuthorizationLimit: boolean = false;

  frameworkComponents: any = {
    // authorizationLimitRenderer: AuthorizationLimitRendererComponent,
    // checkboxSelectRenderer: CheckboxSelectRendererComponent,
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
    public userService: UserService,
    private toasterService: ToasterService,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    /* remove below : starts */
    const actions: Actions = {
      heading: 'Corporate User Initiate',
      subHeading: null,
      // widgetsActions: false,
      refresh: true,
      // widgets: false,
      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Setup' },
      { label: 'Security Bank' },
      { label: 'Corporate User' },
      { label: 'Initiate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType === 'group';

    if (this.isGroupUser) {
      this.formData.isGroupUser = true;
      this.groupUserFormData.groupId = this.userService.userDetails.groupId;
      this.groupUserFormData.groupName = this.userService.userDetails.groupName;
      this.onGroupChange({
        id: this.groupUserFormData.groupId,
        displayName: this.groupUserFormData.groupName,
      });
      this.onIsGroupSelected(this.formData.isGroupUser);
    }

    this.formData.effectiveFrom = this.userService.applicationDate;
    this.formData.corporateId = this.userService.corporateId;
    this.formData.corporateName = this.userService.userDetails.corporateName;
    this.formData.corporateCode = this.userService.userDetails.corporateCode;
    this.getRestrictionWeekDaysList();
    this.getViewData();
  }

  getAccountsData() {
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList')
      .subscribe((response) => {
        this.formData.accountWiseAccess = response.dataList.map((account: any) => {
          return {
            isSelected: false,
            accountNumber: account.displayName,
            authorizationLimit: '0.00',
            currency: account.enrichments.currencyCode,
          };
        });
      });
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/security/corporateSecurityMapping/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();

          // this.isReviewEdit =
          //   this.mode == 'EDIT' &  & formData.enabled == 'Y' && formData.authorized == 'Y';

          if (this.isReviewEdit) {
            const data = { dataMap: { corporateId: this.userService.userDetails.corporateId } };
            this.httpService
              .httpPost('setup/security/userFieldAccess/private/getUserFieldAccess', data)
              .subscribe((response: any) => {
                console.log(response.data);
                this.userAccessFields = response.data[0];
              });
          }

          delete formData.securityQuestionAnswers;
          delete formData.loginPreferenceDetails;

          this.formData = { ...this.formData, ...formData };

          if (this.formData.uploadedFileName) {
            this.signatureFiles = [
              {
                fileName: this.formData.uploadedFileName,
                fileSize: this.formData.signatureFileSize,
                progress: 100,
                status: 'Complete',
              },
            ];
          }

          this.formData.roles.forEach((role: RoleDetail) => {
            role = this.addRoleGridActions(role);
          });

          if (this.roleInitGridAPI) {
            this.roleInitGridAPI.setRowData(this.formData.roles);
          }

          if (this.roleReviewGridAPI) {
            this.roleReviewGridAPI.setRowData(this.formData.roles);
          }

          this.formData.ipMapping.forEach((ipMapping: IpMapping) => {
            this.addIpMappingGridActions(ipMapping);
          });

          if (this.isGroupUser) {
            this.groupUserFormData = formData.groupUserDetails.find(
              (groupUserDetail: groupUserDetails) =>
                groupUserDetail.groupId == this.userService.userDetails.groupId,
            );

            if (this.groupUserFormData) {
              this.groupUserFormData.groupRoles.forEach((groupRole: RoleDetail) => {
                groupRole = this.addGroupRoleGridActions(groupRole);
              });

              if (this.groupRoleInitGridAPI) {
                this.groupRoleInitGridAPI.setRowData(this.groupUserFormData.groupRoles);
              }

              if (this.groupRoleReviewGridAPI) {
                this.groupRoleReviewGridAPI.setRowData(this.groupUserFormData.groupRoles);
              }
            }
          }

          this.formData.corporateLoginRestrictions.forEach(
            (restriction: CorporateLoginRestriction) => {
              restriction = this.addRestrictionGridActions(restriction);
            },
          );
          if (this.loginRestrictionInitGridAPI) {
            this.loginRestrictionInitGridAPI.setRowData(this.formData.corporateLoginRestrictions);
          }
          if (this.loginRestrictionReviewGridAPI) {
            this.loginRestrictionReviewGridAPI.setRowData(this.formData.corporateLoginRestrictions);
          }

          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
          this.loading = false;
        });
    } else {
      this.loading = false;
      this.getAccountsData();
    }
  }

  getRestrictionWeekDaysList(): void {
    this.httpService
      .httpPost('setup/securityBank/bankUser/private/dropdown/restrictionWeekDaysList')
      .subscribe((res: any) => {
        this.weekDaysList = res.dataList;
        this.filteredWeekDays = [...this.weekDaysList];
      });
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.step1Form) {
      return this.step1Form.valid;
    } else if (stepNo == 2 && this.step2Form) {
      return this.step2Form.valid;
    }
    return true;
  }

  setSearchModelData(selectedData: any) {
    this.formData.locationName = selectedData.locationName;
    this.formData.state = selectedData.province;
    this.formData.country = selectedData.country;
  }

  getFormCompletionPercent(form: NgForm): number {
    let total = 0;
    let errorCount = 0;
    Object.keys(form.controls).forEach((key) => {
      total++;
      const controlErrors: ValidationErrors = form.controls[key].errors;
      if (controlErrors != null) {
        errorCount++;
      }
    });
    return Math.round(((total - errorCount) / total) * 100);
  }

  getStepCompletePercentage(stepNo: number): number {
    if (stepNo == 1 && this.step1Form) {
      return this.getFormCompletionPercent(this.step1Form);
    } else if (stepNo == 2 && this.step2Form) {
      return this.getFormCompletionPercent(this.step2Form);
    } else if (stepNo == 3) {
      return this.formData.roles.length > 0 ? 100 : 0;
    } else if (stepNo == 4 && this.step4Form) {
      return this.getFormCompletionPercent(this.step4Form);
    } else if (stepNo == 5) {
      return !this.formData.isLoginRestrictions ||
        this.formData.corporateLoginRestrictions.length > 0
        ? 100
        : 0;
    } else if (stepNo == 6) {
      return this.groupUserFormData.groupRoles.length > 0 ? 100 : 0;
    }
    return 100;
  }

  // getStepFields(stepNo: number): { name: string; value: string }[] {
  //   if (stepNo == 1) {
  //     return [
  //       { name: 'User Id', value: this.formData.userId },
  //       { name: 'Full Name', value: this.formData.firstName + ' ' + this.formData.lastName },
  //     ];
  //   } else if (stepNo == 2) {
  //     return [
  //       { name: 'Employee Code', value: this.formData.employeeCode },
  //       { name: 'Profile', value: this.formData.profileName },
  //     ];
  //   }
  //   return [];
  // }

  onSignatureFileSelected(files: any[]) {
    let filesToUpload = _.cloneDeep(files);
    this.formData.uploadedFileName = '';
    this.formData.signatureFileName = '';
    this.formData.signatureFileSize = 0;
    if (!filesToUpload || filesToUpload.length == 0) return;

    filesToUpload.forEach((file: any) => {
      const data = new FormData();
      data.append('files', file);
      this.httpService
        .httpPost('fileUploadService/setup/security/corporateUser/signature', data)
        .subscribe((res: any) => {
          if (res && res.dataMap && res.dataMap.file) {
            this.formData.uploadedFileName = res.dataMap.file.originalname;
            this.formData.signatureFileName = res.dataMap.file.filename;
            this.formData.signatureFileSize = file.fileSize;
          }
        });
    });
  }

  onGenderChange(gender: Select): void {
    if (!gender) return;
    this.formData.genderName = gender.displayName;
  }

  onProfileChange(profile: Select): void {
    if (!profile) return;
    this.formData.profileName = profile.displayName;
  }

  onGroupUserProfileChange(profile: Select) {
    if (!profile) return;
    this.groupUserFormData.groupProfile = profile.displayName;
  }

  onCategoryChange(category: Select): void {
    if (!category) return;
    this.formData.categoryName = category.displayName;
  }

  onUtilityTypeChange(category: Select): void {
    if (!category) return;
    this.formData.utilityTypeName = category.displayName;
  }

  onH2HreportChange(category: Select): void {
    if (!category) return;
    this.formData.h2hReportName = category.displayName;
  }

  onEncryptionTypeChange(category: Select): void {
    if (!category) return;
    this.formData.encryptionTypeName = category.displayName;
  }

  onDefaultDashboardChange(defaultDashboard: Select): void {
    if (!defaultDashboard) return;
    this.formData.defaultDashboardName = defaultDashboard.displayName;
  }

  onStepChange(stepNo: number) {
    return true;
  }

  onCorporateBranchChange(corporateBranch: Select): void {
    if (!corporateBranch) return;
    this.formData.corporateBranchName = corporateBranch.enrichments.profileName;
  }

  onRoleInitGridReady(api: any): void {
    this.roleInitGridAPI = api;
    this.roleInitGridAPI.setRowData(this.formData.roles);
  }

  onGroupRoleInitGridReady(api: any): void {
    this.groupRoleInitGridAPI = api;
    this.groupRoleInitGridAPI.setRowData(this.groupUserFormData.groupRoles);
  }

  onRoleReviewGridReady(api: any): void {
    this.roleReviewGridAPI = api;
    this.roleReviewGridAPI.setRowData(this.formData.roles);
  }

  onGroupRoleReviewGridReady(api: any): void {
    this.groupRoleReviewGridAPI = api;
    this.groupRoleReviewGridAPI.setRowData(this.groupUserFormData.groupRoles);
  }

  onModuleChange(module: Select): void {
    if (!module) return;
    this.roleFormData.moduleName = module.displayName;
    this.roleListReqData = { moduleId: this.roleFormData.moduleId, requestedBy: 'CORPORATE' };
    this.isFireRoleList = true;
  }

  onGroupUserModuleChange(module: Select): void {
    if (!module) return;
    this.groupRoleFormData.moduleName = module.displayName;
    this.groupRoleListReqData = {
      isGroup: true,
      moduleId: this.groupRoleFormData.moduleId,
      requestedBy: 'CORPORATE',
    };
    this.isFireRoleList = true;
  }

  onGroupChange(group: Select): void {
    if (!group) return;
    this.groupUserFormData.groupName = group.displayName;

    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/groupAccountList', {
        dataMap: { groupId: group.id },
      })
      .subscribe((response) => {
        this.groupUserFormData.groupAccountWiseAccess = response.dataList.map((account: any) => {
          return {
            isSelected: false,
            corporateCodeName:
              account.enrichments.corporateCode + ' - ' + account.enrichments.corporateName,
            accountNumber: account.displayName,
            authorizationLimit: '0.00',
            currency: account.enrichments.currencyCode,
          };
        });

        this.groupUserFormData.mappedAccounts = 0;

        this.groupUserFormData.isTransactionSelfAuthorizer = false;
      });
  }

  onRoleChange(role: Select): void {
    if (!role) return;
    this.roleFormData.roleName = role.displayName;
  }

  onGroupRoleChange(role: Select): void {
    if (!role) return;
    this.groupRoleFormData.roleName = role.displayName;
  }

  onIsGroupSelected(isGroupUser: boolean): void {
    if (isGroupUser) {
      this.formData.isGroupUser = isGroupUser;
      this.stepperDetails.headings.splice(5, 0, 'Group User Details');
      this.stepperDetails?.steps?.splice(5, 0, {});
    } else {
      // this.formData.isGroupUser = isGroupUser;
      // const startIndex = this.stepperDetails.headings.indexOf('Group User Details');
      // const deleteCount = 1;
      // if (startIndex !== -1) {
      //   this.stepperDetails.headings.splice(startIndex, deleteCount);
      //   this.stepperDetails.steps.splice(startIndex, deleteCount);
      // }
    }
  }

  onAddRoleClick(): void {
    let that = this;
    const duplicateRow = _.filter(this.formData.roles, function (row: RoleDetail) {
      return row.moduleId == that.roleFormData.moduleId && row.roleId == that.roleFormData.roleId;
    });

    if (duplicateRow.length > 0) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'This Role is already added',
      });
      this.roleFormData = new RoleDetail();
      return;
    }
    this.roleFormData = this.addRoleGridActions(this.roleFormData);
    this.formData.roles.push({ ...this.roleFormData });
    this.roleInitGridAPI.setRowData(this.formData.roles);
    this.roleReviewGridAPI.setRowData(this.formData.roles);
    this.roleFormData = new RoleDetail();
  }

  onAddGroupRoleClick(): void {
    let that = this;
    const duplicateRow = _.filter(this.groupUserFormData.groupRoles, function (row: RoleDetail) {
      return (
        row.moduleId == that.groupRoleFormData.moduleId &&
        row.roleId == that.groupRoleFormData.roleId
      );
    });

    if (duplicateRow.length > 0) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'This Role is already added',
      });
      this.groupRoleFormData = new RoleDetail();
      return;
    }

    this.groupRoleFormData = this.addGroupRoleGridActions(this.groupRoleFormData);
    this.groupUserFormData.groupRoles.push({ ...this.groupRoleFormData });
    this.groupRoleInitGridAPI.setRowData(this.groupUserFormData.groupRoles);
    this.groupRoleReviewGridAPI.setRowData(this.groupUserFormData.groupRoles);
    this.groupRoleFormData = new RoleDetail();
  }

  addRoleGridActions(role: RoleDetail): RoleDetail {
    const viewAction = {
      index: 1,
      displayName: 'View',
      type: 'ICON',
      icon: 'pi pi-eye',
      methodName: 'viewBankRole',
      paramList: 'roleId',
    };
    const deleteAction = {
      index: 5,
      color: 'warn',
      displayName: 'Delete',
      type: 'ICON',
      icon: 'pi pi-trash',
      methodName: 'delete',
      paramList: 'roleId',
    };
    role.initActions = [viewAction, deleteAction];
    role.reviewActions = [viewAction];
    return role;
  }

  addIpMappingGridActions(ipMapping: IpMapping): IpMapping {
    const editAction = {
      index: 0,
      methodName: 'editIpMapped',
      type: 'ICON',
      displayName: 'Edit',
      icon: 'pi pi-pencil',
      paramList: 'srNo, startRange, endRange',
    };

    const deleteAction = {
      index: 1,
      methodName: 'deleteIpMapped',
      type: 'ICON',
      displayName: 'Delete',
      icon: 'pi pi-trash',
      paramList: 'srNo, startRange, endRange',
    };

    ipMapping.actions = [editAction, deleteAction];
    return ipMapping;
  }

  addGroupRoleGridActions(groupRoles: RoleDetail): RoleDetail {
    const viewAction = {
      index: 1,
      displayName: 'View',
      type: 'ICON',
      icon: 'pi pi-eye',
      methodName: 'viewBankRole',
      paramList: 'roleId',
    };

    const deleteAction = {
      index: 5,
      color: 'warn',
      displayName: 'Delete',
      type: 'ICON',
      icon: 'pi pi-trash',
      methodName: 'deleteGroupUser',
      paramList: 'roleId',
    };

    groupRoles.initActions = [viewAction, deleteAction];

    groupRoles.reviewActions = [viewAction];

    return groupRoles;
  }

  onActionClicked(action: ListingAction, node: any): void {
    if (action.methodName == 'delete' && this.stepperDetails.currentStep == 3) {
      this.formData.roles.splice(node.id, 1);
      this.roleInitGridAPI.setRowData(this.formData.roles);
      this.roleReviewGridAPI.setRowData(this.formData.roles);
    } else if (action.methodName == 'delete' && this.stepperDetails.currentStep == 5) {
      this.formData.corporateLoginRestrictions.splice(node.id, 1);
      this.loginRestrictionInitGridAPI.setRowData(this.formData.corporateLoginRestrictions);
    } else if (action.methodName == 'edit' && this.stepperDetails.currentStep == 5) {
      this.editRestrictionIndex = node.id;
      this.loginRestrictionFormData = node.data;
    } else if (action.methodName == 'delete' && this.stepperDetails.currentStep == 6) {
      this.groupUserFormData.groupRoles.splice(node.id, 1);
      this.groupRoleInitGridAPI.setRowData(this.groupUserFormData.groupRoles);
      this.groupRoleReviewGridAPI.setRowData(this.groupUserFormData.groupRoles);
    }
  }

  delete(roleId: any): void {
    if (this.isReviewEdit && !this.userAccessFields?.remove?.cibAdmin) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'You have no access to Delete the Record',
      });
      return;
    }

    const index = this.formData.roles.findIndex((role: RoleDetail) => role.roleId == roleId);

    if (index >= 0) {
      this.formData.roles.splice(index, 1);
      this.roleInitGridAPI.setRowData(this.formData.roles);
      this.roleReviewGridAPI.setRowData(this.formData.roles);
    }
  }

  deleteGroupUser(roleId: any): void {
    if (this.isReviewEdit && !this.userAccessFields?.groupRemove?.cibAdmin) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'You have no access to Delete the Record',
      });
      return;
    }
    const index = this.groupUserFormData.groupRoles.findIndex(
      (role: RoleDetail) => role.roleId == roleId,
    );

    if (index >= 0) {
      this.groupUserFormData.groupRoles.splice(index, 1);
      this.groupRoleInitGridAPI.setRowData(this.groupUserFormData.groupRoles);
      this.groupRoleReviewGridAPI.setRowData(this.groupUserFormData.groupRoles);
    }
  }

  viewBankRole(roleId: string): void {
    if (this.isReviewEdit && !this.userAccessFields?.viewRights?.cibAdmin) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'You have no access to View the Record',
      });
      return;
    }
    this.isShowRoleViewModal = true;
    this.corporateRoleView.mode = 'VIEW';
    const data = { dataMap: { id: roleId } };
    this.httpService
      .httpPost('setup/security/corporateRole/private/view', data)
      .subscribe((formData: any) => {
        this.corporateRoleView.setViewData(formData);
      });
  }

  viewGroupRole(roleId: string): void {
    this.isShowRoleViewModal = true;
    this.corporateRoleView.mode = 'VIEW';
    const data = { dataMap: { id: roleId } };
    this.httpService
      .httpPost('setup/security/corporateRole/private/view', data)
      .subscribe((formData: any) => {
        this.corporateRoleView.setViewData(formData);
      });
  }

  onSubmitIpMapped(form: NgForm) {
    if (form.valid) {
      const startRange =
        this.ipMapping.startRange1 +
        '.' +
        this.ipMapping.startRange2 +
        '.' +
        this.ipMapping.startRange3 +
        '.' +
        this.ipMapping.startRange4;

      const endRange =
        this.ipMapping.endRange1 +
        '.' +
        this.ipMapping.endRange2 +
        '.' +
        this.ipMapping.endRange3 +
        '.' +
        this.ipMapping.endRange4;

      const ipMapping = {
        srNo: this.editing
          ? this.formData.ipMapping[this.editingIndex].srNo
          : this.formData.ipMapping.length + 1,
        startRange: startRange,
        endRange: endRange,
        actions: [
          {
            index: 0,
            methodName: 'editIpMapped',
            type: 'ICON',
            displayName: 'Edit',
            icon: 'pi pi-pencil',
            paramList: 'srNo, startRange, endRange',
          },
          {
            index: 1,
            methodName: 'deleteIpMapped',
            type: 'ICON',
            displayName: 'Delete',
            icon: 'pi pi-trash',
            paramList: 'srNo, startRange, endRange',
          },
        ],
      };

      form.reset();

      if (this.editingIndex >= 0) {
        this.formData.ipMapping[this.editingIndex] = ipMapping;
        this.editingIndex = -1;
        this.editing = false;
      } else {
        this.formData.ipMapping.push(ipMapping);
      }

      if (this.ipMappedGrid) {
        this.ipMappedGrid.setRowData(this.formData.ipMapping);
      }
    }
  }

  editIpMapped(srNo: string, startRangeParam: string, endRangeParam: string) {
    this.editingIndex = this.formData.ipMapping.findIndex(
      (parameters: any) => parameters.srNo === srNo,
    );

    this.editing = true;

    const startRange = startRangeParam.split('.');
    const endRange = endRangeParam.split('.');

    this.ipMapping = {
      startRange1: startRange[0],
      startRange2: startRange[1],
      startRange3: startRange[2],
      startRange4: startRange[3],
      endRange1: endRange[0],
      endRange2: endRange[1],
      endRange3: endRange[2],
      endRange4: endRange[3],
    };
  }

  deleteIpMapped(srNo: string, startRange: string, endRange: string) {
    const i = this.formData.ipMapping.findIndex((parameters: any) => parameters.srNo === srNo);
    if (i >= 0) {
      if (this.editing && i === this.editingIndex) {
        this.editing = false;
        this.editingIndex = -1;
      }

      this.formData.ipMapping.splice(i, 1);

      if (this.ipMappedGrid) {
        this.ipMappedGrid.setRowData(this.formData.ipMapping);
      }
    }
  }

  onLoginRestrictionInitGridReady(api: any): void {
    this.loginRestrictionInitGridAPI = api;
    this.loginRestrictionInitGridAPI.setRowData(this.formData.corporateLoginRestrictions);
  }

  onLoginRestrictionReviewGridReady(api: any): void {
    this.loginRestrictionReviewGridAPI = api;
    this.loginRestrictionReviewGridAPI.setRowData(this.formData.corporateLoginRestrictions);
  }

  onDayChange(day: Select): void {
    if (!day) return;
    this.loginRestrictionFormData.weekday = day.displayName;
  }

  onAddOrUpdateRestrictionClick(): void {
    let that = this;
    const duplicateRow = _.filter(
      this.formData.corporateLoginRestrictions,
      function (row: CorporateLoginRestriction) {
        return row.weekdayno == that.loginRestrictionFormData.weekdayno;
      },
    );
    if (duplicateRow.length > 0 && this.editRestrictionIndex == -1) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: this.loginRestrictionFormData.weekday + ' is already added',
      });
      this.loginRestrictionFormData.weekday = '';
      this.loginRestrictionFormData.weekdayno = '';
      return;
    }
    this.loginRestrictionFormData = this.addRestrictionGridActions(this.loginRestrictionFormData);
    if (this.editRestrictionIndex == -1) {
      this.formData.corporateLoginRestrictions.push({ ...this.loginRestrictionFormData });
    } else {
      this.formData.corporateLoginRestrictions[this.editRestrictionIndex] = {
        ...this.loginRestrictionFormData,
      };
    }
    this.loginRestrictionInitGridAPI.setRowData(this.formData.corporateLoginRestrictions);
    this.loginRestrictionReviewGridAPI.setRowData(this.formData.corporateLoginRestrictions);
    this.onResetClick();
  }

  addRestrictionGridActions(restriction: CorporateLoginRestriction): CorporateLoginRestriction {
    restriction.actions = [
      {
        index: 2,
        displayName: 'Edit',
        type: 'ICON',
        icon: 'pi pi-pencil',
        methodName: 'edit',
        paramList: 'rowId',
      },
      {
        index: 5,
        color: 'warn',
        displayName: 'Delete',
        type: 'ICON',
        icon: 'pi pi-trash',
        methodName: 'delete',
        paramList: 'rowId',
      },
    ];
    return restriction;
  }

  onResetClick(): void {
    this.editRestrictionIndex = -1;
    this.loginRestrictionFormData = new CorporateLoginRestriction();
  }

  onTransactionSelfAuthorizer() {
    if (this.formData.transactionSelfAuthorizer) {
      this.showAccountWiseAuthorizationLimit = true;
    } else {
      this.formData.accountWiseAccess = this.formData.accountWiseAccess.map((account: any) => {
        account.isSelected = false;
        account.authorizationLimit = '0.00';
        return account;
      });

      this.formData.mappedAccounts = 0;
    }
  }

  saveAccountWiseAuthorizationLimit() {
    if (this.stepperDetails.currentStep == this.stepperDetails.headings.length) {
      this.showAccountWiseAuthorizationLimit = false;
      return;
    }

    this.formData.mappedAccounts = this.formData.accountWiseAccess.filter(
      (account: any) => account.isSelected,
    ).length;

    if (this.formData.mappedAccounts == 0) {
      this.formData.transactionSelfAuthorizer = false;
    }

    this.showAccountWiseAuthorizationLimit = false;
  }

  onGroupTransactionSelfAuthorizer() {
    if (this.groupUserFormData.isTransactionSelfAuthorizer) {
      this.showGroupAccountWiseAuthorizationLimit = true;
    } else {
      this.groupUserFormData.groupAccountWiseAccess =
        this.groupUserFormData.groupAccountWiseAccess.map((account: any) => {
          account.isSelected = false;
          account.authorizationLimit = '0.00';
          return account;
        });

      this.groupUserFormData.mappedAccounts = 0;
    }
  }

  saveGroupAccountWiseAuthorizationLimit() {
    if (this.stepperDetails.currentStep == this.stepperDetails.headings.length) {
      this.showGroupAccountWiseAuthorizationLimit = false;
      return;
    }
    this.groupUserFormData.mappedAccounts = this.groupUserFormData.groupAccountWiseAccess.filter(
      (account: any) => account.isSelected,
    ).length;

    if (this.groupUserFormData.mappedAccounts == 0) {
      this.groupUserFormData.isTransactionSelfAuthorizer = false;
    }

    this.showGroupAccountWiseAuthorizationLimit = false;
  }

  beforeSubmit(): boolean {
    this.formData.roles.forEach((role: RoleDetail) => {
      delete role.initActions;
      delete role.reviewActions;
    });
    // this.formData.groupUser.forEach((groupUser: GroupUser) => {
    //   delete groupUser.initActions;
    //   delete groupUser.reviewActions;
    // });

    this.formData.corporateLoginRestrictions.forEach((restriction: CorporateLoginRestriction) => {
      delete restriction.actions;
    });

    this.formData.ipMapping.forEach((ipMapping: IpMapping) => {
      delete ipMapping.actions;
    });

    this.groupUserFormData.groupRoles.forEach((role: RoleDetail) => {
      delete role.initActions;
      delete role.reviewActions;
    });

    if (this.mode == 'EDIT') {
      const groupUserFormDataIndex = this.formData.groupUserDetails.findIndex(
        (groupUserDetail: groupUserDetails) =>
          groupUserDetail.groupId == this.userService.userDetails.groupId,
      );

      if (groupUserFormDataIndex >= 0) {
        this.formData.groupUserDetails[groupUserFormDataIndex] = this.groupUserFormData;
      }
    } else {
      this.formData.groupUserDetails.push(this.groupUserFormData);
    }

    console.log(JSON.stringify(this.formData));

    return true;
  }

}
