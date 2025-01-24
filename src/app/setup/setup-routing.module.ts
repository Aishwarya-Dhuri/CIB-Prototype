import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { AccountWiseAccessComponent } from './general-masters/account-wise-access/account-wise-access.component';



import { CorporateAccountComponent } from './general-masters/corporate-account/corporate-account.component';
import { CorporateBranchUploadComponent } from './general-masters/corporate-branch-upload/corporate-branch-upload.component';
import { CorporateBranchComponent } from './general-masters/corporate-branch/corporate-branch.component';
import { CorporateClusterComponent } from './general-masters/corporate-cluster/corporate-cluster.component';
import { CorporateGroupViewComponent } from './general-masters/corporate-product/corporate-group-view/corporate-group-view.component';
import { CorporateProductComponent } from './general-masters/corporate-product/corporate-product.component';
import { CorporateViewComponent } from './general-masters/corporate-product/corporate-view/corporate-view.component';
import { CurrencyComponent } from './general-masters/currency/currency.component';
import { CorporateAuthorizationMatrixComponent } from './security/corporate-authorization-matrix/corporate-authorization-matrix.component';
import { CorporateProfileComponent } from './security/corporate-profile/corporate-profile.component';
import { CorporateRoleComponent } from './security/corporate-role/corporate-role.component';
import { CorporateSecurityMappingComponent } from './security/corporate-security-mapping/corporate-security-mapping.component';
import { CorporateUserComponent } from './security/corporate-user/corporate-user.component';
import { DownloadSecurityFileComponent } from './security/download-security-file/download-security-file.component';
import { MobilityRegistrationComponent } from './security/mobility-registration/mobility-registration.component';
import { ResetUserComponent } from './security/reset-user/reset-user.component';
import { UnlockUserComponent } from './security/unlock-user/unlock-user.component';
import { UserAccessFieldComponent } from './security/user-access-field/user-access-field.component';
import { UserAccessManagementComponent } from './security/user-access-management/user-access-management.component';
import { UserUploadComponent } from './security/user-upload/user-upload.component';


const routes: Routes = [
  {
    path: 'generalMasters/accountWiseAccess',
    component: AccountWiseAccessComponent,
  },
  {
    path: 'security/corporateAuthorizationMatrix',
    component: CorporateAuthorizationMatrixComponent,
  },
  {
    path: 'generalMasters/industry/initiate',
    component: CurrencyComponent,
  },
  {
    path: 'generalMasters/corporateProduct/portfolio',
    component: CorporateProductComponent,
  },
  {
    path: 'generalMasters/corporateBranch',
    component: CorporateBranchComponent,
  },
  {
    path: 'generalMasters/corporateBranchUpload',
    component: CorporateBranchUploadComponent,
  },
  {
    path: 'generalMasters/corporateCluster',
    component: CorporateClusterComponent,
  },
  {
    path: 'generalMasters/corporateProduct/portfolio/group',
    component: CorporateGroupViewComponent,
  },
  {
    path: 'generalMasters/corporateProduct/portfolio/group/corporateView',
    component: CorporateViewComponent,
  },
  {
    path: 'generalMasters/corporateProduct/portfolio/corporateView',
    component: CorporateViewComponent,
  },
  {
    path: 'generalMasters/corporateAccount',
    component: CorporateAccountComponent,
  },
  {
    path: 'security/corporateProfile',
    component: CorporateProfileComponent,
  },
  {
    path: 'security/userAccessManagement',
    component: UserAccessManagementComponent,
  },
  {
    path: 'security/downloadSecurityFile',
    component: DownloadSecurityFileComponent,
  },
  {
    path: 'security/corporateUser',
    component: CorporateUserComponent,
  },

  { path: 'security/userFieldAccess', component: UserAccessFieldComponent },

  {
    path: 'security/corporateRole',
    component: CorporateRoleComponent,
  },
  {
    path: 'security/corporateSecurityMapping',
    component: CorporateSecurityMappingComponent,
  },
  {
    path: 'security/userUpload',
    component: UserUploadComponent,
  },
  {
    path: 'security/unlockUser',
    component: UnlockUserComponent,
  },
  {
    path: 'security/resetUser',
    component: ResetUserComponent,
  },
  {
    path: 'security/mobilityRegistration',
    component: MobilityRegistrationComponent,
  },
  {
    path: ':parentMenu/:entityName/listing',
    component: GenericListingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule { }
