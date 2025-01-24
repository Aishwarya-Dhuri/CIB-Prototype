import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserActivationComponent } from './user-activation.component';

const routes: Routes = [{ path: '', component: UserActivationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserActivationRoutingModule {}
