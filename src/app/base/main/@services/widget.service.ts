import { Injectable } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from 'src/app/shared/@services/http.service';
import { WidgetDetails_Response } from '../@models/widget-details';
import { WIDGETS } from '../dashboard/grid/@enums/widget.enum';
import {
  InvoiceOverdueTracker_Request,
  InvoiceOverdueTracker_Response,
} from '../dashboard/grid/@models/invoiceOverdueTracker';
import { Programs_Request, Programs_Response } from '../dashboard/grid/@models/programs';
import { Summary_Request, Summary_Response } from '../dashboard/grid/@models/summary';
import { AccountStatementWidgetComponent } from '../dashboard/grid/widgets/account-statement/account-statement.component';
import { AdvertisementSmeComponent } from '../dashboard/grid/widgets/advertisement-sme/advertisement-sme.component';
import { AdvertisementComponent } from '../dashboard/grid/widgets/advertisement/advertisement.component';
import { CalenderComponent } from '../dashboard/grid/widgets/calender/calender.component';
import { CardComponent } from '../dashboard/grid/widgets/card/card.component';
import { ChartComponent } from '../dashboard/grid/widgets/chart/chart.component';
import { ColumnChartComponent } from '../dashboard/grid/widgets/column-chart/column-chart.component';
import { CreditCardDetailWidgetComponent } from '../dashboard/grid/widgets/credit-card-detail/credit-card-detail.component';
import { CurrentAccountDetailWidgetComponent } from '../dashboard/grid/widgets/current-account-detail/current-account-detail.component';
import { DepositDetailWidgetComponent } from '../dashboard/grid/widgets/deposit-detail/deposit-detail.component';
import { LoanDetailWidgetComponent } from '../dashboard/grid/widgets/loan-detail/loan-detail.component';
import { PendingAuthorizationTableWidgetComponent } from '../dashboard/grid/widgets/pending-authorization-table/pending-authorization-table.component';
import { QuickLinksWidgetComponent } from '../dashboard/grid/widgets/quick-links/quick-links.component';
import { RapidPayComponent } from '../dashboard/grid/widgets/rapid-pay/rapid-pay.component';
import { TableComponent } from '../dashboard/grid/widgets/table/table.component';
import { VideosWidgetComponent } from '../dashboard/grid/widgets/videos/videos.component';

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  private _isFullScreen = new BehaviorSubject<boolean>(false);
  private _isModal = new BehaviorSubject<boolean>(false);
  private _gridType = new BehaviorSubject<number>(2);

  private _selectModalData = new BehaviorSubject<{ colDefUrl: string; rowDefUrl: string } | null>(
    null,
  );
  private _selectModalResponse = new BehaviorSubject<any>(null);
  private dashboard = new BehaviorSubject<any[]>([]);

  private dashboardWidgets: Array<GridsterItem> = [];

  dashboardType: string = '';

  constructor(private httpService: HttpService) {}

  getDashboard() {
    return this.dashboard;
  }

  setDashboard(dashboard: any[]) {
    this.dashboard.next(dashboard);
  }

  getSelectModalData() {
    return this._selectModalData;
  }

  setSelectModalData(selectModalData: { colDefUrl: string; rowDefUrl: string } | null) {
    this._selectModalData.next(selectModalData);
  }

  getSelectModalResponse() {
    return this._selectModalResponse;
  }

  setSelectModalResponse(selectModalResponse: any) {
    this._selectModalResponse.next(selectModalResponse);
  }

  getIsFullScreen() {
    return this._isFullScreen;
  }

  setIsFullScreen(fullScreen: boolean) {
    this._isFullScreen.next(fullScreen);
  }

  getGridType() {
    return this._gridType;
  }

  setGridType(gridType: number) {
    this._gridType.next(gridType);
  }

  getIsModal() {
    return this._isModal;
  }

  setIsModal(modal: boolean) {
    this._isModal.next(modal);
  }

  getDashboardWidgets() {
    return this.dashboardWidgets;
  }

  setDashboardWidgets(dashboardWidgets: any[]) {
    this.dashboardWidgets = dashboardWidgets;
  }

  getWidgetComponent(widgetType: string) {
    let component: any;
    switch (widgetType) {
      case WIDGETS.chart:
        component = ChartComponent;
        break;
      case WIDGETS.columnChart:
        component = ColumnChartComponent;
        break;
      case WIDGETS.cards:
        component = CardComponent;
        break;
      case WIDGETS.table:
        component = TableComponent;
        break;
      case WIDGETS.calender:
        component = CalenderComponent;
        break;
      case WIDGETS.rapidPay:
        component = RapidPayComponent;
        break;
      case WIDGETS.advertisement:
        component = AdvertisementComponent;
        break;
      case WIDGETS.advertisement1:
        component = AdvertisementSmeComponent;
        break;
      case WIDGETS.currentAccountDetails:
        component = CurrentAccountDetailWidgetComponent;
        break;
      case WIDGETS.creditCardDetails:
        component = CreditCardDetailWidgetComponent;
        break;
      case WIDGETS.depositDetails:
        component = DepositDetailWidgetComponent;
        break;
      case WIDGETS.loanDetails:
        component = LoanDetailWidgetComponent;
        break;
      case WIDGETS.quickLinks:
        component = QuickLinksWidgetComponent;
        break;
      case WIDGETS.videos:
        component = VideosWidgetComponent;
        break;
      case WIDGETS.accountStatement:
        component = AccountStatementWidgetComponent;
        break;
      case WIDGETS.pendingAuthorizationTable:
        component = PendingAuthorizationTableWidgetComponent;
        break;
    }

    return component;
  }

  viewWidgetDetails() {
    // this.httpService.httpPost('viewWidgetDetails').pipe(
    this.httpService.httpPost('/viewWidgetDetails').pipe(
      map((widgetDetails: WidgetDetails_Response) => {
        return widgetDetails;
      }),
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }

  getWidgetDetails() {
    // this.httpService.httpPost('getWidgetDetails').pipe(
    this.httpService.httpPost('/getWidgetDetails').pipe(
      map((widgetDetails: WidgetDetails_Response) => {
        return widgetDetails;
      }),
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }

  getPrograms(requestData: Programs_Request) {
    // this.httpService.httpPost('getPrograms', requestData).pipe(
    this.httpService.httpPost('/getPrograms', requestData).pipe(
      map((prograns: Programs_Response) => {
        return prograns;
      }),
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }

  getSummary(api: string, requestData?: Summary_Request) {
    return this.httpService.httpPost(api, requestData).pipe(
      map((summary: Summary_Response) => {
        return summary;
      }),
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }

  getInvoiceOverdueTracker(requestData: InvoiceOverdueTracker_Request) {
    // this.httpService.httpPost('getInvoiceOverdueTracker', requestData).pipe(
    this.httpService.httpPost('/getInvoiceOverdueTracker', requestData).pipe(
      map((invoiceOverdueTracker: InvoiceOverdueTracker_Response) => {
        return invoiceOverdueTracker;
      }),
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }
}
