import { Component, OnInit } from '@angular/core';
import { SelfOnboardingService } from '../../@services/self-onboarding.service';

@Component({
  selector: 'app-so-demo-video',
  templateUrl: './so-demo-video.component.html',
  styleUrls: ['./so-demo-video.component.scss'],
})
export class SoDemoVideoComponent implements OnInit {
  constructor(private selfOnboardingService: SelfOnboardingService) {}

  ngOnInit(): void {}
}
