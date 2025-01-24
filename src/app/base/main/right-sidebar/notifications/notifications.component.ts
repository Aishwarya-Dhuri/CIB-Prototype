import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  notifications: any;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost('commons/commonService/private/getUserNotifications', {
        dataMap: {},
      })
      .subscribe((response: any) => {
        this.notifications = response.data;
      });
  }

  closeSidebar() {
    this.close.emit();
  }
}
