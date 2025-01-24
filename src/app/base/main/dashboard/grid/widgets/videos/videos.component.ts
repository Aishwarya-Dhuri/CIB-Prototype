import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosWidgetComponent implements OnInit {
  videoList: any[] = [];
  selectedVideoIndex: number;

  constructor(@Inject(DOCUMENT) private document: any) {}

  ngOnInit(): void {
    let serverUrl =
      this.document.location.protocol + '//' + this.document.location.hostname + ':3000/';
    this.videoList = [
      {
        tittle: 'How Does SWIFT Work?',
        url: serverUrl + 'assets/dashboard/widgetVideos/sample-mp4-file1.mp4',
      },
      {
        tittle: 'What are Virtual Accounts?',
        url: serverUrl + 'assets/dashboard/widgetVideos/sample-mp4-file2.mp4',
      },
    ];

    this.selectedVideoIndex = 0;
  }

  viewVideo(index: number): void {
    if (index > -1 && index < this.videoList.length) {
      this.selectedVideoIndex = -1;
      setTimeout(() => {
        this.selectedVideoIndex = index;
      }, 10);
    }
  }
}
