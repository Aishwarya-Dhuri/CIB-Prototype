import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { PositivePayComponent } from './transactions/positive-pay/positive-pay.component';
import { ChequeEntryComponent } from './transactions/cheque-entry/cheque-entry.component';
import { ChequeUploadComponent } from './transactions/cheque-upload/cheque-upload.component';

const routes: Routes = [
  { path: 'transactions/positivePay', component: PositivePayComponent },
  { path: 'transactions/chequeEntry', component: ChequeEntryComponent },
  { path: 'transactions/chequeUpload', component: ChequeUploadComponent },
  {
    path: ':parentMenu/:entityName/listing',
    component: GenericListingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositivePayRoutingModule {}
