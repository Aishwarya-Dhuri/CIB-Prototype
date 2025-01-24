import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { FileUploadLogService } from './@services/file-upload-log.service';

@Component({
  selector: 'app-file-upload-log',
  templateUrl: './file-upload-log.component.html',
  styleUrls: ['./file-upload-log.component.scss'],
})
export class FileUploadLogComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  paymentType: string = '';
  period: string = '';
  recentUploadedFile: any[] = [];

  // paymentTypeList = [
  //   {
  //     id: 'Payment Request',
  //     displayName: 'Payment Request',
  //   },
  //   {
  //     id: 'Bill Payment',
  //     displayName: 'Bill Payment',
  //   },
  //   {
  //     id: 'WPS',
  //     displayName: 'WPS',
  //   },
  // ];

  periodList = [
    {
      id: 'Today',
      displayName: 'Today',
    },
    {
      id: 'This Week',
      displayName: 'This Week',
    },
    {
      id: 'This Month',
      displayName: 'This Month',
    },
  ];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private fileUploadLogService: FileUploadLogService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.prepareData();
    const actions: Actions = {
      heading: 'File Upload Log - Report List',
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
      { label: 'Report Enquiry' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }

  prepareData() {
    this.httpService
      .httpPost('payments/transactions/fileUploadLog/private/getRecentUploadedFileData')
      .subscribe((res) => {
        this.recentUploadedFile = res.dataList;
      });
  }

  getSearchResults(filters: Filter[]): void {
    this.fileUploadLogService.paymentMethod = this.paymentType;
    this.fileUploadLogService.selectedFilters = filters;
    this.router.navigate(['./viewResult'], { relativeTo: this.route });
  }

  onDynamicFiltersReady(): void {
    this.fileUploadLogService.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }
}
