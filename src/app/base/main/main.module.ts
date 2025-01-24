import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BaseSharedModule } from '../base-shared/base-shared.module';
import { ActionComponent } from './action/action.component';
import { RelationshipManagerComponent } from './action/relationship-manager/relationship-manager.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BalanceCardComponent } from './dashboard/balance-card/balance-card.component';
import { CxoCashflowForecastComponent } from './dashboard/cxo-dashboard/@components/cxo-cashflow-forecast/cxo-cashflow-forecast.component';
import { CxoCreditLineSummeryComponent } from './dashboard/cxo-dashboard/@components/cxo-credit-line-summery/cxo-credit-line-summery.component';
import { CxoMiscellaneousComponent } from './dashboard/cxo-dashboard/@components/cxo-miscellaneous/cxo-miscellaneous.component';
import { CxoOverallSummaryComponent } from './dashboard/cxo-dashboard/@components/cxo-overall-summary/cxo-overall-summary.component';
import { NewsAndTwitterFeedsComponent } from './dashboard/cxo-dashboard/@components/news-and-twitter-feeds/news-and-twitter-feeds.component';
import { CxoDashboardComponent } from './dashboard/cxo-dashboard/cxo-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GridComponent } from './dashboard/grid/grid.component';
import { ShowWidgetComponent } from './dashboard/grid/show-widget/show-widget.component';
import { AccountStatementWidgetComponent } from './dashboard/grid/widgets/account-statement/account-statement.component';
import { AdvertisementSmeComponent } from './dashboard/grid/widgets/advertisement-sme/advertisement-sme.component';
import { AdvertisementComponent } from './dashboard/grid/widgets/advertisement/advertisement.component';
import { CalenderComponent } from './dashboard/grid/widgets/calender/calender.component';
import { CardComponent } from './dashboard/grid/widgets/card/card.component';
import { ChartComponent } from './dashboard/grid/widgets/chart/chart.component';
import { ColumnChartComponent } from './dashboard/grid/widgets/column-chart/column-chart.component';
import { CreditCardDetailWidgetComponent } from './dashboard/grid/widgets/credit-card-detail/credit-card-detail.component';
import { CurrentAccountDetailWidgetComponent } from './dashboard/grid/widgets/current-account-detail/current-account-detail.component';
import { DepositDetailWidgetComponent } from './dashboard/grid/widgets/deposit-detail/deposit-detail.component';
import { LoanDetailWidgetComponent } from './dashboard/grid/widgets/loan-detail/loan-detail.component';
import { PendingAuthorizationTableWidgetComponent } from './dashboard/grid/widgets/pending-authorization-table/pending-authorization-table.component';
import { QuickLinksWidgetComponent } from './dashboard/grid/widgets/quick-links/quick-links.component';
import { RapidPayComponent } from './dashboard/grid/widgets/rapid-pay/rapid-pay.component';
import { SelectGroupButtonComponent } from './dashboard/grid/widgets/select-group-button/select-group-button.component';
import { TableComponent } from './dashboard/grid/widgets/table/table.component';
import { VideosWidgetComponent } from './dashboard/grid/widgets/videos/videos.component';
import { ChartTypesComponent } from './dashboard/grid/widgets/widgets-header/chart-types/chart-types.component';
import { HeaderOptionsComponent } from './dashboard/grid/widgets/widgets-header/header-options/header-options.component';
import { WidgetsHeaderComponent } from './dashboard/grid/widgets/widgets-header/widgets-header.component';
import { SMEDefaultComponent } from './dashboard/sme-default/sme-default.component';
import { WidgetsComponent } from './dashboard/widgets/widgets.component';
import { SidebarChartsComponent } from './dashboard/widgets/sidebar-charts/sidebar-charts.component';
import { SidebarKpisComponent } from './dashboard/widgets/sidebar-kpis/sidebar-kpis.component';
import { ActivitiesComponent } from './last-activities/activities/activities.component';
import { LastActivitiesComponent } from './last-activities/last-activities.component';
import { MailboxModule } from './mailbox/mailbox.module';
import { BroadcastMessagesComponent } from './main-header/broadcast-messages/broadcast-messages.component';
import { HelpOptionsComponent } from './main-header/help-options/help-options.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MoreOptionsComponent } from './main-header/more-options/more-options.component';
import { QuickActionsComponent } from './main-header/quick-actions/quick-actions.component';
import { UserInfoComponent } from './main-header/user-info/user-info.component';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { FullscreenMenusComponent } from './menu/fullscreen-menus/fullscreen-menus.component';
import { MenuComponent } from './menu/menu.component';
import { MobileMenuComponent } from './menu/mobile-menu/mobile-menu.component';
import { ShortMenusComponent } from './menu/short-menus/short-menus.component';
import { TopbarMenusComponent } from './menu/topbar-menus/topbar-menus.component';
import { ConfigComponent } from './right-sidebar/config/config.component';
import { CountryComponent } from './right-sidebar/country/country.component';
import { LanguageComponent } from './right-sidebar/language/language.component';
import { MailsComponent } from './right-sidebar/mails/mails.component';
import { NotificationsComponent } from './right-sidebar/notifications/notifications.component';
import { QuickLinksComponent } from './right-sidebar/quick-links/quick-links.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { UserTasksComponent } from './right-sidebar/user-tasks/user-tasks.component';
import { AlertCheckboxRendererComponent } from './user-personalization/@components/alert-checkbox-renderer/alert-checkbox-renderer.component';
import { AlertStatusRendererComponent } from './user-personalization/@components/alert-status-renderer/alert-status-renderer.component';
import { AuthMatrixAccountsRendererComponent } from './user-personalization/@components/auth-matrix-accounts-renderer/auth-matrix-accounts-renderer.component';
import { AuthMatrixAdditionalInfoRendererComponent } from './user-personalization/@components/auth-matrix-additional-info-renderer/auth-matrix-additional-info-renderer.component';
import { UserPersonalizationComponent } from './user-personalization/user-personalization.component';
import { ExternalLinksComponent } from './right-sidebar/external-links/external-links.component';
import { FrequentlyAskQuestionsComponent } from './main-header/frequently-ask-questions/frequently-ask-questions.component';

