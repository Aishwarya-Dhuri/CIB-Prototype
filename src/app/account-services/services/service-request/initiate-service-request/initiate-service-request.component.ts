import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/shared/@services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ServiceRequestService } from '../@services/service-request.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { ServiceRequestModel } from '../@model/service-requesr.model';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-initiate-service-request',
  templateUrl: './initiate-service-request.component.html',
  styleUrls: ['./initiate-service-request.component.scss'],
})
export class InitiateServiceRequestComponent implements OnInit, OnDestroy {
  @ViewChild('usersListGrid') usersListGrid: any;
  @ViewChild('srForm') srForm: NgForm;

  loading: boolean = true;
  acceptTermsAndConditions: boolean = true;

  mode: string;

  formData: ServiceRequestModel;

  editIndex: number = -1;

  inputForm: any = {};

  fieldTypes: any;

  treeData: any[] = [
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Initiation',
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
          header: 'Authorization',
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
          header: 'Bank Approval',
          subHeader: '',
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
  ];

  isSubmit = false;

  stepperDetails: Stepper = {
    masterName: 'Service Request',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: false,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['Service Request Details', 'Review Details & Confirm'],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private serviceRequestService: ServiceRequestService,
    private httpService: HttpService,
    private viewService: ViewService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Service Request - Initiate',
      subHeading: null,

      refresh: true,

      download: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Service' },
      { label: 'Service Request' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData = new ServiceRequestModel();

    this.formData.corporateCode = this.userService.userDetails.corporateCode;
    this.formData.corporateName = this.userService.userDetails.corporateName;

    this.mode = this.viewService.getMode();

    if (this.mode) {
      let url = 'accountServices/services/serviceRequest/private/view';

      const data = { dataMap: { id: this.viewService.getId() } };

      if (this.mode === 'VIEW') {
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      } else if (this.mode === 'DRAFT') {
        url = 'accountServices/services/serviceRequest/private/viewDraft';
      }

      this.httpService.httpPost(url, data).subscribe((response: any) => {
        this.formData = response;

        if (this.mode !== 'VIEW') {
          this.onChangeSrSubType();

          this.formData.srColDefs.push({
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: 'actionCellRenderer',
          });

          this.formData.srRowData = this.formData.srRowData.map((data: any) => {
            data['actions'] = this.getActions();
            return data;
          });
        }

        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  generateForm() {
    if (!this.mode) {
      this.formData.srColDefs = [];
      this.formData.srRowData = [];
      this.inputForm = {};
    }

    if (this.fieldTypes && this.fieldTypes.fieldList) {
      this.fieldTypes.fieldList.forEach((field: any, i: number) => {
        this.inputForm[field.name] = field.defaultValue ? field.defaultValue : '';
        if (!this.mode) {
          this.formData.srColDefs.push({ field: field.name, headerName: field.displayName });
        }
      });

      if (!this.mode) {
        this.formData.srColDefs.push({
          headerName: 'Actions',
          field: 'actions',
          cellRenderer: 'actionCellRenderer',
        });
      }
    }
  }

  onSubmitForm(event: any) {
    event.preventDefault();
  }

  onChangeSrSubType(srSubType?: any) {
    const data = {
      dataMap: {
        filters: [
          {
            name: 'srClass',
            value: this.formData.srClass,
          },
          {
            name: 'srType',
            value: this.formData.srType,
          },
          {
            name: 'srSubType',
            value: this.formData.srSubType,
          },
        ],
      },
    };

    this.httpService.httpPost('sr/private/view', data).subscribe((res: any) => {
      if (res && res.fieldList) {
        this.fieldTypes = res;
      } else {
        this.fieldTypes = this.serviceRequestService._fieldTypes;
      }
      this.generateForm();
    });
  }

  onStepChange(stepNo: number) {
    const index = this.formData.srColDefs.findIndex((col: any) => col.field == 'actions');
    if (stepNo == 1) {
      if (index == -1) {
        this.formData.srColDefs.push({
          headerName: 'Actions',
          field: 'actions',
          cellRenderer: 'actionCellRenderer',
        });
      }
    } else if (stepNo == 2) {
      if (index > -1) {
        this.formData.srColDefs.splice(index, 1);
      }
    }
    return true;
  }

  validateForm(stepNo: number) {
    if (stepNo == 1) {
      return this.formData.srRowData.length > 0;
    } else if (stepNo == 2) {
      return this.acceptTermsAndConditions;
    }
    return true;
  }

  validateDraftForm(stepNo: number) {
    if (stepNo == 1) {
      return this.formData.srRowData.length > 0;
    }
    return true;
  }

  addRequest() {
    if (this.srForm.valid) {
      const user = {
        id: new Date().getTime().toString(),
        ...this.srForm.value,
        actions: this.getActions(),
      };

      this.formData.srRowData.push(user);

      if (this.usersListGrid) {
        this.usersListGrid.setRowData(this.formData.srRowData);
      }

      this.resetForm();
    }
  }

  edit(id: string) {
    const index: number = this.formData.srRowData.findIndex((data: any) => data.id == id);

    if (index > -1) {
      const formData = cloneDeep(this.formData.srRowData[index]);

      delete formData.id;
      delete formData.actions;

      this.inputForm = formData;

      this.editIndex = index;
    }
  }

  saveEditedData() {
    if (this.editIndex > -1) {
      this.formData.srRowData[this.editIndex] = {
        ...this.formData.srRowData[this.editIndex],
        ...this.inputForm,
      };

      if (this.usersListGrid) {
        this.usersListGrid.setRowData(this.formData.srRowData);
      }

      this.resetForm();

      this.editIndex = -1;
    }
  }

  delete(id: string) {
    const index: number = this.formData.srRowData.findIndex((data: any) => data.id == id);
    if (index > -1) {
      this.formData.srRowData.splice(index, 1);

      if (this.usersListGrid) {
        this.usersListGrid.setRowData(this.formData.srRowData);
      }
    }
  }

  resetForm() {
    this.srForm.reset();
  }

  beforeSubmit() {
    this.formData.srRowData = this.formData.srRowData.map((data: any) => {
      delete data.actions;
      if (!this.mode) {
        delete data.id;
      }
      return data;
    });

    console.log(this.formData);

    return true;
  }

  beforeDraftSubmit() {
    this.formData.srRowData = this.formData.srRowData.map((data: any) => {
      delete data.actions;
      if (!this.mode) {
        delete data.id;
      }

      return data;
    });

    const index = this.formData.srColDefs.findIndex((col: any) => col.field == 'actions');

    if (index > -1) {
      this.formData.srColDefs.splice(index, 1);
    }

    return true;
  }

  afterSubmit(response: any) {
    this.formData.id = response.dataMap.id;

    this.isSubmit = true;
    return false;
  }

  cancel() {
    this.router.navigate(['../listing'], { relativeTo: this.route });
  }

  onBackCLick() {
    this.cancel();
  }

  onViewGuide() {
    this.httpService.httpDownload('serviceRequest/service_request_guide.pdf');
  }

  onDownloadDigitalForm() {
    this.httpService.httpDownload('serviceRequest/service_request_digital_form.pdf');
  }

  private getActions() {
    return [
      {
        index: 0,
        paramList: 'id',
        methodName: 'edit',
        type: 'ICON',
        displayName: 'Edit',
        icon: 'pi pi-pencil',
      },
      {
        index: 0,
        paramList: 'id',
        methodName: 'delete',
        type: 'ICON',
        displayName: 'Delete',
        icon: 'pi pi-trash',
      },
    ];
  }

  ngOnDestroy() {
    this.viewService.setMode(null);
    this.viewService.setId(null);
  }
}
