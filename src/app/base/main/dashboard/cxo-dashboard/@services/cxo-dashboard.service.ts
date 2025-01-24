import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CxoDashboardService {
  private dashboardData: BehaviorSubject<any> = new BehaviorSubject<any>({
    netBalance: 0,
    accountBalance: 0,
    investments: 0,
    assets: 0,
    liabilities: 0,
    sanctioned: 0,
    outstanding: 0,
  });

  setCxoDashboardData(dashboardData: any) {
    this.dashboardData.next(dashboardData);
  }

  getCxoDashboardData() {
    return this.dashboardData;
  }
}
