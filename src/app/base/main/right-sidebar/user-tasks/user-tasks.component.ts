import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.scss'],
})
export class UserTasksComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  showReminderModal: boolean = false;
  reminder: any;
  reminders: any[] = [];
  httpService: any;

  constructor() {}

  ngOnInit(): void {}

  closeSidebar() {
    this.close.emit();
  }

  resetReminderForm() {
    this.showReminderModal = false;
    this.reminder = {
      task: '',
      date: '',
      time: '',
    };
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
}
