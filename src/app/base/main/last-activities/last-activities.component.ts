import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-last-activities',
  templateUrl: './last-activities.component.html',
  styleUrls: ['./last-activities.component.scss'],
})
export class LastActivitiesComponent implements OnInit {
  // @Output() cancel = new EventEmitter<void>();
  dontShowAgain: boolean = false;
  dsaType = 'today';

  userDetails!: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userDetails = this.userService.userDetails;
  }

  goToDashboard() {
    this.userService.setLastActivities(false);
    // this.cancel.emit();
  }
}
