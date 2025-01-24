import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-bill-payment-data-layout',
  templateUrl: './bill-payment-data-layout.component.html',
  styleUrls: ['./bill-payment-data-layout.component.scss'],
})
export class BillPaymentDataLayoutComponent implements OnInit {
  activeStep: any;
  activeStepIndex: number = 0;

  colDefUrl = 'payments/transactions/bulkPaymentRequest/private/dataMappingDetailsColDefs';
  dataMapping = [
    {
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
          columnName: 'Beneficiary Code',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Beneficiary Name',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Beneficiary Address 1',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Beneficiary Address 2',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Beneficiary Address 3',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Email',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Phone No',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Pin/Zip Code',
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
    const url = 'payments/transactions/bulkPaymentRequest/private/dataMappingDetailsData';
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
