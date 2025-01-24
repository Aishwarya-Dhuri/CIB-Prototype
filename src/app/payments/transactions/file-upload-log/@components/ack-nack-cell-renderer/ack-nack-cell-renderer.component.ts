import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { HttpService } from 'src/app/shared/@services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ack-nack-cell-renderer',
  templateUrl: './ack-nack-cell-renderer.component.html',
  styleUrls: ['./ack-nack-cell-renderer.component.scss'],
})
export class AckNackCellRendererComponent implements OnInit {
  data: any;
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {}

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.data = params.data;
  }

  onAckNackClick(type: string) {
    if (type === 'ACK') {
      this.httpService.httpDownload('fileUploadLog/KUWAITTEMP01_H2H_475.xlsx_ack.txt');
    } else if (type === 'NACK') {
      this.httpService.httpDownload('fileUploadLog/KUWAITTEMP01_H2H_475.xlsx_nack.txt');
      //   window.open(environment.serverUrl + '/TESLADLXLS_IFT4.xls', '_blank');
    } else {
      //   window.open(environment.serverUrl + '/TESLADLXLS_IFT5.xls', '_blank');
    }
  }

  onStatusClick() {
    window.open(environment.serverUrl, '_blank');
  }
}
