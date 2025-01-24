import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpService } from '../../@services/http.service';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements OnInit {
  @ViewChild('searchModal') searchModal: any;

  loading: boolean = false;

  @Input() isShow: boolean;
  @Input() isShowReset: boolean = false;
  @Output() isShowChange = new EventEmitter<boolean>();

  @Input() header!: string;
  @Input() colDefUrl: string;
  @Input() rowDefUrl: string;
  @Input() rowDefReq?: any = {};
  @Input() selectBtnCaption!: string;
  @Input() isMultiSelect!: boolean;
  @Input() preSelectedIds!: string[];
  @Input() preSelectedData?: any[] = [];
  @Input() preSelectedDataKey?: string = '';

  @Output() onSelection = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  @ViewChild('searchModal') searchModalGrid: any;

  gridOptions: any;
  selectedRecord: any = [];

  rowData: any[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loading = true;

    this.selectBtnCaption = this.selectBtnCaption ? this.selectBtnCaption : 'SELECT';
    this.gridOptions = {
      rowModelType: 'clientSide',
      suppressRowClickSelection: true,
      pagination: true,
      rowSelection: this.isMultiSelect ? 'multiple' : 'single',
    };

    this.httpService.httpPost(this.rowDefUrl, { dataMap: this.rowDefReq }).subscribe((res) => {
      this.rowData = res?.data ? res.data : res?.dataList ? res.dataList : [];

      this.loading = false;
    });
  }

  gridReady() {
    this.selectedRecord = [];
  }

  onFirstDataRendered() {
    if (this.preSelectedIds) {
      setTimeout(() => {
        this.searchModalGrid.selectRowsByIds(this.preSelectedIds);
      }, 350);
    } else if (this.preSelectedData) {
      setTimeout(() => {
        this.preSelectedData.forEach((data: any) => {
          this.searchModalGrid.selectRow(
            data,
            this.preSelectedDataKey ? this.preSelectedDataKey : 'id',
          );
        });
      }, 350);
    }
  }

  onRowSelected(e: any) {
    this.selectedRecord = this.searchModalGrid.getSelectedRows();
  }

  onReset() {
    this.isShow = false;
    this.isShowChange.emit(this.isShow);
    this.reset.emit();
  }

  onClose() {
    this.isShow = false;
    this.isShowChange.emit(this.isShow);
    this.close.emit();
  }

  onRecordSelection() {
    this.onSelection.emit(this.isMultiSelect ? this.selectedRecord : this.selectedRecord[0]);
    this.onClose();
  }
}
