import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/@services/toaster.service';

@Component({
  selector: 'app-successful-registration',
  templateUrl: './successful-registration.component.html',
  styleUrls: ['./successful-registration.component.scss'],
})
export class SuccessfulRegistrationComponent implements OnInit {
  @Input('applicationNumber') applicationNumber?: string;
  welcomeLetter: boolean = false;
  vKyc: boolean = false;
  confirm: boolean = false;
  kycTime: any = '';
  kycDate: any = '';
  dateformat = new Date().toDateString().split(' ');


  constructor(private toasterService: ToasterService,
    private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
  }

  resetVKYCForm() {
    this.vKyc = false;
  }
  confirmVKyc() {
    this.router.navigate(['/login'], { relativeTo: this.route });
  }
}
