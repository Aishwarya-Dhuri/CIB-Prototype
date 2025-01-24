import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Currency } from './currency.form';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  providers: [MessageService],
})
export class CurrencyComponent implements OnInit {
  @ViewChild('chart') chartElement: any;

  mode!: string;
  form = this.fb.group(Currency);

  options = {
    data: [
      {
        xLabel: 'Jan',
        yLabel0: 180,
        yLabel1: 20,
        yLabel2: 30,
      },
      {
        xLabel: 'Feb',
        yLabel0: 110,
        yLabel1: 100,
        yLabel2: 110,
      },
      {
        xLabel: 'March',
        yLabel0: 90,
        yLabel1: 90,
        yLabel2: 100,
      },
      {
        xLabel: 'April',
        yLabel0: 50,
        yLabel1: 40,
        yLabel2: 50,
      },
      {
        xLabel: 'May',
        yLabel0: 60,
        yLabel1: 10,
        yLabel2: 20,
      },
    ],
    xKey: 'xLabel',
    xLabel: 'Month',
    yKeys: ['yLabel0', 'yLabel1', 'yLabel2'],
    yLabels: ['Category 1', 'Category 2', 'Category 3'],
    chartType: 'pie',
    chartShadow: false,
    categoryAxesPosition: 'left',
    categoryAxesTitle: 'Months',
    categoryAxesRotationAngle: 0,
    numberAxesPosition: [''],
    numberAxesTitle: [''],
    numberAxesRotationAngle: [],
    legendPosition: 'bottom',
    legendItemMarkerShape: 'circle',
    legendItemMarkerSize: 8,
    legendItemLabelSize: 12,
    legendItemLabeFormatterMethodname: '',
    leftPadding: 100,
    rightPadding: 0,
    topPadding: 0,
    bottomPadding: 0,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private viewService: ViewService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'view') {
      this.form.disable();
    }

    if (this.mode == 'edit' || this.mode == 'resubmit' || this.mode == 'view') {
      let viewReq = { dataMap: { id: this.viewService.getId(), viewPreviousDetail: 'N' } };
      this.viewService.clearAll();
      /* this.masterService.view(viewReq).subscribe((response) => {
        this.form.patchValue(response);
      }); */
    }
  }

  onSubmit() {
    if (this.mode == 'edit' || this.mode == 'resubmit') {
      /* this.masterService.update(this.form.value).subscribe((response) => {
        this.messageService.add({
          severity: 'success',
          summary: '',
          detail: 'Record Created Sucessfully',
        });
        this.goToListing();
      }); */
    } else {
      /* this.masterService.create(this.form.value).subscribe((response) => {
        this.messageService.add({
          severity: 'success',
          summary: '',
          detail: 'Record Updated Sucessfully',
        });
        this.goToListing();
      }); */
    }
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url.replace('initiate', 'listing'));
  }
}
