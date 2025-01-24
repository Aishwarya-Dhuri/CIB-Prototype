import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-data-layout',
  templateUrl: './data-layout.component.html',
  styleUrls: ['./data-layout.component.scss'],
})
export class DataLayoutComponent implements OnInit {
  activeStep: any;
  activeStepIndex: number = 0;
  colDefUrl = 'setup/security/userUpload/private/dataMappingDetailsColDefs';
  dataMapping = [
    {
      layout: [
        {
          columnName: '',
          dataType: '',
          sequenceNumber: '',
          operations: '',
        },
      ],
      header: [
        {
          columnName: '',
          dataType: '',
          sequenceNumber: '',
          operations: '',
        },
      ],
      detail: [
        {
          columnName: 'User Id',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'User Id',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'User Id',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'User Id',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'User Id',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'User Id',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'User Id',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'User Id',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
      ],
      footer: [
        {
          columnName: '',
          dataType: '',
          sequenceNumber: '',
          operations: '',
        },
      ],
      enrichmentFields: [
        {
          columnName: '',
          dataType: '',
          sequenceNumber: '',
          operations: '',
        },
      ],
      lastRow: 1,
    },
  ];

  gridOptions = {
    rowModelType: 'clientSide',
    frameworkComponents: {},
  };

  steps = [
    {
      displayLabel: 'Layout',
    },
    {
      displayLabel: 'Header',
    },
    {
      displayLabel: 'Detail',
    },
    {
      displayLabel: 'Footer',
    },
    {
      displayLabel: 'Enrichment Fields',
    },
  ];
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.setStep();
  }

  // getGridData() {
  //   const url = 'setup/security/userUpload/private/dataMappingDetailsData'
  //   this.httpService.httpPost(url).subscribe(res => {
  //     this.dataMapping = res
  //   })
  // }

  changeStep(stepIndex: number) {
    this.activeStepIndex = stepIndex;
    this.setStep();
  }
  setStep() {
    this.activeStep = this.steps[this.activeStepIndex];
  }
}
