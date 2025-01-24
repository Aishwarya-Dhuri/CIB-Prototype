import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormComponent } from 'src/app/shared/@components/dynamic-form/dynamic-form.component';
import { AuthorizationDashboardComponent } from './authorization-dashboard/authorization-dashboard.component';
import { TransactionEnquiryComponent } from './transaction-enquiry/transaction-enquiry.component';
import { CollectionSummaryComponent } from './collection-summary/collection-summary.component';
import { CollectionSummaryInitiateComponent } from './collection-summary-initiate/collection-summary-initiate.component';
import { CollectionSummaryHeadOfficeComponent } from './collection-summary-head-office/collection-summary-head-office.component';
import { CollectionSummaryHeadOfficeInitiateComponent } from './collection-summary-head-office-initiate/collection-summary-head-office-initiate.component';

const routes: Routes = [
  {
    path: 'process/transactionEnquiry',
    component: TransactionEnquiryComponent,
  },
  {
    path: 'process/collectionSummary',
    component: CollectionSummaryComponent,
  },
  {
    path: 'process/collectionSummary/initiate',
    component: CollectionSummaryInitiateComponent,
  },
  {
    path: 'process/collectionSummaryHeadOffice',
    component: CollectionSummaryHeadOfficeComponent,
  },
  {
    path: 'process/collectionSummaryHeadOffice/initiate',
    component: CollectionSummaryComponent,
    // component: CollectionSummaryHeadOfficeInitiateComponent,
  },
  {
    path: 'process/authorizationDashboard',
    component: AuthorizationDashboardComponent,
  },
  {
    path: ':parentMenu/:entityName/dynamic',
    component: DynamicFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductCommonRoutingModule { }
