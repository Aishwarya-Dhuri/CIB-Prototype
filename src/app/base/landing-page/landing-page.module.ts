import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { DetailsPanelComponent } from './details-panel/details-panel.component';
import { ActionPanelComponent } from './action-panel/action-panel.component';
import { SharedModule } from '../../shared/shared.module';
import { BaseSharedModule } from '../base-shared/base-shared.module';
import { LandingPageRoutingModule } from './landing-page-routing.module';

@NgModule({
  declarations: [LandingPageComponent, DetailsPanelComponent, ActionPanelComponent],
  imports: [CommonModule, SharedModule, BaseSharedModule, LandingPageRoutingModule],
})
export class LandingPageModule {}