@NgModule({
  declarations: [
    MainComponent,
    ActivitiesComponent,
    LastActivitiesComponent,

    MainHeaderComponent,
    QuickActionsComponent,
    UserInfoComponent,
    MoreOptionsComponent,
    HelpOptionsComponent,

    MenuComponent,
    FullscreenMenusComponent,
    ShortMenusComponent,
    TopbarMenusComponent,
    MobileMenuComponent,

    BreadcrumbComponent,

    ActionComponent,

    BalanceCardComponent,

    DashboardComponent,
    GridComponent,
    WidgetsHeaderComponent,
    HeaderOptionsComponent,
    ShowWidgetComponent,
    CardComponent,
    ChartComponent,

    RightSidebarComponent,
    // AddWidgetComponent,
    WidgetsComponent,
    SidebarChartsComponent,
    SidebarKpisComponent,
    QuickLinksComponent,
    MailsComponent,
    NotificationsComponent,
    CountryComponent,
    LanguageComponent,
    ConfigComponent,
    UserTasksComponent,
    BroadcastMessagesComponent,
    RelationshipManagerComponent,
    CalenderComponent,
    AdvertisementComponent,
    TableComponent,
    SelectGroupButtonComponent,
    UserPersonalizationComponent,
    AlertCheckboxRendererComponent,
    AlertStatusRendererComponent,
    AuthMatrixAdditionalInfoRendererComponent,
    AuthMatrixAccountsRendererComponent,
    ColumnChartComponent,
    RapidPayComponent,
    SMEDefaultComponent,
    AdvertisementSmeComponent,
    CurrentAccountDetailWidgetComponent,
    CreditCardDetailWidgetComponent,
    DepositDetailWidgetComponent,
    LoanDetailWidgetComponent,
    QuickLinksWidgetComponent,
    VideosWidgetComponent,
    PendingAuthorizationTableWidgetComponent,
    AccountStatementWidgetComponent,
    ChartTypesComponent,
    CxoDashboardComponent,
    CxoOverallSummaryComponent,
    CxoCashflowForecastComponent,
    CxoCreditLineSummeryComponent,
    CxoMiscellaneousComponent,
    NewsAndTwitterFeedsComponent,
    ExternalLinksComponent,
    FrequentlyAskQuestionsComponent,
  ],
  imports: [CommonModule, BaseSharedModule, SharedModule, MailboxModule, MainRoutingModule],
  entryComponents: [],
  providers: [CurrencyPipe],
  exports: [MainComponent],
})
export class MainModule {}
