import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

class ManualForecastUploadModel {
  constructor(
    public dataLayout = '',
    public uploadFile = [],
    public fileName = '',
    public channel = 'H2H',
    public status = 'E',
  ) { }
}

@Component({
  selector: 'app-manual-forecast-upload',
  templateUrl: './manual-forecast-upload.component.html',
  styleUrls: ['./manual-forecast-upload.component.scss']
})
export class ManualForecastUploadComponent implements OnInit {
  formData: ManualForecastUploadModel;
  isLayoutData = false;
  isInfo = false;
  dataLayouts: any[] = [
    {
      id: 'Template1',
      displayName: 'Template1',
    }
  ];
  mode: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
    private router: Router,
  ) {
    this.formData = new ManualForecastUploadModel();
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Manual Forecast Upload',
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
      { label: 'Cashflow' },
      { label: 'Transactions' },
      { label: 'Manual Forecast Upload' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('cashflow/transactions/manualForecastUpload/private/view', data)
        .subscribe((formData: ManualForecastUploadModel) => {
          this.viewService.clearAll();
          this.formData = formData;
        });
    }
  }

  onFileUploaded(files: any[]) {
    this.formData.uploadFile = [];

    this.formData.fileName = files[0].fileName;

    this.formData.uploadFile.push({
      originalFileName: files[0].fileName,
      sysFileName: files[0].sysFileName,
      size: files[0].fileSize,
      ...files[0],
    });
  }

  onSubmit() {
    let url = 'cashflow/transactions/manualForecastUpload/private/';
    if (this.mode == 'edit' || this.mode == 'resubmit') {
      url = url + 'update';
    } else {
      url = url + 'create';
    }
    this.httpService.httpPost(url, this.formData).subscribe((response: any) => {
      this.goToListing();
    });
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url + '/listing');
  }

}
