import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-biller-payment-details',
  templateUrl: './biller-payment-details.component.html',
  styleUrls: ['./biller-payment-details.component.scss'],
})
export class BillerPaymentDetailsComponent implements OnInit {
  corporateType: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.corporateType = this.userService.userDetails.corporateType;
  }
}
