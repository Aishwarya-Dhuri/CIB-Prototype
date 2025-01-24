import { Injectable } from '@angular/core';
import _ from 'lodash';
import { HttpService } from '../../shared/@services/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  selectedFrequentReport;

  scheduleReport: any = [
    {
      displayName: 'Report Frequency',
      value: '',
      show: true,
    },
    {
      displayName: 'Generated At',
      value: '',
      show: true,
    },
    {
      displayName: 'Activation Day',
      value: '',
      show: true,
    },
    {
      displayName: 'Report Format',
      value: '',
      show: true,
    },
    {
      displayName: 'Start Time',
      value: '',
      show: true,
    },
    {
      displayName: 'End Time',
      value: '',
      show: true,
    },
    {
      displayName: 'Every',
      value: '',
      show: true,
    },
    {
      displayName: 'From Date',
      value: '',
      show: true,
    },
    {
      displayName: 'To Date',
      value: '',
      show: true,
    },
    {
      displayName: 'Registrered Email',
      value: false,
      show: true,
    },
    {
      displayName: 'Additional Email',
      value: false,
      show: true,
    },
    {
      displayName: 'Email Ids: To',
      value: '',
      show: true,
    },
    {
      displayName: 'H2H',
      value: true,
      show: true,
    },
    {
      displayName: 'Email',
      value: false,
      show: true,
    },
    {
      displayName: 'isScheduleReport',
      value: false,
      show: true,
    },
    {
      radioScheduleReport: 'excel',
    },
  ];

  constructor(private httpService: HttpService) {}

  getMostFrequentReports(filterModel = {}): Observable<any> {
    const reqdata = {
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: filterModel,
      sortModel: [],
      entityName: '',
    };
    // filterModel.authorized = { filterType: 'text', type: 'equals', filter: 'N' }
    return this.httpService
      .httpPost('reports/private/getReportList', reqdata) //'reports/private/mostFrequentReportData'
      .pipe(map((res) => res.data));
    /*.subscribe((res) => {
        const reports = _.uniqBy(res.data,'reportId') ;
        console.log('mostFrequentReports', reports);
      });*/
  }
}
