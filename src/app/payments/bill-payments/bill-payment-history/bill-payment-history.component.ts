import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-bill-payment-history',
  templateUrl: './bill-payment-history.component.html',
  styleUrls: ['./bill-payment-history.component.scss'],
})
export class BillPaymentHistoryComponent implements OnInit {
  corporateType: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.corporateType = this.userService.userDetails.corporateType;
  }
}
