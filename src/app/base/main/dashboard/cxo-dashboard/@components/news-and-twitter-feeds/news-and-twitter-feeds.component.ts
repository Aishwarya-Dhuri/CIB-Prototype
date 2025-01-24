import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { SidebarService } from 'src/app/shared/@services/sidebar.service';

@Component({
  selector: 'app-news-and-twitter-feeds',
  templateUrl: './news-and-twitter-feeds.component.html',
  styleUrls: ['./news-and-twitter-feeds.component.scss'],
})
export class NewsAndTwitterFeedsComponent implements OnInit {
  newsFeed: any[] = [];

  constructor(private httpService: HttpService, private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost('commons/commonService/private/getUserNewsFeed', {
        dataMap: {},
      })
      .subscribe((response: any) => {
        this.newsFeed = response.dataList;
      });

    (<any>window).twttr.widgets.load();
  }

  getFeedHeight() {
    return window.innerHeight - 100;
  }

  closeSidebar() {
    this.sidebarService.hideSidebar();
  }
}
