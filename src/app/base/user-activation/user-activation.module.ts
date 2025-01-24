import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserActivationRoutingModule } from './user-activation-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserActivationComponent } from './user-activation.component';

@NgModule({
  declarations: [UserActivationComponent],
  imports: [CommonModule, SharedModule, UserActivationRoutingModule],
})
export class UserActivationModule {}
