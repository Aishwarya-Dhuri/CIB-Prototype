import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridListingComponent;
  @Input('item') widgetObj: any;
  @Input('index') index: any;
  @Input('title') title: any;
  @Input('id') id: any;
  @Input('serviceUrl') serviceUrl: any;
  @Input('showChangeChartOption') showChangeChartOption: any;

  @Output() action = new EventEmitter<{ type: string; i?: number }>();

  data = [];
  options: any;
  isLoading: boolean = false;

  dailyData = [
    {
      corporateName: 'Structure 1',
      noOfStructures: '5',
      lastExecutedOn: '08-Dec-2024 17:10:00'
    },
  ];
  weeklyData = [
    {
      corporateName: 'Structure 1',
      noOfStructures: '5',
      lastExecutedOn: '08-Dec-2024 17:10:00'
    },
    {
      corporateName: 'Structure 2',
      noOfStructures: '8',
      lastExecutedOn: '09-Dec-2024 10:20:00'
    },
  ];
  monthlyData = [
    {
      corporateName: 'Structure 1',
      noOfStructures: '5',
      lastExecutedOn: '08-Dec-2024 17:10:00'
    },
    {
      corporateName: 'Structure 2',
      noOfStructures: '8',
      lastExecutedOn: '09-Dec-2024 10:20:00'
    },
    {
      corporateName: 'Structure 3',
      noOfStructures: '7',
      lastExecutedOn: '10-Dec-2024 22:30:00'
    },
    {
      corporateName: 'Structure 4',
      noOfStructures: '5',
      lastExecutedOn: '11-Dec-2024 05:00:00'
    },
    {
      corporateName: 'Structure 5',
      noOfStructures: '8',
      lastExecutedOn: '12-Dec-2024 21:45:00'
    },
  ];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    if (!this.widgetObj.dynamicWidgetId) {
      this.data = this.weeklyData;
    } else {
      this.generateDynamicWidget();
    }
  }

  generateDynamicWidget(): void {
    this.isLoading = true;
    const data = {
      dataMap: {
        id: this.widgetObj.dynamicWidgetId,
      },
    };
    this.httpService
      .httpPost('setup/cibSetup/widgetBuilder/private/view', data)
      .subscribe((response: any) => {
        this.options = response.tableGridOptions[0];
        this.getGridData();
      });
  }

  getGridData(): void {
    if (this.options.isApiBasedColDefs) {
      this.options.tableGridWidgetColDefList = [];
      for (let i = 0; i < 3; i++) {
        this.options.tableGridWidgetColDefList.push({
          headerName: 'Column' + (i + 1),
          field: 'column1',
          sortable: true,
        });
      }
    }
    this.options.rowData = [];
    for (let i = 0; i < 5; i++) {
      let row = {};
      this.options.tableGridWidgetColDefList.forEach((col: any) => {
        row[col.field] = col.headerName + Math.floor(Math.random() * 100);
      });
      this.options.rowData.push(row);
    }
    this.isLoading = false;

    setTimeout(() => {
      this.agGrid.fitColumns();
    }, 1000);
  }

  timePeriodChanged(type: string) {
    if (type === 'daily') {
      this.data = this.dailyData;
    } else if (type === 'weekly') {
      this.data = this.weeklyData;
    } else if (type === 'monthly') {
      this.data = this.monthlyData;
    }
  }

  actionEvent(e: { type: string; event?: any }) {
    this.action.emit({ type: e.type, i: this.index });
  }
}
