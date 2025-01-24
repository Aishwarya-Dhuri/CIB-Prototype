import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Select } from 'src/app/shared/@models/select.model';

@Component({
  selector: 'app-pending-authorization-table',
  templateUrl: './pending-authorization-table.component.html',
  styleUrls: ['./pending-authorization-table.component.scss'],
})
export class PendingAuthorizationTableWidgetComponent implements OnInit {
  @Input('index') index: any;
  @Input('title') title: any;
  @Input('id') id: any;
  @Input('serviceUrl') serviceUrl: any;
  @Input('showChangeChartOption') showChangeChartOption: any;

  @Output() action = new EventEmitter<{ type: string; i?: number }>();

  tableTypes: Select[] = [];
  selectedTableType: Select;

  allData: any = [
    { name: 'Income Tax Payment', amount: 3654.55, type: 'onMe' },
    { name: 'GST Tax', amount: 554.0, type: 'onOthers' },
    { name: 'Mobile Bill Payment', amount: 352.3, type: 'onOthers' },
    { name: 'Internet Bill', amount: 352.3, type: 'onOthers' },
  ];
  data: any = [];

  constructor() {}

  ngOnInit(): void {
    this.tableTypes = [
      { id: 'all', displayName: 'All' },
      { id: 'onMe', displayName: 'On Me' },
      { id: 'onOthers', displayName: 'On Others' },
    ];
    this.selectedTableType = this.tableTypes[0];
    this.tableTypeChanged(this.selectedTableType.id);
  }

  tableTypeChanged(type: string) {
    if (type === 'all') {
      this.data = _.cloneDeep(this.allData);
    } else if (type === 'onMe') {
      this.data = _.filter(this.allData, function (d: any) {
        return d.type == 'onMe';
      });
    } else if (type === 'onOthers') {
      this.data = _.filter(this.allData, function (d: any) {
        return d.type == 'onOthers';
      });
    }
  }

  actionEvent(e: { type: string; event?: any }) {
    this.action.emit({ type: e.type, i: this.index });
  }
}
