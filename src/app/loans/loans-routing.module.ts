import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestForLoansComponent } from './request-for-loans/request-for-loans.component';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';


const routes: Routes = [
  {
    path: 'loan/requestForLoans',
    component: RequestForLoansComponent,
  },
  {
    path: ':parentMenu/:entityName/listing',
    component: GenericListingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoansRoutingModule { }
