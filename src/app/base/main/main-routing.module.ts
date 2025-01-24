import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CxoDashboardComponent } from './dashboard/cxo-dashboard/cxo-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { UserPersonalizationComponent } from './user-personalization/user-personalization.component';
import { FrequentlyAskQuestionsComponent } from './main-header/frequently-ask-questions/frequently-ask-questions.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard/cxo',
        children: [
          { path: '', component: CxoDashboardComponent, data: { showDashboardActions: true } },
        ],
      },
      {
        path: 'dashboard/:dashboardType',
        children: [
          { path: '', component: DashboardComponent, data: { showDashboardActions: true } },
        ],
      },
      // {
      //   path: 'dashboard',
      //   children: [
      //     {
      //       redirectTo: '/dashboard/consolidated',
      //       pathMatch: 'full',
      //       data: { showDashboardActions: true },
      //     },
      //   ],
      // },
      {
        path: 'setup',
        loadChildren: () => import('../../setup/setup.module').then((m) => m.SetupModule),
      },
      {
        path: 'payments',
        loadChildren: () => import('../../payments/payments.module').then((m) => m.PaymentsModule),
      },
      {
        path: 'account-services',
        loadChildren: () =>
          import('../../account-services/account-services.module').then(
            (m) => m.AccountServicesModule,
          ),
      },
      {
        path: 'accountServices',
        loadChildren: () =>
          import('../../account-services/account-services.module').then(
            (m) => m.AccountServicesModule,
          ),
      },
      {
        path: 'fscm',
        loadChildren: () => import('../../fscm/fscm.module').then((m) => m.FscmModule),
      },
      {
        path: 'cashflow',
        loadChildren: () => import('../../cashflow/cashflow.module').then((m) => m.CashflowModule),
      },
      {
        path: 'lms',
        loadChildren: () => import('../../lms/lms.module').then((m) => m.LmsModule),
      },
      {
        path: 'vam',
        loadChildren: () => import('../../vam/vam.module').then((m) => m.VamModule),
      },
      {
        path: 'trade',
        loadChildren: () => import('../../trade/trade.module').then((m) => m.TradeModule),
      },
      {
        path: 'rms',
        loadChildren: () => import('../../rms/rms.module').then((m) => m.RmsModule),
      },
      {
        path: 'directDebit',
        loadChildren: () =>
          import('../../direct-debit/direct-debit.module').then((m) => m.DirectDebitModule),
      },
      {
        path: 'positivePay',
        loadChildren: () =>
          import('../../positive-pay/positive-pay.module').then((m) => m.PositivePayModule),
      },
      {
        path: 'fxConnect',
        loadChildren: () =>
          import('../../fx-connect/fx-connect.module').then((m) => m.FxConnectModule),
      },
      {
        path: 'loans',
        loadChildren: () =>
          import('../../loans/loans.module').then((m) => m.LoansModule),
      },
      {
        path: 'collections',
        loadChildren: () =>
          import('../../collections/collections.module').then((m) => m.CollectionsModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('../../reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'setting',
        children: [{ path: 'userPersonalization', component: UserPersonalizationComponent }],
      },
      {
        path: 'frequentlyAskQuestions',
        component: FrequentlyAskQuestionsComponent,
      },
      {
        path: ':product',
        loadChildren: () =>
          import('../../base/product-common/product-common.module').then(
            (m) => m.ProductCommonModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
