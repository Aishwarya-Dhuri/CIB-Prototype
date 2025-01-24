import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthorizationDashboardComponent } from './authorization-dashboard/authorization-dashboard.component';
import { ProductCommonRoutingModule } from './product-common-routing.module';
import { TransactionEnquiryComponent } from './transaction-enquiry/transaction-enquiry.component';
import { CollectionSummaryComponent } from './collection-summary/collection-summary.component';
import { CollectionSummaryInitiateComponent } from './collection-summary-initiate/collection-summary-initiate.component';
import { CollectionSummaryHeadOfficeComponent } from './collection-summary-head-office/collection-summary-head-office.component';
import { CollectionSummaryHeadOfficeInitiateComponent } from './collection-summary-head-office-initiate/collection-summary-head-office-initiate.component';

@NgModule({
  declarations: [TransactionEnquiryComponent, AuthorizationDashboardComponent, CollectionSummaryComponent, CollectionSummaryInitiateComponent, CollectionSummaryHeadOfficeComponent, CollectionSummaryHeadOfficeInitiateComponent],
  imports: [CommonModule, SharedModule, ProductCommonRoutingModule],
})
export class ProductCommonModule {}
