import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';
import { AccountInstructions } from '../../../@models/accountInstructions.model';
import { ChildAccountDetails } from '../../../@models/childAccountDetails.model';

@Component({
  selector: 'app-add-child-account',
  templateUrl: './add-child-account.component.html',
  styleUrls: ['./add-child-account.component.scss'],
})
export class AddChildAccountComponent implements OnInit {
  @ViewChild('instructions') instructionsGrid: any;

  @Input('parentRef') parentRef: any;

  steps = [
    { step: 1, label: 'Structure Details' },
    { step: 2, label: 'Interest Set up' },
    { step: 3, label: 'Cluster Details' },
    { step: 4, label: 'Exception Handling' },
    { step: 5, label: 'Instructions' },
  ];

  addInstructions = false;

  instructions: AccountInstructions = new AccountInstructions();

  activeStep: any;

  colDefs: any[] = [
    {
      headerName: 'Account Number',
      field: 'accountNo',
    },
    {
      headerName: 'Movement Type',
      field: 'movementType',
    },
    {
      headerName: 'Movement in',
      field: 'movementIn',
    },
    {
      headerName: 'Value',
      field: 'value',
    },
    {
      headerName: 'Priority',
      field: 'priority',
    },
    {
      headerName: 'Narration',
      field: 'narration',
    },
    {
      headerName: 'Remarks',
      field: 'remarks',
    },
  ];

  rowData: any[] = [
    {
      accountNo: '001186941212-MYR',
      movementType: 'RBPINT-RB',
      movementIn: 'RBPINT-RB',
      value: '12',
      priority: '2',
      narration: 'RBPINT-RB',
      remarks: 'RBPINT-RB',
    },
    {
      accountNo: '001186941212-MYR',
      movementType: 'RBPINT-RB',
      movementIn: 'RBPINT-RB',
      value: '11',
      priority: '3',
      narration: 'RBPINT-RB',
      remarks: 'RBPINT-RB',
    },
    {
      accountNo: '001186941212-MYR',
      movementType: 'RBPINT-RB',
      movementIn: 'RBPINT-RB',
      value: '12',
      priority: '2',
      narration: 'RBPINT-RB',
      remarks: 'RBPINT-RB',
    },
  ];

  gridOptions: any;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.activeStep = this.steps[0];
    this.gridOptions = {
      columnDefs: this.colDefs,
      rowData: this.rowData,
      rowModelType: 'clientSide',
    };
  }

  previousStep() {
    if (this.activeStep.step == 1) {
      return;
    }

    this.activeStep = this.steps[this.activeStep.step - 2];
  }

  nextStep() {
    if (this.activeStep.step === 5) {
      this.parentRef.addChildAccount();
      return;
    }

    if (this.activeStep.step !== this.steps.length) {
      this.activeStep = this.steps[this.activeStep.step];
    }
  }

  onAddInstruction() {
    this.rowData.push(this.instructions);

    this.instructions = new AccountInstructions();

    this.instructionsGrid.setRowData(this.rowData);

    this.addInstructions = false;
  }
}
