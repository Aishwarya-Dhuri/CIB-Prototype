import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';
import { NewAccountInstructions } from '../../../@models/newaccountInstructions.model';
import { ActionCellRendererComponent } from '../../../@components/action-cell-renderer/action-cell-renderer.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-add-child-account',
  templateUrl: './new-add-child-account.component.html',
  styleUrls: ['./new-add-child-account.component.scss']
})
export class NewAddChildAccountComponent implements OnInit {
  @ViewChild('instructions') instructionsGrid: any;

  @Input('parentRef') parentRef: any;
  showMinError = '';
  showMaxError = '';
  isEditMode: boolean = false;
  editIndex: number | null = null;

  steps = [
    { step: 1, label: 'Structure Details' },
    { step: 2, label: 'Interest Set up' },
    { step: 3, label: 'Exception Handling' },
    { step: 4, label: 'Instructions' },
  ];
  // { step: 3, label: 'Cluster Details' },

  addInstructions = false;
  viewInstructions = false;
  viewedRowData: any = null;

  instructions: NewAccountInstructions = new NewAccountInstructions();

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
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: "actionCellRenderer",
      pinned: "right"
    }
  ];

  rowData: any[] = [
    // {
    //   accountNo: '001186941212-MYR',
    //   movementType: 'RBPINT-RB',
    //   movementIn: 'RBPINT-RB',
    //   value: '12',
    //   priority: '2',
    //   narration: 'RBPINT-RB',
    //   remarks: 'RBPINT-RB',
    //   actions: [
    //     {
    //       "index": 1,
    //       "onClick": "view",
    //       "type": "ICON",
    //       "displayName": "View",
    //       "icon": "fa-eye",
    //       "methodName": "view",
    //       "parameterList": "id"
    //     }
    //   ]
    // },
    // {
    //   accountNo: '001186941212-MYR',
    //   movementType: 'RBPINT-RB',
    //   movementIn: 'RBPINT-RB',
    //   value: '11',
    //   priority: '3',
    //   narration: 'RBPINT-RB',
    //   remarks: 'RBPINT-RB',
    //   actions: [
    //     {
    //       "index": 1,
    //       "onClick": "view",
    //       "type": "ICON",
    //       "displayName": "View",
    //       "icon": "fa-eye",
    //       "methodName": "view",
    //       "parameterList": "id"
    //     }
    //   ]
    // },
    // {
    //   accountNo: '001186941212-MYR',
    //   movementType: 'RBPINT-RB',
    //   movementIn: 'RBPINT-RB',
    //   value: '12',
    //   priority: '2',
    //   narration: 'RBPINT-RB',
    //   remarks: 'RBPINT-RB',
    //   actions: [
    //     {
    //       "index": 1,
    //       "onClick": "view",
    //       "type": "ICON",
    //       "displayName": "View",
    //       "icon": "fa-eye",
    //       "methodName": "view",
    //       "parameterList": "id"
    //     }
    //   ]
    // },
  ];

  gridOptions: any;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.activeStep = this.steps[0];
    this.gridOptions = {
      columnDefs: this.colDefs,
      rowData: this.rowData,
      rowModelType: 'clientSide',
      context: { componentParent: this },
      frameworkComponents: {
        actionCellRenderer: ActionCellRendererComponent
      }
    };
    this.isApplyToSubAcc()
  }

  isApplyToSubAcc() {
    if (this.parentRef.mainAccountDetails.applyToSubAccount == 'Yes') {
      this.parentRef.childAccountDetails.positiveRate = this.parentRef.mainAccountDetails.positiveRate;
      this.parentRef.childAccountDetails.overdraftRate = this.parentRef.mainAccountDetails.overdraftRate;
      this.parentRef.childAccountDetails.applyToSubAccount = this.parentRef.mainAccountDetails.applyToSubAccount;
    }
    else {
      this.parentRef.childAccountDetails.positiveRate = ''
      this.parentRef.childAccountDetails.overdraftRate = ''
      this.parentRef.childAccountDetails.applyToSubAccount = ''
    }
  }

  previousStep() {
    if (this.activeStep.step == 1) {
      return;
    }

    this.activeStep = this.steps[this.activeStep.step - 2];
  }

  nextStep() {
    if (this.activeStep.step === 4) {
      this.parentRef.addChildAccount();
      return;
    }

    if (this.activeStep.step !== this.steps.length) {
      this.activeStep = this.steps[this.activeStep.step];
    }
  }

  onAddInstruction() {
    if (this.isEditMode && this.editIndex !== null) {
      this.rowData[this.editIndex] = { ...this.instructions };
      this.isEditMode = false;
      this.editIndex = null;
    }
    else {
      this.rowData.push(this.instructions);
    }
    this.instructionsGrid.setRowData(this.rowData);
    this.instructions = new NewAccountInstructions();
    this.addInstructions = false;
  };


  onChangeAccountType(accountType: any) {
    if (accountType === 'ZBA') {
      this.parentRef.childAccountDetails.minBal = '0';
      this.parentRef.childAccountDetails.maxBal = '0';
    } else if (accountType === 'TBA') {
      this.onMinBalChange(); // Ensure maxBal updates when minBal changes
    } else if (accountType === 'RBA') {
      this.onMaxBalChange(); // Ensure minBal updates when maxBal changes
    }
  };

  onMinBalChange() {
    if (this.parentRef.childAccountDetails.accountType === 'TBA') {
      this.parentRef.childAccountDetails.maxBal = this.parentRef.childAccountDetails.minBal;
    } else if (this.parentRef.childAccountDetails.accountType === 'RBA') {
      if (parseFloat(this.parentRef.childAccountDetails.maxBal) < parseFloat(this.parentRef.childAccountDetails.minBal)) {
        this.showMinError = "Min Balance should be less than Max Balance"
      }
      else {
        this.showMinError = ""
      }
    }
  };

  onMaxBalChange() {
    if (this.parentRef.childAccountDetails.accountType === 'RBA') {
      if (parseFloat(this.parentRef.childAccountDetails.minBal) > parseFloat(this.parentRef.childAccountDetails.maxBal)) {
        this.showMaxError = "Max Balance should be greater than Min Balance"
      }
      else {
        this.showMaxError = ""
      }
    }
  };


  //Dropdown Values

  movementTypeData = [
    { id: 'Upstream', value: 'Upstream', displayName: 'Upstream' },
    { id: 'Downstream', value: 'Downstream', displayName: 'Downstream' }
  ];

  movementInData = [
    { id: 'Percentage', value: 'Percentage', displayName: 'Percentage' },
    { id: 'Fixed Amount', value: 'Fixed Amount', displayName: 'Fixed Amount' },
    { id: 'Multiple Of', value: 'Multiple Of', displayName: 'Multiple Of' }
  ];

  view(rowData) {
    const index = this.rowData.indexOf(rowData);
    console.log("View is called", index);
    console.log("View rowData", rowData);
    this.viewedRowData = rowData
    this.viewInstructions = true;
  };

  edit(rowData) {
    this.addInstructions = true;
    this.isEditMode = true;
    this.editIndex = this.rowData.indexOf(rowData);
    this.instructions = { ...rowData };
    console.log("edit is called", this.editIndex);
    console.log("edit rowData", rowData);
  }

  delete(rowData: any) {
    const index = this.rowData.indexOf(rowData);
    if (index > -1) {
      this.rowData.splice(index, 1);
    }
    // Refresh the grid data after deletion
    this.instructionsGrid.setRowData(this.rowData);
    console.log('Deleted row:', rowData);
  }

}
