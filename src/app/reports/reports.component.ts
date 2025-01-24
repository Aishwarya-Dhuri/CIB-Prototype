import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '../base/@models/actions';
import { Breadcrumb } from '../base/main/@models/breadcrumb.model';
import { ActionService } from '../base/main/@services/action.service';
import { BreadcrumbService } from '../base/main/@services/breadcrumb.service';
import { MenuService } from '../base/main/@services/menu.service';
import { GenericListingComponent } from 'src/app/shared/@components/generic-listing/generic-listing.component';
import { HttpService } from '../shared/@services/http.service';
import { ViewportService } from '../shared/@services/viewport.service';
import { ViewService } from '../shared/services/view-service/view-service';
import { DownloadReportRendererComponent } from './@components/download-report-renderer/download-report-renderer.component';
import { ReportService } from './@services/report.service';
import _ from 'lodash';
import { map } from 'rxjs/operators';
import { forkJoin, Observable, Subject } from 'rxjs';
import { REPORT_URL_CONSTANT } from './@models/report.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  @ViewChild('generatedReportGrid') generatedReportGrid: any;

  parentComponentRef: any = this;
  mostFrequentReports: Observable<any[]>;
  product: string;
  reportType: string;
  viewPort: string;
  dataSource: any;
  reportUrl: any;

  colDefsUrl: string = 'reports/private/colDef';
  rowDefsUrl: string = 'reports/private/getReportList';

  rowData: any;
  frameworkComponents = {
    downloadReportRenderer: DownloadReportRendererComponent,
  };

  gridOptions = {
    // rowModelType: "clientSide",
    context: { componentParent: this },
  };

  isOpenConfirm: boolean;
  confirmMessage: string;
  confirmBtnCaption: string;
  confirmSubject: Subject<boolean>;

  constructor(
    protected actionsService: ActionService,
    protected breadcrumbService: BreadcrumbService,
    protected httpService: HttpService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected menuService: MenuService,
    protected viewPortService: ViewportService,
    protected viewService: ViewService,
    protected reportService: ReportService,
  ) {
    // super(actionsService, breadcrumbService, menuService, router, viewService, httpService);
  }

  ngOnInit(): void {
    // super.ngOnInit();
    this.viewPortService.getViewport().subscribe((res) => {
      this.viewPort = res;
    });
    this.getParams();
    const actions: Actions = {
      heading: 'Reports - Listing',
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
      { label: this.getProductByParams(this.product) },
      { label: this.getCategoryByParams(this.reportType) },
      { label: 'Report' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }

  // getGridData() {
  //   const reqData = {
  //     dataMap: {
  //       productName: this.getProductByParams(this.product),
  //       category: this.getCategoryByParams(this.reportType)
  //     }
  //   }
  //   this.httpService.httpPost('reports/private/getGridFilteredData', reqData).subscribe(res => {
  //     this.rowData = res.dataList
  //     if (this.generatedReportGrid) {
  //       this.generatedReportGrid.setRowData(this.rowData)
  //     }

  //   })
  // }

  getProductByParams(product) {
    var str: string;
    switch (product) {
      case 'setup':
        str = 'Setup';
        return str;
      case 'payments':
        str = 'Payments';
        return str;
      case 'vam':
        str = 'VAM';
        return str;
      case 'collections':
        str = 'Collections';
        return str;
      case 'cashflow':
        str = 'Cashflow';
        return str;
      case 'lms':
        str = 'LMS';
        return str;
    }
    return str;
  }

  getCategoryByParams(reportType) {
    var str: string;
    switch (reportType) {
      case 'audit':
        str = 'Audit';
        return str;
      case 'generic':
        str = 'Generic';
        return str;
      case 'master':
        str = 'Master';
        return str;
    }
    return str;
  }

  getMostFrequentReports(filterModel) {
    this.mostFrequentReports = this.reportService
      .getMostFrequentReports(filterModel)
      .pipe(map((res) => _.uniqBy(res, 'reportId')));
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.product = params['product'];
      this.reportType = params['reportType'];
      // this.getGridData();
      const filterModel = {
        productName: {
          filterType: 'text',
          type: 'equals',
          filter: this.getProductByParams(this.product),
        },
        categoryName: {
          filterType: 'text',
          type: 'equals',
          filter: this.getCategoryByParams(this.reportType),
        },
      };
      this.rowData = {
        filterModel,
      };
      console.log('rowData', this.rowData);
      this.getMostFrequentReports(filterModel);
    });
  }

  onFrequentReportClick(selectedReport) {
    this.reportService.selectedFrequentReport = selectedReport;
    this.viewService.setId(selectedReport.id);
    this.viewService.setExtraData({ reportDetails: selectedReport });

    this.router.navigateByUrl(
      '/reports/' +
      selectedReport.productName.toLowerCase() +
      '/' +
      selectedReport.categoryName.toLowerCase() +
      '/initiate',
    );
  }

  createNewReport() {
    this.router.navigateByUrl('/reports/' + this.product + '/' + this.reportType + '/initiate');
  }

  downloadReport(id, reportId, reportFileType) {
    const reqData = {
      dataMap: {
        id: id,
        reportId: reportId,
        fileType: reportFileType,
      },
    };
    this.httpService
      .httpPost('reports/private/downloadReport', reqData)
      .subscribe((response: any) => {
        if (response.responseStatus.status == 0) {
          this.httpService.httpDownload(response.dataMap.filePath);
        }
      });
  }

  showOnlineReport(id: string, reportId: string, reportFileType: string) {
    console.log('show online report ');
    const dataMap = {
      id: id,
      reportId: reportId,
      fileType: reportFileType,
    };
    const rowData = this.generatedReportGrid.rowData;
    console.log('rowData', rowData);
    const data = rowData.find((d) => d.id === id);
    const filters = [
      { displayName: 'From Date', value: data.fromDate },
      { displayName: 'To Date', value: data.toDate },
    ];
    this.viewService.setId(id);
    this.viewService.setExtraData({ dataMap, filters });
    this.router.navigateByUrl(
      '/reports/' + this.product + '/' + this.reportType + '/OnScreenReport',
    );
  }

  showConfirmModal(confirmMessage: string, confirmBtnCaption?: string): Observable<boolean> {
    this.confirmSubject = new Subject<boolean>();
    this.confirmMessage = confirmMessage;
    this.confirmBtnCaption = confirmBtnCaption ? confirmBtnCaption : null;
    this.isOpenConfirm = true;
    return this.confirmSubject.asObservable();
  }

  onConfirm(isConfirm: boolean) {
    this.confirmSubject.next(isConfirm);
    this.confirmSubject.complete();
  }

  delete(id: string): void {
    this.showConfirmModal('Are you sure you want to delete it?', 'DELETE').subscribe(
      (isConfirm: boolean) => {
        if (isConfirm) {
          let data = { dataMap: { id: id } };
          this.httpService.httpPost(REPORT_URL_CONSTANT.DELETE, data).subscribe((res) => {
            this.refresh();
          });
        }
      },
    );
  }

  refresh() {
    // if (!isSkipListingType) this.getListingTypes();
    // this.resetRowSelections();
    this.generatedReportGrid.refreshGridList();
  }

  // onDownloadClick(data) {
  //   const reqData = {
  //     reportId: data.id
  //   }
  //   this.httpService.httpPost('reports/private/donwloadReport', reqData).subscribe((res: any) => {
  //     res
  //   })
  //   // window.open(environment.serverUrl + URL, '_blank')
  // }
}
