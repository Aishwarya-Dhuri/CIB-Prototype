import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ManualForecastUpload } from './@models/manual-forecast-upload.model';

@Component({
  selector: 'app-manual-forecast-upload',
  templateUrl: './manual-forecast-upload.component.html',
  styleUrls: ['./manual-forecast-upload.component.scss'],
})
export class ManualForecastUploadComponent implements OnInit {
  formData: ManualForecastUpload = new ManualForecastUpload();

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
  ) {}

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
      { label: 'Account Services' },
      { label: 'Service' },
      { label: 'Manual Forecast' },
      { label: 'Upload' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }

  onFileUploaded(files: any): void {
    this.formData.fileUpload = files;
  }
  onSubmit(): void {}
  cancel(): void {}
}
