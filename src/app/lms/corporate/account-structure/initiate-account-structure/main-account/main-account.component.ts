import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-main-account',
  templateUrl: './main-account.component.html',
  styleUrls: ['./main-account.component.scss'],
})
export class MainAccountComponent implements OnInit {
  @ViewChild('form') form: any;

  @Input('parentRef') parentRef: any;

  subSteps: string[] = [
    'Structure Details',
    'Frequency Details',
    'Interest Set up',
    'Cluster Details',
    'Exception Handling',
  ];

  constructor(public userService: UserService) {}

  ngOnInit(): void {}

  addFrequencyPreDefinedDate() {
    this.parentRef.mainAccountDetails.dates.push('');
  }
}
