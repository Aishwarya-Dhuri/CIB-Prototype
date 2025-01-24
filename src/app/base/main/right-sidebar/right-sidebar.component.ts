import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../../shared/@services/sidebar.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent implements OnInit {
  isSidebarOpen: boolean = false;
  component: any;
  outputs: any;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.getIsSidebarOpen().subscribe((isSidebarOpen: boolean) => {
      this.isSidebarOpen = isSidebarOpen;
    });

    this.sidebarService.getComponent().subscribe((component: any) => {
      if (component) {
        this.component = component;
      }
    });

    this.outputs = {
      close: (event?: any) => {
        this.closeSidebar();
      },
    };
  }

  closeSidebar() {
    this.sidebarService.hideSidebar();
  }
}
