import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isSidebarOpen = new BehaviorSubject<boolean>(false);
  private _component = new BehaviorSubject<any>(null);

  constructor() {}

  getIsSidebarOpen(): Observable<boolean> {
    return this.isSidebarOpen;
  }

  showSidebar(component: any): void {
    this._component.next(component);
    this.isSidebarOpen.next(true);
  }

  hideSidebar(): void {
    this.isSidebarOpen.next(false);
  }

  getComponent() {
    return this._component;
  }
}
