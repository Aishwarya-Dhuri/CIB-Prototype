import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-data-layout',
  templateUrl: './data-layout.component.html',
  styleUrls: ['./data-layout.component.scss'],
})
export class DataLayoutComponent implements OnInit {
  activeStep: any;
  activeStepIndex: number = 0;
  colDefUrl = 'fscm/transactions/invoiceUpload/dataMappingDetailsColDefs';
  dataMapping = [
    {
      Layout: [
        {
          columnName: '',
          dataType: '',
          sequenceNumber: '',
          operations: '',
        },
      ],
      Header: [
        {
          columnName: '',
          dataType: '',
          sequenceNumber: '',
          operations: '',
        },
      ],
      Detail: [
        {
          columnName: 'Invoice Number',
          dataType: 'Alphanumeric',
          sequenceNumber: '1',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Buyer Code',
          dataType: 'Alphanumeric',
          sequenceNumber: '2',
          operations: 'Update Authorized',
        },

        {
          columnName: 'Invoice Date',
          dataType: 'Date',
          sequenceNumber: '3',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Product Category',
          dataType: 'Alphanumeric',
          sequenceNumber: '4',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Invoice Due Date',
          dataType: 'Alphanumeric',
          sequenceNumber: '5',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Currency',
          dataType: 'Alphanumeric',
          sequenceNumber: '6',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Invoice Amount',
          dataType: 'Numeric',
          sequenceNumber: '7',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Delivery Challan no.',
          dataType: 'Alphanumeric',
          sequenceNumber: '8',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Delivery Date',
          dataType: 'Alphanumeric',
          sequenceNumber: '9',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Additional Details 6',
          dataType: 'Alphanumeric',
          sequenceNumber: '10',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Additional Details 7',
          dataType: 'Alphanumeric',
          sequenceNumber: '11',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Additional Details 8',
          dataType: 'Alphanumeric',
          sequenceNumber: '12',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Additional Details 9',
          dataType: 'Alphanumeric',
          sequenceNumber: '13',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Additional Details 10',
          dataType: 'Alphanumeric',
          sequenceNumber: '14',
          operations: 'Update Authorized',
        },
        {
          columnName: 'Additional Details 11',
          dataType: 'Alphanumeric',
          sequenceNumber: '15',
          operations: 'Update Authorized',
        },
      ],
      Footer: [
        {
          columnName: '',
          dataType: '',
          sequenceNumber: '',
          operations: '',
        },
      ],
      EnrichmentFields: [
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

  getGridData() {
    const url = 'fscm/transactions/invoiceUpload/dataMappingDetailsData';
    this.httpService.httpPost(url).subscribe((res) => {
      this.dataMapping = res;
    });
  }

  changeStep(stepIndex: number) {
    this.activeStepIndex = stepIndex;
    this.setStep();
  }
  setStep() {
    this.activeStep = this.steps[this.activeStepIndex];
  }
}
