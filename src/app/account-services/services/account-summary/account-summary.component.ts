import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.scss'],
})
export class AccountSummaryComponent implements OnInit {
  corporateType: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.corporateType = this.userService.userDetails.corporateType;
  }
}
