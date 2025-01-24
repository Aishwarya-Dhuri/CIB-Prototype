import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { DirectDebitCancellation } from './@model/direct-debit-cancellation.model';
import _ from 'lodash';

@Component({
  selector: 'app-cancellation',
  templateUrl: './cancellation.component.html',
  styleUrls: ['./cancellation.component.scss'],
})
export class CancellationComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;
  @ViewChild('cancelMandateForm') cancelMandateForm: any;
  cancelMandateFormData: DirectDebitCancellation = new DirectDebitCancellation();

  loading: boolean;
  viewMode: boolean = false;
  isSuppdoc = false;
  isMandateUpload = false;
  mode: string;

  formData: DirectDebitCancellation = new DirectDebitCancellation();

  currentScreen: string = 'FILTERS';

  selectedFilters: Filter[] = [];

  colDefUrl: string = 'directDebit/mandateManagement/cancellation/private/mandateColDefs';
  rowData: any[] = [];
  context: any = { componentParent: this };
  frameworkComponents: any = {};
  gridOptions: any = {
    rowModelType: 'clientSide',
  };

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private viewService: ViewService,
  ) { }
  signatureFiles: any[] = [];

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Mandate Cancellation - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionService.setActions(actions);
    if (this.formData.uploadedFileName) {
      this.signatureFiles = [
        {
          fileName: this.formData.uploadedFileName,
          fileSize: this.formData.signatureFileSize,
          progress: 100,
          status: 'Complete',
        },
      ];
    }
    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Direct Debit' },
      { label: 'Mandate Management' },
      { label: 'Cancellation' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      if (this.mode == 'VIEW') {
        this.currentScreen = 'VIEW';
      }

      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('directDebit/mandateManagement/cancellation/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onView(id: string) {
    this.viewMode = true;
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('directDebit/mandateManagement/registration/private/view', data)
      .subscribe((formData: any) => {
        this.formData = { ...formData, mandateReferenceNumber: formData.id };
        this.currentScreen = 'VIEW';
      });
  }

  onCancelMandate(id: string) {
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('directDebit/mandateManagement/registration/private/view', data)
      .subscribe((formData: any) => {
        this.formData = { ...formData, mandateReferenceNumber: formData.id };
        this.currentScreen = 'VIEW';
      });
  }

  close() {
    this.currentScreen = 'SEARCH_RESULTS';
    this.viewMode = false;
  }

  back() {
    this.router.navigate(['./', 'listing'], { relativeTo: this.route });
  }
  onSignatureFileSelected(files: any[]) {
    let filesToUpload = _.cloneDeep(files);
    this.cancelMandateFormData.uploadedFileName = '';
    this.cancelMandateFormData.signatureFileName = '';
    this.cancelMandateFormData.signatureFileSize = 0;
    if (!filesToUpload || filesToUpload.length == 0) return;

    filesToUpload.forEach((file: any) => {
      const data = new FormData();
      data.append('files', file);
      this.httpService
        .httpPost('fileUploadService/setup/security/corporateUser/signature', data)
        .subscribe((res: any) => {
          if (res && res.dataMap && res.dataMap.file) {
            this.cancelMandateFormData.uploadedFileName = res.dataMap.file.originalname;
            this.cancelMandateFormData.signatureFileName = res.dataMap.file.filename;
            this.cancelMandateFormData.signatureFileSize = file.fileSize;
          }
        });
    });
  }
  cancelMandate() {
    const data = this.formData;
    this.httpService
      .httpPost('directDebit/mandateManagement/cancellation/private/create', data)
      .subscribe((response: any) => {
        this.formData = {
          cancellationRemarks: response.cancellationRemarks
        };
        this.back();
      });
  }

  getRecords(filters: Filter[]) {
    this.selectedFilters = filters;

    this.httpService
      .httpPost('directDebit/mandateManagement/cancellation/private/getCancellationList', {
        dataMap: filters,
      })
      .subscribe((data: any) => {
        this.rowData = data.dataList;
        this.currentScreen = 'SEARCH_RESULTS';
      });
  }

  onDynamicFiltersReady() {
    this.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }
}
