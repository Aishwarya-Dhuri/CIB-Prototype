export class Chart {
  constructor(
    public data: ChartData[] = [],
    public xKey: 'xLabel' = 'xLabel',
    public xLabel: string = '',
    public yKeys: string[] = ['yLabel0'],
    public yLabels: string[] = [''],
    public chartType:
      | 'pie'
      | 'donut'
      | 'line'
      | 'bar'
      | 'groupedBar'
      | 'column'
      | 'groupedColumn'
      | 'lineColumn'
      | 'lineGroupedColumn' = 'column',
    public leftPadding: number = 0,
    public rightPadding: number = 0,
    public topPadding: number = 0,
    public bottomPadding: number = 0,
    public chartShadow: boolean = false,
    public categoryAxesPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom',
    public categoryAxesTitle: string = '',
    public categoryAxesRotationAngle: number = 0,
    public numberAxesPosition: string[] = ['left'],
    public numberAxesTitle: string[] = [''],
    public numberAxesRotationAngle: number[] = [0],
    public showLegend: boolean = true,
    public legendPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom',
    public legendItemMarkerShape:
      | 'circle'
      | 'cross'
      | 'diamond'
      | 'plus'
      | 'square'
      | 'triangle' = 'circle',
    public legendItemMarkerSize: number = 8,
    public legendItemLabelSize: number = 12,
    public legendItemLabeFormatterMethodname: string = '',
    public parentRef: any = null,
  ) {}
}

class ChartData {
  constructor(
    public xLabel: string,
    public yLabel0: string,
    public yLabel1?: string,
    public yLabel2?: string,
    public yLabel3?: string,
    public yLabel4?: string,
    public yLabel5?: string,
    public yLabel6?: string,
    public yLabel7?: string,
    public yLabel8?: string,
    public yLabel9?: string,
  ) {}
}
