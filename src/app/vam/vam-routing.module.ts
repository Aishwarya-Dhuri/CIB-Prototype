import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { SubEntityDetailsComponent } from './vam-setup/va-issuance/sub-entity-details/sub-entity-details.component';
import { VaIssuanceInitiateComponent } from './vam-setup/va-issuance/va-issuance-initiate/va-issuance-initiate.component';
import { VirtualAccountDetailsComponent } from './vam-setup/va-issuance/virtual-account-details/virtual-account-details.component';
import { VaIssuanceSummaryComponent } from './vam-setup/va-issuance/va-issuance-summary.component';
import { CorporateVaStructureComponent } from './vam-setup/corporate-va-structure/corporate-va-structure.component';
import { VaLimitEnhancementComponent } from './vam-setup/va-limit-enhancement/va-limit-enhancement.component';
import { VirtualAccountStatusManagementComponent } from './process/virtual-account-status-management/virtual-account-status-management.component';

const routes: Routes = [
  {
    path: 'vamSetup/corporateVAStructure',
    component: CorporateVaStructureComponent,
  },
  {
    path: 'vamSetup/virtualAccountIssuanceSummary',
    component: VaIssuanceSummaryComponent,
  },
  {
    path: 'vamSetup/virtualAccountIssuanceSummary/subEntityDetails',
    component: SubEntityDetailsComponent,
  },
  {
    path: 'vamSetup/virtualAccountIssuanceSummary/subEntityDetails/virtualAccountDetails',
    component: VirtualAccountDetailsComponent,
  },
  { path: 'vamSetup/virtualAccountIssuance', component: VaIssuanceInitiateComponent },
  { path: 'vamSetup/vaLimitEnhancement', component: VaLimitEnhancementComponent },
  {
    path: 'process/virtualAccountStatusManagement',
    component: VirtualAccountStatusManagementComponent,
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
export class VamRoutingModule {}
