import { AddSlabComponent } from './security/corporate-authorization-matrix/add-users/add-slab/add-slab.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CurrencyComponent } from './general-masters/currency/currency.component';
import { CorporateProfileComponent } from './security/corporate-profile/corporate-profile.component';
import { SetupRoutingModule } from './setup-routing.module';
import { CorporateAuthorizationMatrixComponent } from './security/corporate-authorization-matrix/corporate-authorization-matrix.component';
import { AddUsersComponent } from './security/corporate-authorization-matrix/add-users/add-users.component';
import { MatrixDetailsComponent } from './security/corporate-authorization-matrix/matrix-details/matrix-details.component';
import { ReviewAndSubmitComponent } from './security/corporate-authorization-matrix/review-and-submit/review-and-submit.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { RenderAvatarGroupComponent } from './security/corporate-authorization-matrix/@components/render-avatar-group/render-avatar-group.component';
import { ProfilePictureRendererComponent } from './security/corporate-authorization-matrix/@components/profile-picture-renderer/profile-picture-renderer.component';
import { ActionsRendererComponent } from './security/corporate-authorization-matrix/@components/actions-renderer/actions-renderer.component';
import { CorporateProductComponent } from './general-masters/corporate-product/corporate-product.component';
import { CorporateViewComponent } from './general-masters/corporate-product/corporate-view/corporate-view.component';
import { CorporateGroupViewComponent } from './general-masters/corporate-product/corporate-group-view/corporate-group-view.component';
import { CorporateRoleComponent } from './security/corporate-role/corporate-role.component';
import { CorporateUserComponent } from './security/corporate-user/corporate-user.component';
import { AssignRightsCheckboxRendererComponent } from './security/corporate-role/@components/assign-rights-checkbox-renderer/assign-rights-checkbox-renderer.component';
import { UserAccessManagementComponent } from './security/user-access-management/user-access-management.component';
import { UserUploadComponent } from './security/user-upload/user-upload.component';
import { DataLayoutComponent } from './security/user-upload/@component/data-layout/data-layout.component';
import { AccountWiseAccessComponent } from './general-masters/account-wise-access/account-wise-access.component';

import { AccountTypeSelectionComponent } from './general-masters/account-wise-access/account-type-selection/account-type-selection.component';
import { AccountAccessMappingComponent } from './general-masters/account-wise-access/account-access-mapping/account-access-mapping.component';
import { ReviewDraftComponent } from './general-masters/account-wise-access/review-draft/review-draft.component';
import { AWATemplatesComponent } from './general-masters/account-wise-access/awa-templates/awa-templates.component';
import { UserAccessFieldComponent } from './security/user-access-field/user-access-field.component';
import { CheckboxRendererComponent } from './security/user-access-field/@components/checkbox-renderer/checkbox-renderer.component';
import { AuthRuleDropdownRendererComponent } from './security/user-access-field/@components/auth-rule-dropdown-renderer/auth-rule-dropdown-renderer.component';
import { CheckboxSelectRendererComponent } from './security/corporate-user/@components/checkbox-select-renderer/checkbox-select-renderer.component';
import { AuthorizationLimitRendererComponent } from './security/corporate-user/@components/authorization-limit-renderer/authorization-limit-renderer.component';
import { UnlockUserComponent } from './security/unlock-user/unlock-user.component';
import { ResetUserComponent } from './security/reset-user/reset-user.component';
import { CorporateAccountComponent } from './general-masters/corporate-account/corporate-account.component';
import { CorporateBranchComponent } from './general-masters/corporate-branch/corporate-branch.component';
import { CorporateBranchUploadComponent } from './general-masters/corporate-branch-upload/corporate-branch-upload.component';
import { CorporateClusterComponent } from './general-masters/corporate-cluster/corporate-cluster.component';
import { CorporateBranchDataLayoutComponent } from './general-masters/corporate-branch-upload/@components/bill-payment-data-layout/corporate-branch-data-layout.component';
import { DownloadSecurityFileComponent } from './security/download-security-file/download-security-file.component';
import { CorporateSecurityMappingComponent } from './security/corporate-security-mapping/corporate-security-mapping.component';
import { MobilityRegistrationComponent } from './security/mobility-registration/mobility-registration.component';

@NgModule({
  declarations: [
    AccountWiseAccessComponent,
    AccountTypeSelectionComponent,
    AccountAccessMappingComponent,
    ReviewDraftComponent,
    AWATemplatesComponent,
    CorporateProfileComponent,
    CurrencyComponent,
    CorporateAuthorizationMatrixComponent,
    AddUsersComponent,
    MatrixDetailsComponent,
    ReviewAndSubmitComponent,
    AddSlabComponent,
    RenderAvatarGroupComponent,
    ProfilePictureRendererComponent,
    ActionsRendererComponent,
    CorporateProductComponent,
    CorporateViewComponent,
    CorporateGroupViewComponent,
    CorporateRoleComponent,
    CorporateUserComponent,
    AssignRightsCheckboxRendererComponent,
    UserAccessManagementComponent,
    UserUploadComponent,
    DataLayoutComponent,

    UserAccessFieldComponent,
    CheckboxRendererComponent,
    AuthRuleDropdownRendererComponent,

    CheckboxSelectRendererComponent,
    AuthorizationLimitRendererComponent,
    UnlockUserComponent,
    ResetUserComponent,
    CorporateAccountComponent,
    CorporateBranchComponent,
    CorporateBranchUploadComponent,
    CorporateClusterComponent,
    CorporateBranchDataLayoutComponent,
    DownloadSecurityFileComponent,
    CorporateSecurityMappingComponent,
    MobilityRegistrationComponent
  ],
  imports: [CommonModule, SharedModule, SetupRoutingModule, MultiSelectModule],
})
export class SetupModule { }
