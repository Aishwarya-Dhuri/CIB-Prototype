import { cloneDeep } from 'lodash';
import { Component, EventEmitter, ViewChild, Input, OnInit, Output } from '@angular/core';
import { ACTION_TYPE } from '../../@enums/action-type.enum';

@Component({
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss'],
})
export class ColumnChartComponent implements OnInit {
  @ViewChild('chart') chart: any;

  @Input('index') index: any;
  @Input('title') title: any;
  @Input('id') id: any;
  @Input('serviceUrl') serviceUrl: any;
  @Input('showChangeChartOption') showChangeChartOption: any;

  @Output() action = new EventEmitter<{ type: string; i?: number }>();

  invoiceType = 'amount';

  options: any;
  theme: any;
  type: string = 'weekly';

  data = [];

  loadingCharts: boolean;

  weeklyAmountData = [
    {
      xLabel: 'Hasbhan TC',
      yLabel0: 98000,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Mapco',
      yLabel0: 0,
      yLabel1: 77500,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Bin Moosa',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 85000,
      yLabel3: 0,
    },
    {
      xLabel: 'Farsi',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 85000,
    },
  ];

  dailyAmountData = [
    {
      xLabel: 'Hasbhan TC',
      yLabel0: 50000,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Mapco',
      yLabel0: 0,
      yLabel1: 35000,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Bin Moosa',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 25000,
      yLabel3: 0,
    },
    {
      xLabel: 'Farsi',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 30000,
    },
  ];

  monthlyAmountData = [
    {
      xLabel: 'Hasbhan TC',
      yLabel0: 150000,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Mapco',
      yLabel0: 0,
      yLabel1: 123500,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Bin Moosa',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 114000,
      yLabel3: 0,
    },
    {
      xLabel: 'Farsi',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 186000,
    },
  ];

  weeklyCountData = [
    {
      xLabel: 'Hasbhan TC',
      yLabel0: 98,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Mapco',
      yLabel0: 0,
      yLabel1: 77,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Bin Moosa',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 85,
      yLabel3: 0,
    },
    {
      xLabel: 'Farsi',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 89,
    },
  ];

  dailyCountData = [
    {
      xLabel: 'Hasbhan TC',
      yLabel0: 50,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Mapco',
      yLabel0: 0,
      yLabel1: 35,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Bin Moosa',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 25,
      yLabel3: 0,
    },
    {
      xLabel: 'Farsi',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 30,
    },
  ];

  monthlyCountData = [
    {
      xLabel: 'Hasbhan TC',
      yLabel0: 150,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Mapco',
      yLabel0: 0,
      yLabel1: 120,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Bin Moosa',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 115,
      yLabel3: 0,
    },
    {
      xLabel: 'Farsi',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 180,
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadingCharts = true;

    this.data = this.weeklyAmountData;

    this.options = {
      data: this.data,
      xKey: 'xLabel',
      xLabel: 'Accounts',
      yKeys: ['yLabel0', 'yLabel1', 'yLabel2', 'yLabel3'],
      yLabels: ['Mapco', 'Hasbhan TC', 'Bin Moosa', 'Farsi'],
      chartType: 'column',
      chartShadow: false,
      categoryAxesPosition: 'bottom',
      categoryAxesTitle: 'Supplier',
      categoryAxesRotationAngle: '',
      numberAxesPosition: ['left'],
      numberAxesTitle: ['Account/Count'],
      numberAxesRotationAngle: [''],
      legendPosition: 'bottom',
      legendItemMarkerShape: 'circle',
      legendItemMarkerSize: 8,
      legendItemLabelSize: 12,
      legendItemLabeFormatterMethodname: '',
    };

    this.loadingCharts = false;
  }

  changeInvoiceType() {
    this.timePeriodChanged(this.type);
  }

  timePeriodChanged(type: string) {
    this.type = type;
    if (this.invoiceType === 'amount') {
      if (type === 'daily') {
        this.data = this.dailyAmountData;
      } else if (type === 'weekly') {
        this.data = this.weeklyAmountData;
      } else if (type === 'monthly') {
        this.data = this.monthlyAmountData;
      }
    } else if (this.invoiceType === 'count') {
      if (type === 'daily') {
        this.data = this.dailyCountData;
      } else if (type === 'weekly') {
        this.data = this.weeklyCountData;
      } else if (type === 'monthly') {
        this.data = this.monthlyCountData;
      }
    }

    this.applyData();
  }

  actionEvent(e: { type: string; event?: any }) {
    if (e.type == ACTION_TYPE.changeChartType) {
      if (this.chart) {
        this.chart.changeChartType(e.event);
      }
      return;
    }

    this.action.emit({ type: e.type, i: this.index });
  }

  applyData = () => {
    this.loadingCharts = true;
    const options = cloneDeep(this.options);

    options.data = this.data;

    this.options = options;

    setTimeout(() => {
      this.loadingCharts = false;
    }, 100);
  };
}
