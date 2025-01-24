import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewportService } from '../shared/@services/viewport.service';

@Component({
  selector: 'app-self-onboarding',
  templateUrl: './self-onboarding.component.html',
  styleUrls: ['./self-onboarding.component.scss'],
})
export class SelfOnboardingComponent implements OnInit, OnDestroy {
  constructor(public viewportService: ViewportService) {}

  ngOnInit(): void {
    window.addEventListener('resize', (event: any) => {
      if (event.target.innerWidth <= 991) {
        this.viewportService.setViewport('mobile');
      } else {
        this.viewportService.setViewport('web');
      }
    });

    if (window.innerWidth <= 991) {
      this.viewportService.setViewport('mobile');
    } else {
      this.viewportService.setViewport('web');
    }
  }

  ngOnDestroy(): void {
    window.removeAllListeners('resize');
  }
}
