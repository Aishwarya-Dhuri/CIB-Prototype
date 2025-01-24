import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-single-payment-request',
  templateUrl: './single-payment-request.component.html',
  styleUrls: ['./single-payment-request.component.scss'],
})
export class SinglePaymentRequestComponent implements OnInit {
  corporateType: string;

  colClass: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.corporateType = this.userService.userDetails.corporateType;
  }
}
