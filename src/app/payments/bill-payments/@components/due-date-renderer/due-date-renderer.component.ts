import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-due-date-renderer',
  templateUrl: './due-date-renderer.component.html',
  styleUrls: ['./due-date-renderer.component.scss'],
})
export class DueDateRendererComponent implements OnInit, AgRendererComponent {
  cellValue!: any;
  date = new Date();
  label: string;

  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: any;

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.cellValue = this.data[this.field];

      this.setLabel();
    }
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.value;

    this.setLabel();
  }

  private setLabel() {
    if (this.cellValue) {
      if (this.date > new Date(this.cellValue)) {
        this.label = 'Overdue';
      } else {
        this.label = 'Normal';
      }
    }
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
