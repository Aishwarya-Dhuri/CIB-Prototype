import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoutRoutingModule } from './logout-routing.module';
import { LogoutComponent } from './logout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BaseSharedModule } from '../base-shared/base-shared.module';

@NgModule({
  declarations: [LogoutComponent],
  imports: [CommonModule, BaseSharedModule, SharedModule, LogoutRoutingModule],
})
export class LogoutModule {}
