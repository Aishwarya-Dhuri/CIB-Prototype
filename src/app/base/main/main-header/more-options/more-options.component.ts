import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/shared/@services/sidebar.service';
import { UserTasksComponent } from '../../right-sidebar/user-tasks/user-tasks.component';
import { MainHeaderComponent } from '../main-header.component';

@Component({
  selector: 'app-more-options',
  templateUrl: './more-options.component.html',
  styleUrls: ['./more-options.component.scss'],
})
export class MoreOptionsComponent implements OnInit {
  isFxRate: boolean = false;
  isInterestRate: boolean = false;
  fxRateColDefUrl: string = 'main/main-header/fxRate/private/fxRateColDef';
  fxRateRowDataUrl: string = 'main/main-header/fxRate/private/getAllList';
  interestRateColDefUrl: string = 'main/main-header/interestRate/private/interestRateColDef';
  interestRateRowDataUrl: string = 'main/main-header/interestRate/private/getAllList';
  gridOptions = {
    supressAutoFit: true,
    context: {
      componentParent: this,
    },
  };
  constructor(
    private sidebarService: SidebarService,
    private mainHeaderComponent: MainHeaderComponent,
  ) {}

  ngOnInit(): void {}

  openMyTasks() {
    this.mainHeaderComponent.moreOptions = false;
    this.sidebarService.showSidebar(UserTasksComponent);
  }

  onLoanCalculatorClick() {
    window.open('https://emicalculator.net/', '_blank');
  }

  onFdInterestRateClick() {
    window.open('https://fd-calculator.in/', '_blank');
  }
}
