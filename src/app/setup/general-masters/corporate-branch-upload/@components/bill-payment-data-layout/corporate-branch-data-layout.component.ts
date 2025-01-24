import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-corporate-branch-data-layout',
  templateUrl: './corporate-branch-data-layout.component.html',
  styleUrls: ['./corporate-branch-data-layout.component.scss'],
})
export class CorporateBranchDataLayoutComponent implements OnInit {
  activeStep: any;
  activeStepIndex: number = 0;

  colDefUrl = 'setup/generalMasters/corporateBranchUpload/private/dataMappingDetailsColDefs';
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
          columnName: 'Corporate Name',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Corporate Branch Code',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Corporate Branch Name',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Corporate Branch Address 1',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Corporate Branch Address 2',
          dataType: 'TEXT',
          sequenceNumber: '1',
          operations: 'Create Authorized',
        },
        {
          columnName: 'Corporate Branch Address 3',
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
    const url = 'setup/generalMasters/corporateBranchUpload/private/dataMappingDetailsData';
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
