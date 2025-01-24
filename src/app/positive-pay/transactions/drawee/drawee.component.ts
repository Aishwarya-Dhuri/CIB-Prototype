import { Component, OnInit } from '@angular/core';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';

@Component({
  selector: 'app-drawee',
  templateUrl: './drawee.component.html',
  styleUrls: ['./drawee.component.scss'],
})
export class DraweeComponent implements OnInit {
  formData: any = {
    draweeName: '',
  };

  stepperDetails: Stepper = {
    masterName: 'Drawee',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    isSecondLastStepLabelAsReview: false,
    headings: [''],
  };

  constructor(private httpService: HttpService, private toasterService: ToasterService) {}

  ngOnInit(): void {}

  beforeSubmit() {
    this.httpService
      .httpPost('positivePay/transactions/drawee/private/create', this.formData)
      .subscribe((response: any) => {
        let msg = this.stepperDetails.masterName + ' initiated successfully';
        this.toasterService.showToaster({ severity: 'success', detail: msg });
      });

    return false;
  }
}
