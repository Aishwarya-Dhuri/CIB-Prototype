import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FxConnectRoutingModule } from './fx-connect-routing.module';
import { BuyFxCardComponent } from './fx-card/buy-fx-card/buy-fx-card.component';
import { ReloadFxCardComponent } from './fx-card/reload-fx-card/reload-fx-card.component';
import { SharedModule } from '../shared/shared.module';
import { BookForwardComponent } from './forward-contracts/book-forward/book-forward.component';
import { BookForwardInitiationComponent } from './forward-contracts/book-forward-initiation/book-forward-initiation.component';

@NgModule({
  declarations: [BuyFxCardComponent, ReloadFxCardComponent, BookForwardComponent, BookForwardInitiationComponent],
  imports: [CommonModule, SharedModule, FxConnectRoutingModule],
})
export class FxConnectModule {}
