import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaveSelfOnboardingComponent } from './save-self-onboarding/save-self-onboarding.component';
import { SelfOnboardingHomeComponent } from './self-onboarding-home/self-onboarding-home.component';
import { SelfOnboardingComponent } from './self-onboarding.component';

const routes: Routes = [
  {
    path: '',
    component: SelfOnboardingComponent,
    children: [
      { path: '', component: SelfOnboardingHomeComponent },
      { path: 'new', component: SaveSelfOnboardingComponent, data: { type: 'new' } },
      { path: 'existing', component: SaveSelfOnboardingComponent, data: { type: 'existing' } },
      { path: 'draft', component: SaveSelfOnboardingComponent, data: { type: 'draft' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelfOnboardingRoutingModule {}
