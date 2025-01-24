import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LmsRoutingModule } from './lms-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AccountStructureComponent } from './corporate/account-structure/account-structure.component';
import { InitiateAccountStructureComponent } from './corporate/account-structure/initiate-account-structure/initiate-account-structure.component';
import { CopyAccountStructureComponent } from './corporate/account-structure/initiate-account-structure/copy-account-structure/copy-account-structure.component';
import { MainAccountComponent } from './corporate/account-structure/initiate-account-structure/main-account/main-account.component';
import { AccountStructureHierarchyComponent } from './corporate/account-structure/initiate-account-structure/account-structure-hierarchy/account-structure-hierarchy.component';
import { SuspendAccountComponent } from './corporate/account-structure/initiate-account-structure/account-structure-hierarchy/suspend-account/suspend-account.component';
import { AddChildAccountComponent } from './corporate/account-structure/initiate-account-structure/account-structure-hierarchy/add-child-account/add-child-account.component';
import { ReviewAccountStructureComponent } from './corporate/account-structure/initiate-account-structure/review-account-structure/review-account-structure.component';
import { InterestReallocationComponent } from './transactions/interest-reallocation/interest-reallocation.component';
import { ReallocationPercentageInputRendererComponent } from './transactions/interest-reallocation/@components/reallocation-percentage-input-renderer/reallocation-percentage-input-renderer.component';
import { AccountStructureSimulateComponent } from './transactions/account-structure-simulate/account-structure-simulate.component';
import { IntradayExecutionComponent } from './transactions/intraday-execution/intraday-execution.component';
import { BalanceInputRendererComponent } from './transactions/account-structure-simulate/@components/balance-input-renderer/balance-input-renderer.component';
import { NewAccountStructureComponent } from './corporate/new-account-structure/new-account-structure.component';
import { NewInitiateAccountStructureComponent } from './corporate/new-account-structure/new-initiate-account-structure/new-initiate-account-structure.component';
import { NewMainAccountComponent } from './corporate/new-account-structure/new-initiate-account-structure/new-main-account/new-main-account.component';
import { NewCopyAccountStructureComponent } from './corporate/new-account-structure/new-initiate-account-structure/new-copy-account-structure/new-copy-account-structure.component';
import { NewAccountStructureHierarchyComponent } from './corporate/new-account-structure/new-initiate-account-structure/new-account-structure-hierarchy/new-account-structure-hierarchy.component';
import { NewReviewAccountStructureComponent } from './corporate/new-account-structure/new-initiate-account-structure/new-review-account-structure/new-review-account-structure.component';
import { NewAddChildAccountComponent } from './corporate/new-account-structure/new-initiate-account-structure/new-account-structure-hierarchy/new-add-child-account/new-add-child-account.component';
import { NewSuspendAccountComponent } from './corporate/new-account-structure/new-initiate-account-structure/new-account-structure-hierarchy/new-suspend-account/new-suspend-account.component';
import { ActionCellRendererComponent } from './corporate/new-account-structure/@components/action-cell-renderer/action-cell-renderer.component';

@NgModule({
  declarations: [
    AccountStructureComponent,
    InitiateAccountStructureComponent,
    CopyAccountStructureComponent,
    MainAccountComponent,
    AccountStructureHierarchyComponent,
    SuspendAccountComponent,
    AddChildAccountComponent,
    ReviewAccountStructureComponent,
    InterestReallocationComponent,
    ReallocationPercentageInputRendererComponent,
    AccountStructureSimulateComponent,
    BalanceInputRendererComponent,
    NewAccountStructureComponent,
    NewInitiateAccountStructureComponent,
    NewMainAccountComponent,
    NewCopyAccountStructureComponent,
    NewAccountStructureHierarchyComponent,
    NewReviewAccountStructureComponent,
    NewAddChildAccountComponent,
    NewSuspendAccountComponent,
    ActionCellRendererComponent,
    IntradayExecutionComponent
  ],
  imports: [CommonModule, SharedModule, LmsRoutingModule],
})
export class LmsModule { }
