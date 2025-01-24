import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { AckNackCellRendererComponent } from '../@components/ack-nack-cell-renderer/ack-nack-cell-renderer.component';
import { FileUploadLogService } from '../@services/file-upload-log.service';

@Component({
  selector: 'app-view-result',
  templateUrl: './view-result.component.html',
  styleUrls: ['./view-result.component.scss'],
})
export class ViewResultComponent implements OnInit {
  filters: any[] = [];
  viewPort: string;
  colDefUrl = 'payments/transactions/fileUploadLog/private/fileUploadLogListColDefs';
  dataUrl = 'payments/transactions/fileUploadLog/private/getAllList';
  gridOptions = {
    context: { componentParent: this },
  };
  frameworkComponents = {
    ackNackCellRenderer: AckNackCellRendererComponent,
  };

  constructor(
    private fileUploadLogService: FileUploadLogService,
    private router: Router,
    private route: ActivatedRoute,
    private viewPortService: ViewportService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.viewPortService.getViewport().subscribe((res) => {
      this.viewPort = res;
    });
    const actions: Actions = {
      heading: 'File Upload Log - Search Result',
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
      { label: 'Payments' },
      { label: 'Transactions' },
      { label: 'File Upload Log' },
      { label: 'Report List' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.filters = this.fileUploadLogService.selectedFilters;
  }

  onClearSearchClick() {
    this.fileUploadLogService.selectedFilters = [];
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onModifyClick() {
    // this.fileUploadLogService.selectedFilters = this.filters
    // this.router.navigateByUrl('payments/transactions/fil-upload-log');
  }
}
