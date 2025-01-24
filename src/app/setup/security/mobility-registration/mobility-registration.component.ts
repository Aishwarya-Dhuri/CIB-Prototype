import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { MobilityRegistration } from './@model/mobility-registration.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-mobility-registration',
  templateUrl: './mobility-registration.component.html',
  styleUrls: ['./mobility-registration.component.scss']
})
export class MobilityRegistrationComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  billers: any[] = [];
  accounts: any[] = [];
  mode: string;

  formData: MobilityRegistration = new MobilityRegistration();

  stepperDetails: Stepper = {
    masterName: 'Mobility Registration',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: [''],
  };

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private viewService: ViewService,
    private router: Router,
    private route: ActivatedRoute,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
  ) { }

  ngOnInit(): void {

    const actions: Actions = {
      heading: 'Mobility Registration - Initiate',
      subHeading: null,
      // widgetsActions: false,
      refresh: true,
      // widgets: false,
      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Setup' },
      { label: 'Security' },
      { label: 'Mobility Registration' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData.effectiveStartDate = this.userService.getApplicationDate();



    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/security/mobilityRegistration/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          if (formData) {
            this.formData = formData;
            if (this.mode == 'VIEW') {
              this.stepperDetails.currentStep = this.stepperDetails.headings.length;
            }
          }
        });
    }
  }



  treeData: any[] = [
    {
      nodes: [
        {
          isLeafNode: false,
          header: 'Enter Nick name for ADCB Mobile App',
          data: [],
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
    {
      nodes: [
        {
          isLeafNode: false,
          header: 'Click on generate code button to send Activation code',
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
    {
      nodes: [
        {
          isLeafNode: false,
          header: 'Download ADCB ProCash Application from App Store.',
          data: [],
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
    {
      nodes: [
        {
          isLeafNode: false,
          header: 'Enter the Activation code received in downloaded mobile Application.',
          data: [],
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
    {
      nodes: [
        {
          isLeafNode: false,
          header: 'On successful registration of mobile,the device will be registered and available in "Registered Devices" menu.',
          data: [],
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
  ];



  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return this.form && this.form.valid;
    }
    return true;
  }

  goToListing() {
    this.router.navigate(['./listing'], { relativeTo: this.route });
  }

}
