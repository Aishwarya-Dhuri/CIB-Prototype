import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelfOnboardingService } from '../../@services/self-onboarding.service';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.scss'],
})
export class NewApplicationComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private selfOnboardingService: SelfOnboardingService,
  ) {}

  ngOnInit(): void {}

  newCustomer() {
    this.selfOnboardingService.registrationType = 'new';
    this.router.navigate(['./new'], { relativeTo: this.route });
  }

  existingCustomer() {
    this.selfOnboardingService.registrationType = 'existing';
    // this.selfOnboardingService.setExistingData();
    this.router.navigate(['./existing'], { relativeTo: this.route });
  }
}
