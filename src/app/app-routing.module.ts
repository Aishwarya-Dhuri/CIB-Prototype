import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServerErrorComponent } from './server-error/server-error.component';

import { ConnectivityGuard } from './shared/@guard/connectivity.guard';

const routes: Routes = [
  /* {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  }, */
  {
    path: 'login',
    loadChildren: () => import('./base/login/login.module').then((m) => m.LoginModule),
    // component: LoginComponent,
    canActivate: [ConnectivityGuard],
  },
  {
    path: 'logout',
    loadChildren: () => import('./base/logout/logout.module').then((m) => m.LogoutModule),
    // component: LoginComponent,
    canActivate: [ConnectivityGuard],
  },
  {
    path: 'userActivation',
    loadChildren: () =>
      import('./base/user-activation/user-activation.module').then((m) => m.UserActivationModule),
    // component: LoginComponent,
    canActivate: [ConnectivityGuard],
  },
  {
    path: 'landingPage',
    loadChildren: () =>
      import('./base/landing-page/landing-page.module').then((m) => m.LandingPageModule),
    // component: LandingPageComponent,
    canActivate: [ConnectivityGuard],
  },
  {
    path: 'self-onboarding',
    loadChildren: () =>
      import('./self-onboarding/self-onboarding.module').then((m) => m.SelfOnboardingModule),
    canActivate: [ConnectivityGuard],
  },
  {
    path: 'serverError',
    component: ServerErrorComponent,
  },
  {
    path: '',
    loadChildren: () => import('./base/main/main.module').then((m) => m.MainModule),
    // component: MainComponent,
    canActivate: [ConnectivityGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
