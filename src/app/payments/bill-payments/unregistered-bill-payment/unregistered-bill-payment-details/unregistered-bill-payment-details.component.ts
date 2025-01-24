import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-unregistered-bill-payment-details',
  templateUrl: './unregistered-bill-payment-details.component.html',
  styleUrls: ['./unregistered-bill-payment-details.component.scss'],
})
export class UnregisteredBillPaymentDetailsComponent implements OnInit {
  corporateType: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.corporateType = this.userService.userDetails.corporateType;
  }
}
