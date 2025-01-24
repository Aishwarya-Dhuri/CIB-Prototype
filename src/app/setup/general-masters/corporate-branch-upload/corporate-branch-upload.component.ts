import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

class CorporateBranchUploadModel {
  constructor(
    public transactionDate: any = new Date(),
    public uploadDocument: any[] = [],
    public fileName: string = '',
    public channel: string = 'H2H',
    public status: string = 'E',
    public noOfBranches: number = 0,
  ) {}
}

@Component({
  selector: 'app-corporate-branch-upload',
  templateUrl: './corporate-branch-upload.component.html',
  styleUrls: ['./corporate-branch-upload.component.scss'],
})
export class CorporateBranchUploadComponent implements OnInit {
  loading: boolean = true;

  formData: any;
  isLayoutData = false;

  branchDetails: any;

  isGroupUser: boolean = false;

  mode = '';

  treeData: any[] = [
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Corporate Branch Initiate',
          subHeader: '12 Aug 2022, 13:35',
          data: [],
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
          subHeader: '12 Aug 2022, 13:35',
          data: ['Total Records: 10000', 'Parsed: 7500', 'Failed: 2500'],
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
          header: 'Validation in Process',
          subHeader: '12 Aug 2022, 13:35',
          data: [],
          active: false,
          partiallyActive: true,
          disabled: false,
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
          data: [],
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
          data: [],
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
  ];

  stepperDetails: Stepper = {
    masterName: 'Corporate Branch Upload',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    // isSaveAsTemplateApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: [''],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
    private userService: UserService,
    private router: Router,
  ) {
    this.formData = new CorporateBranchUploadModel();
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Corporate Branch Upload',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Setup' },
      { label: 'General Masters' },
      { label: 'Corporate Branch Upload' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.mode = this.viewService.getMode();

    if (this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('setup/generalMasters/corporateBranchUpload/private/view', data)
        .subscribe((formData: CorporateBranchUploadModel) => {
          this.viewService.clearAll();

          this.stepperDetails.currentStep = this.stepperDetails.headings.length;

          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onViewBranch(branchId: string) {
    console.log(this.formData.id, branchId);
    this.httpService
      .httpPost('setup/generalMasters/corporateBranchUpload/private/viewBranch', {
        dataMap: { id: this.formData.id, branchId },
      })
      .subscribe((response: any) => {
        this.branchDetails = response;
      });
  }

  validateForm(stepNo: number) {
    if (stepNo == 1) {
      return this.formData.uploadDocument.length > 0;
    }
    return true;
  }

  onFileUploaded(file: any) {
    this.formData.uploadDocument = file;
  }

  beforeSubmit() {
    const formData = new FormData();

    formData.append('transactionDate', this.formData.transactionDate);
    formData.append('channel', this.formData.channel);
    formData.append('status', this.formData.status);
    formData.append(
      'corporateBranchFile',
      this.formData.uploadDocument[0],
      this.formData.uploadDocument[0].name,
    );
    this.formData = formData;

    return true;
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url + '/listing');
  }
}
