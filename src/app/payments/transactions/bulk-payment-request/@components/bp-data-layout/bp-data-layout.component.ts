import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-bp-data-layout',
  templateUrl: './bp-data-layout.component.html',
  styleUrls: ['./bp-data-layout.component.scss'],
})
export class BPDataLayoutComponent implements OnInit {
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
          columnName: 'Payment Method Name',
          dataType: 'Text',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Debit Account No.',
          dataType: 'Numeric',
          sequenceNumber: '2',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Beneficiary Name',
          dataType: 'Text',
          sequenceNumber: '3',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Charge Bourned By',
          dataType: 'Text',
          sequenceNumber: '4',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Payable Currency',
          dataType: 'Text',
          sequenceNumber: '5',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Payment Amount',
          dataType: 'Numeric',
          sequenceNumber: '5',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Beneficiary Account No.',
          dataType: 'Alphanumeric',
          sequenceNumber: '6',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Beneficiary Address',
          dataType: 'Text',
          sequenceNumber: '7',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Pin/Zip Code',
          dataType: 'Text',
          sequenceNumber: '8',
          operations: 'Create Authorized',
        },
		{
          columnName: 'Mobile no.',
          dataType: 'Numeric',
          sequenceNumber: '9',
          operations: 'Create Authorized',
        },
		{
          columnName: 'IFSC',
          dataType: 'Numeric',
          sequenceNumber: '10',
          operations: 'Create Authorized',
        },
		{
          columnName: 'Execution Date',
          dataType: 'Date',
          sequenceNumber: '11',
          operations: 'Create Authorized',
        },
		{
          columnName: 'Payment Instruction',
          dataType: 'Text',
          sequenceNumber: '12',
          operations: 'Create Authorized',
        },
		{
          columnName: 'Payment Purpose',
          dataType: 'Text',
          sequenceNumber: '13',
          operations: 'Create Authorized',
        },
		{
          columnName: 'Supporting Doc Name',
          dataType: 'Text',
          sequenceNumber: '14',
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
