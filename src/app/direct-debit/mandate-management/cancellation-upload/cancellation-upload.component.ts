import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { CancellationUpload } from './@model/cancellation-upload.model';

@Component({
  selector: 'app-cancellation-upload',
  templateUrl: './cancellation-upload.component.html',
  styleUrls: ['./cancellation-upload.component.scss']
})
export class CancellationUploadComponent implements OnInit {
  loading: boolean;
  mode: string;

  formData: CancellationUpload = new CancellationUpload();

  treeData: any[] = [
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Cancellation Upload',
          subHeader: '',
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'File Parsed Successfully',
          subHeader: '',
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Validation in Progress',
          subHeader: '',
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Sent for Approval',
          subHeader: '',
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: true,
          header: 'Authorized',
          subHeader: '',
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
  ];

  stepperDetails: Stepper = {
    masterName: 'Cancellation Upload',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: false,
    isSaveDraftApplicable: false,
    isSecondLastStepLabelAsReview: true,
    secondLastStepTitle: 'Verify Details',
    headings: ['Cancellation Upload', 'Review Details & Confirm'],
  };

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private viewService: ViewService,

  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Cancellation Upload - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Direct Debit' },
      { label: 'Mandate Management' },
      { label: 'Cancellation Upload' },
      { label: 'Upload' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      if (this.mode == 'VIEW') {
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      }

      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('directDebit/mandateManagement/cancellationUpload/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  validateForm(stepNo: number) {
    if (stepNo == 1) {
      return this.formData.product && this.formData.file.length > 0;
    }
    return true;
  }

  productData: any[] = [
    { displayName: 'Mutual Fund SIP', id: 1 },
    { displayName: 'Car Loan EMI', id: 2 },
    { displayName: 'Insurance', id: 3 },
  ];

}
