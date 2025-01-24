import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { AccountStructureComponent } from './corporate/account-structure/account-structure.component';
import { InitiateAccountStructureComponent } from './corporate/account-structure/initiate-account-structure/initiate-account-structure.component';
import { AccountStructureSimulateComponent } from './transactions/account-structure-simulate/account-structure-simulate.component';
import { InterestReallocationComponent } from './transactions/interest-reallocation/interest-reallocation.component';
import { NewAccountStructureComponent } from './corporate/new-account-structure/new-account-structure.component';
import { NewInitiateAccountStructureComponent } from './corporate/new-account-structure/new-initiate-account-structure/new-initiate-account-structure.component';
import { IntradayExecutionComponent } from './transactions/intraday-execution/intraday-execution.component';

const routes: Routes = [
  { path: 'corporate/accountStructure', component: AccountStructureComponent },
  { path: 'lms/corporate/accountStructure/listing', redirectTo: '/lms/corporate/accountStructure' },
  { path: 'corporate/accountStructure/initiate', component: InitiateAccountStructureComponent },
  { path: 'generalMaster/interestReallocation', component: InterestReallocationComponent },
  { path: 'transactions/accountStructureSimulate', component: AccountStructureSimulateComponent },
  { path: 'transactions/intradayExecution', component: IntradayExecutionComponent },
  // New Account Structure
  { path: 'corporate/newAccountStructure', component: NewAccountStructureComponent },
  { path: 'lms/corporate/newAccountStructure/listing', redirectTo: '/lms/corporate/newAccountStructure' },
  { path: 'corporate/newAccountStructure/newInitiate', component: NewInitiateAccountStructureComponent },

  {
    path: ':parentMenu/:entityName/listing',
    component: GenericListingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LmsRoutingModule { }
