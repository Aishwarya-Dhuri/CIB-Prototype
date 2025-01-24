import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BookForwardComponent } from '../book-forward/book-forward.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/@services/user.service';
import { bookForward } from 'src/app/fx-connect/forward-contracts/@models/book-forward.model';
import { ToasterService } from 'src/app/shared/@services/toaster.service';

@Component({
  selector: 'app-book-forward-initiation',
  templateUrl: './book-forward-initiation.component.html',
  styleUrls: ['./book-forward-initiation.component.scss'],
})
export class BookForwardInitiationComponent implements OnInit {
  @ViewChild('form') form: any;
  bookForwardData: bookForward = new bookForward();

  dealTypeDataList: any = [
    {
      id: 'forward',
      displayName: 'Forward',
    },
    {
      id: 'cash',
      displayName: 'Cash',
    },
    {
      id: 'tom',
      displayName: 'TOM',
    },
    {
      id: 'spot',
      displayName: 'Spot',
    },

  ]
  forwardContractDataList: any = [
    {
      id: 'fixed',
      displayName: 'Fixed Forward Contract',
    },
    {
      id: 'option',
      displayName: 'Option Forward Contract',
    },
  ]
  fieldsetDisabled: boolean = false;
  loading: boolean = false;


  constructor(private router: Router,
    private route: ActivatedRoute, private userService: UserService, private toasterService: ToasterService,

  ) { }

  ngOnInit(): void {
  }

  onFileUploaded(files: any): void {
    this.bookForwardData.supportingDocList = files;
    console.log(this.bookForwardData.supportingDocList);
  }
  onStepsReady() {
    // if (this.repair) {
    //   this.parentRef.stepperDetails.steps = this.parentRef.stepperDetails.steps.map((step: any) => {
    //     step.stepStatus = 'success';
    //     return step;
    //   });

    //   this.parentRef.stepperDetails.steps[3].stepStatus = 'repair';

    //   this.parentRef.stepperDetails.steps[4].stepStatus = 'repair';

    //   this.repairFields.accountNumberForChargesOld =
    //     this.parentRef.formData.paymentDetails[0].accountNumberForCharges;

    //   this.repairFields.latestDateOfShippingOld =
    //     this.parentRef.formData.shippingDetails[0].latestDateOfShipping;
    // } else if (this.parentRef.mode == 'EDIT') {
    //   this.parentRef.stepperDetails.steps = this.parentRef.stepperDetails.steps.map((step: any) => {
    //     step.stepStatus = 'success';
    //     return step;
    //   });
    // }

    // this.setStep();
  }

  next(form: any) {
    // if (form.status == 'INVALID') {
    //   this.toasterService.showToaster({ severity: 'warn', detail: 'Please Enter All Details', life: 7000 });
    // }
    // else {
    this.loading = true;
    console.log(this.bookForwardData);
    this.fieldsetDisabled = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    // }
  }

  onSubmit() {
    this.toasterService.showToaster({ severity: 'success', detail: 'Book Forward Initiated Successfully', life: 7000 });
    this.router.navigateByUrl(this.userService.dashboardRouteUrl);
  }

  cancel() {
    // if (this.parentRef.onCancelClick) this.parentRef.onCancelClick();
    // else 
    this.router.navigateByUrl(this.userService.dashboardRouteUrl);
    // this.router.navigate(['forwardContracts/bookForward'], { relativeTo: this.route });
  }

  backToForm() {
    this.fieldsetDisabled = false;
  }

}
