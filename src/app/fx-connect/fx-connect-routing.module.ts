import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { BuyFxCardComponent } from './fx-card/buy-fx-card/buy-fx-card.component';
import { ReloadFxCardComponent } from './fx-card/reload-fx-card/reload-fx-card.component';
import { BookForwardComponent } from './forward-contracts/book-forward/book-forward.component';
import { BookForwardInitiationComponent } from './forward-contracts/book-forward-initiation/book-forward-initiation.component';

const routes: Routes = [
  {
    path: 'fxCard/buy',
    component: BuyFxCardComponent,
  },
  {
    path: 'fxCard/reload',
    component: ReloadFxCardComponent,
  },
  {
    path: 'forwardContracts/bookForward',
    component: BookForwardComponent,
  },
  {
    path: ':parentMenu/:entityName/listing',
    component: GenericListingComponent,
  },
  {
    path: 'forwardContracts/bookForward/initiate',
    component: BookForwardInitiationComponent,
  },
  // fxConnect/forwardContracts/bookForward/initiate
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FxConnectRoutingModule {}
