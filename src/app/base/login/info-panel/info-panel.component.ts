import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  BroadcastMessage,
  OfflineBroadcastMessage_Request,
  OfflineBroadcastMessage_Response,
} from 'src/app/base/@models/offline-broadcast-message';

import { HttpService } from 'src/app/shared/@services/http.service';
import { LoginComponent } from '../login.component';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss'],
})
export class InfoPanelComponent implements OnInit {
  @Input() isMobileScreenLogin: boolean = false;
  @Output() isMobileScreenLoginChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  broadcastMessage: BroadcastMessage;
  broadcastMessageIndex: number;
  broadcastMessages: BroadcastMessage[];
  @Input('screenDetails') screenDetails: any;
  @Input('backgroundImageIndex') backgroundImageIndex: number;
  @Output() changeBackground = new EventEmitter<number>();
  demoVideo = false;
  constructor(public loginComponent: LoginComponent, private httpService: HttpService) {}

  ngOnInit(): void {
    const requestData: OfflineBroadcastMessage_Request = {
      versionDetails: { version: '1' },
      clientDetails: { source: 'WEB' },
    };

    this.broadcastMessages = [];

    this.httpService
      // .httpPost('broadcastMessageService/public/getOfflineBroadcastMessages', requestData })
      .httpPost('broadcastMessages', requestData)
      .subscribe(
        (broadcastMessageResponse: OfflineBroadcastMessage_Response) => {
          this.broadcastMessages = broadcastMessageResponse.dataMap.broadcastMessages;

          let i = 0;
          this.broadcastMessageIndex = i;
          this.broadcastMessage = this.broadcastMessages[i];

          const broadcastMessagesMaxIndex = this.broadcastMessages.length - 1;
          setInterval(() => {
            i++;
            this.changeMessage(i);

            if (i === broadcastMessagesMaxIndex) {
              i = -1;
            }
          }, 5000);
        },
        (error: any) => {},
      );
  }

  changeMessage(i: number) {
    this.broadcastMessage = this.broadcastMessages[i];
    this.broadcastMessageIndex = i;
  }

  changeBgImage(i: number) {
    this.changeBackground.emit(i);
  }

  onLoginClick(): void {
    this.isMobileScreenLogin = true;
    this.isMobileScreenLoginChange.emit(this.isMobileScreenLogin);
  }

  onLoginHelpClick(value): void {
    if (value.id != "dv") {
      window.open(value.link)
    }
  }
}
