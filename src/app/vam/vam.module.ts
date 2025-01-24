import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { VamRoutingModule } from './vam-routing.module';
import { CorporateVaStructureComponent } from './vam-setup/corporate-va-structure/corporate-va-structure.component';
import { VaIssuanceSummaryComponent } from './vam-setup/va-issuance/va-issuance-summary.component';
import { VaIssuanceGroupSummaryComponent } from './vam-setup/va-issuance/va-issuance-group-summary/va-issuance-group-summary.component';
import { VaIssuanceCorporateSummaryComponent } from './vam-setup/va-issuance/va-issuance-corporate-summary/va-issuance-corporate-summary.component';
import { SubEntityDetailsComponent } from './vam-setup/va-issuance/sub-entity-details/sub-entity-details.component';
import { VirtualAccountDetailsComponent } from './vam-setup/va-issuance/virtual-account-details/virtual-account-details.component';
import { VaIssuanceInitiateComponent } from './vam-setup/va-issuance/va-issuance-initiate/va-issuance-initiate.component';
import { SubEntityInitiateComponent } from './vam-setup/va-issuance/sub-entity-initiate/sub-entity-initiate.component';
import { SubEntityViewComponent } from './vam-setup/va-issuance/sub-entity-initiate/sub-entity-view/sub-entity-view.component';
import { VaIssuanceViewComponent } from './vam-setup/va-issuance/va-issuance-initiate/va-issuance-view/va-issuance-view.component';
import { VaLimitEnhancementSearchComponent } from './vam-setup/va-limit-enhancement/search-component/va-limit-enhancement-search.component';
import { VaLimitEnhancementComponent } from './vam-setup/va-limit-enhancement/va-limit-enhancement.component';
import { VirtualAccountStatusManagementComponent } from './process/virtual-account-status-management/virtual-account-status-management.component';

@NgModule({
  declarations: [
    CorporateVaStructureComponent,
    VaIssuanceSummaryComponent,
    VaIssuanceGroupSummaryComponent,
    VaIssuanceCorporateSummaryComponent,
    SubEntityDetailsComponent,
    VirtualAccountDetailsComponent,
    VaIssuanceInitiateComponent,
    SubEntityInitiateComponent,
    SubEntityViewComponent,
    VaIssuanceViewComponent,
    VaLimitEnhancementSearchComponent,
    VaLimitEnhancementComponent,
    VirtualAccountStatusManagementComponent,
  ],
  imports: [CommonModule, SharedModule, VamRoutingModule],
})
export class VamModule {}
