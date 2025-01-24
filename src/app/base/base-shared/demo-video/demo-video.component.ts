import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-demo-video',
  templateUrl: './demo-video.component.html',
  styleUrls: ['./demo-video.component.scss'],
})
export class DemoVideoComponent implements OnInit, OnDestroy {
  @Output() closeDemoVideo = new EventEmitter<void>();

  constructor(@Inject(DOCUMENT) private document: any) {}

  ngOnInit(): void {
    this.document.addEventListener('keydown', (e: any) => {
      if (e.keyCode == 27) {
        this.videoClose();
      }
    });
  }

  videoClose() {
    this.closeDemoVideo.emit();
  }

  ngOnDestroy() {
    this.document.removeAllListeners();
  }
}
