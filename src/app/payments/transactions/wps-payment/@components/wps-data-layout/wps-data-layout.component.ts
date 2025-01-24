import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-wps-data-layout',
  templateUrl: './wps-data-layout.component.html',
  styleUrls: ['./wps-data-layout.component.scss'],
})
export class WPSDataLayoutComponent implements OnInit {
  activeStep: any;
  activeStepIndex: number = 0;

  colDefUrl = 'payments/transactions/wpsPayment/private/dataMappingDetailsColDefs';
  dataMapping = [
    {
      header: [
        {
          columnName: 'MOL ID',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Debit From Account',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Routing Code / Agent ID',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Payable Currency and Total Salary Amount',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Salary Month',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'EDR Count',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Employee Reference',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
      ],
      detail: [
        {
          columnName: 'Record Identifier',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Employee Id',
          dataType: 'ALPHANUMERIC',
          sequenceNumber: '2',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Agent ID',
          dataType: 'ALPHANUMERIC',
          sequenceNumber: '3',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Account No / IBAN',
          dataType: 'TEXT',
          sequenceNumber: '4',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Pay Start Date',
          dataType: 'DATE',
          sequenceNumber: '5',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Pay End Date',
          dataType: 'DATE',
          sequenceNumber: '6',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Days in Period',
          dataType: 'TEXT',
          sequenceNumber: '7',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Income Fixed Component',
          dataType: 'AMOUNT',
          sequenceNumber: '8',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Income Variable Component',
          dataType: 'AMOUNT',
          sequenceNumber: '9',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Days On Leave',
          dataType: 'TEXT',
          sequenceNumber: '10',
          operations: 'Create Authorized',
        },
      ],
      footer: [
        {
          columnName: 'Record Identifier',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Employee Unique Id',
          dataType: 'ALPHANUMERIC',
          sequenceNumber: '2',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Bank Code',
          dataType: 'NUMERIC',
          sequenceNumber: '3',
          operations: 'Create Authorized',
        },
        {
          columnName: 'File Creation Date',
          dataType: 'DATE',
          sequenceNumber: '4',
          operations: 'Create Authorized',
        },
        {
          columnName: 'File Creation Time',
          dataType: 'NUMERIC',
          sequenceNumber: '5',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Salary Month',
          dataType: 'NUMERIC',
          sequenceNumber: '6',
          operations: 'Create Authorized',
        },
        {
          columnName: 'EDR Count',
          dataType: 'NUMERIC',
          sequenceNumber: '7',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Total Salary',
          dataType: 'AMOUNT',
          sequenceNumber: '8',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Payment Currency',
          dataType: 'AMOUNT',
          sequenceNumber: '9',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Corporate Reference',
          dataType: 'ALPHANUMERIC',
          sequenceNumber: '10',
          operations: 'Create Authorized',
        },
        {
          columnName: 'AUTHORIZER 1',
          dataType: 'TEXT',
          sequenceNumber: '11',
          operations: 'Create Authorized',
        },
        {
          columnName: 'AUTHORIZER 2',
          dataType: 'TEXT',
          sequenceNumber: '12',
          operations: 'Create Authorized',
        },
        {
          columnName: 'AUTHORIZER 3',
          dataType: 'TEXT',
          sequenceNumber: '13',
          operations: 'Create Authorized',
        },
        {
          columnName: 'AUTHORIZER 4',
          dataType: 'TEXT',
          sequenceNumber: '14',
          operations: 'Create Authorized',
        },
        {
          columnName: 'AUTHORIZER 5',
          dataType: 'TEXT',
          sequenceNumber: '15',
          operations: 'Create Authorized',
        },
        {
          columnName: 'AUTHORIZER 6',
          dataType: 'TEXT',
          sequenceNumber: '16',
          operations: 'Create Authorized',
        },
        {
          columnName: 'AUTHORIZER 7',
          dataType: 'TEXT',
          sequenceNumber: '17',
          operations: 'Create Authorized',
        },
        {
          columnName: 'AUTHORIZER 8',
          dataType: 'TEXT',
          sequenceNumber: '18',
          operations: 'Create Authorized',
        },
        {
          columnName: 'AUTHORIZER 9',
          dataType: 'TEXT',
          sequenceNumber: '19',
          operations: 'Create Authorized',
        },
      ],
      enrichmentFields: [
        {
          columnName: 'Record Identifier',
          dataType: 'ALPHANUMERIC',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Employee Id',
          dataType: 'ALPHANUMERIC',
          sequenceNumber: '2',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Agent Id',
          dataType: 'ALPHANUMERIC',
          sequenceNumber: '3',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Housing Allowance',
          dataType: 'AMOUNT',
          sequenceNumber: '4',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Conveyance Allowance',
          dataType: 'AMOUNT',
          sequenceNumber: '5',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Medical Allowance',
          dataType: 'AMOUNT',
          sequenceNumber: '6',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Annual Passage Allowance',
          dataType: 'AMOUNT',
          sequenceNumber: '7',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Overtime Allowance',
          dataType: 'AMOUNT',
          sequenceNumber: '8',
          operations: 'Create Authorized',
        },
        {
          columnName: 'All Other Allowances',
          dataType: 'AMOUNT',
          sequenceNumber: '9',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Leave Encashment',
          dataType: 'AMOUNT',
          sequenceNumber: '10',
          operations: 'Create Authorized',
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
    const url = 'payments/transactions/wpsPayment/private/dataMappingDetailsData';
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
