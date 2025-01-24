import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { HttpService } from 'src/app/shared/@services/http.service';
import { SidebarService } from 'src/app/shared/@services/sidebar.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ActionService } from '../../@services/action.service';
import { NewsAndTwitterFeedsComponent } from './@components/news-and-twitter-feeds/news-and-twitter-feeds.component';
import { CxoDashboardService } from './@services/cxo-dashboard.service';

@Component({
  selector: 'app-cxo-dashboard',
  templateUrl: './cxo-dashboard.component.html',
  styleUrls: ['./cxo-dashboard.component.scss'],
})
export class CxoDashboardComponent implements OnInit {
  showReminderModal: boolean = false;
  tasks: any[] = [];
  reminders: any[] = [];
  newsFeed: any[] = [];

  reminder: any;

  isGroupUser: boolean = false;

  cxoDashboardData: any;

  notifications: any;

  tabs: string[] = ['Overall Summary', 'Cashflow Forecast', 'Credit Line Summary', 'Miscellaneous'];
  currentTab: string = this.tabs[0];

  constructor(
    private actionsService: ActionService,
    private sidebarService: SidebarService,
    private httpService: HttpService,
    private cxoDashboardService: CxoDashboardService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'CXO',
      subHeading: null,
      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.actionsService.setActions(actions);

    this.cxoDashboardService.getCxoDashboardData().subscribe((cxoDashboardData: any) => {
      this.cxoDashboardData = cxoDashboardData;
    });

    this.getNotifications();
    this.resetReminderForm();
    this.getTasks();
    this.getReminders();
  }

  openSidebar() {
    this.sidebarService.showSidebar(NewsAndTwitterFeedsComponent);
  }

  addNewReminder() {
    this.httpService
      .httpPost('dashboard/cxo/private/addReminder', {
        dataMap: this.reminder,
      })
      .subscribe((response: any) => {
        this.resetReminderForm();
        this.getReminders();
      });
  }

  resetReminderForm() {
    this.showReminderModal = false;
    this.reminder = {
      task: '',
      date: '',
      time: '',
    };
  }

  getNotifications() {
    this.httpService
      .httpPost('commons/commonService/private/getUserNotifications', {
        dataMap: {},
      })
      .subscribe((response: any) => {
        this.notifications = response.data;
      });
  }

  getReminders() {
    this.httpService
      .httpPost('dashboard/cxo/private/getReminders', {
        dataMap: {},
      })
      .subscribe((response: any) => {
        console.log(response);
        this.reminders = response.data;
      });
  }

  getTasks() {
    this.httpService
      .httpPost('dashboard/cxo/private/getTasks', {
        dataMap: {},
      })
      .subscribe((response: any) => {
        console.log(response);
        this.tasks = response.data;
      });
  }
}
