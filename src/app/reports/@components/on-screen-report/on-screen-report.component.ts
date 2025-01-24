import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ViewService } from '../../../shared/services/view-service/view-service';
import { HttpService } from '../../../shared/@services/http.service';
import { ViewportService } from '../../../shared/@services/viewport.service';

@Component({
  selector: 'app-on-screen-report',
  templateUrl: './on-screen-report.component.html',
  styleUrls: ['./on-screen-report.component.scss'],
})
export class OnScreenReportComponent implements OnInit {
  viewport: string;
  isShowOnlineReport = false;
  onlineGridColDef;
  onlineGridData;

  filters;
  constructor(
    private viewService: ViewService,
    private viewportService: ViewportService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
    });
    const data = this.viewService.getExtraData();
    let reqData = { dataMap: {} };
    if (this.viewService.getId()) {
      reqData.dataMap = data.dataMap;
      this.filters = data.filters;
      this.viewService.clearAll();
    }
    const rowData$ = this.httpService.httpPost('reports/private/getOnlineGridColDef', reqData);
    /*.subscribe((res) => {
      // this.refresh();
      // console.log('### $$$ getOnlineGridColDef  ', res);
      this.onlineGridColDef = res;
    })*/
    const columnData$ = this.httpService.httpPost('reports/private/getOnlineGridData', reqData);
    /*.subscribe((res) => {
      console.log('### $$$ getOnlineGridData  ', res);
      this.onlineGridData = res.data;
    });*/
    forkJoin([rowData$, columnData$]).subscribe((results: any[]) => {
      this.onlineGridColDef = results[0];
      this.onlineGridData = results[1].data;
      this.isShowOnlineReport = true;
    });
  }
}
