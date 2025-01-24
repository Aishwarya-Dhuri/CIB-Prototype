import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
import { ChequePrintingReconcile } from './@model/cheque-printing-reconcile.model';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { PritingReconcileNumberRendererComponent } from './@components/priting-reconcile-number-renderer/priting-reconcile-number-renderer.component';
import { PritingReconcileDropdownRendererComponent } from './@components/priting-reconcile-dropdown-renderer/priting-reconcile-dropdown-renderer.component';

@Component({
  selector: 'app-cheque-printing-reconcile',
  templateUrl: './cheque-printing-reconcile.component.html',
  styleUrls: ['./cheque-printing-reconcile.component.scss']
})
export class ChequePrintingReconcileComponent implements OnInit {
  @ViewChild('pendingPrinting') pendingPrinting: any;
  @ViewChild('reconcile') reconcile: any;
  @ViewChild('transactionDetails') transactionDetails: any;
  @ViewChild('inventoryDetails') inventoryDetails: any;
  @ViewChild('reconcileInstrument') reconcileInstrument: any;

  formData: ChequePrintingReconcile = new ChequePrintingReconcile();
  selectedPattern: any;
  listType = 'grid';
  currentScreen: string = 'FILTERS';
  printSelectedCurrentStep: string = 'INITIATE';
  reconcileSelectedCurrentStep: string = 'INITIATE';
  showUnusedInventoryDetails = false;
  viewTransactionDetails = false;

  reconcileGridOptions = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    frameworkComponents: {
      pritingReconcileDropdownRendererComponent: PritingReconcileDropdownRendererComponent,
      pritingReconcileNumberRendererComponent: PritingReconcileNumberRendererComponent,
    },
  };

  viewGridOptions = {
    pagination: false
  }

  constructor(
    private toasterService: ToasterService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit(): void {
    this.selectedPattern = this.patternList[0];

    const actions: Actions = {
      heading: 'Cheque Printing and Reconcile',
      subHeading: null,
      refresh: true,
      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Payments' },
      { label: 'Printing' },
      { label: 'Cheque Printing and Reconcile' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }

  patternList: any = [
    { id: 1, displayName: 'Pending Printing', value: 'Pending Printing', count: '2' },
    { id: 2, displayName: 'Reconcile', value: 'Reconcile', count: '3' }
  ]

  changePattern(data: any) {
    this.selectedPattern = data;
  }

  colDefUrl: ColDef[] = [
    { field: 'batchNumber' },
    { field: 'activationDate' },
    { field: 'totalInstruments' },
    { field: 'totalAmount' },
    { field: 'action', cellRenderer: 'actionCellRenderer', pinned: 'right' },
  ]

  pendingPrintingdataUrl = [
    {
      batchNumber: '1660820406277',
      activationDate: '18-Mar-2023',
      totalInstruments: '1',
      totalAmount: '1,000.00',
      action: [
        {
          "index": 1,
          "onClick": "printAll",
          "type": "BUTTON",
          "displayName": "Print All",
          "icon": "",
          "methodName": "printAll",
          "parameterList": "id"
        },
        {
          "index": 2,
          "onClick": "printSelected",
          "type": "BUTTON",
          "displayName": "Print Selected",
          "icon": "",
          "methodName": "printSelected",
          "parameterList": "id"
        }
      ]
    },
    {
      batchNumber: '1662458170657',
      activationDate: '02-Sep-2023',
      totalInstruments: '1',
      totalAmount: '1,000.00',
      action: [
        {
          "index": 3,
          "onClick": "printAll",
          "type": "BUTTON",
          "displayName": "Print All",
          "icon": "",
          "methodName": "printAll",
          "parameterList": "id"
        },
        {
          "index": 4,
          "onClick": "printSelected",
          "type": "BUTTON",
          "displayName": "Print Selected",
          "icon": "",
          "methodName": "printSelected",
          "parameterList": "id"
        }
      ]
    }
  ];

  reconcileDataUrl = [
    {
      batchNumber: '1675668828889',
      activationDate: '18-Mar-2023',
      totalInstruments: '1',
      totalAmount: '1,000.00',
      action: [
        {
          "index": 1,
          "onClick": "reconcileSelected",
          "type": "BUTTON",
          "displayName": "Reconcile Selected",
          "icon": "",
          "methodName": "reconcileSelected",
          "parameterList": "id"
        },
        {
          "index": 2,
          "onClick": "reconcileAll",
          "type": "BUTTON",
          "displayName": "Reconcile All",
          "icon": "",
          "methodName": "reconcileAll",
          "parameterList": "id"
        }
      ]
    },
    {
      batchNumber: '1675668821290',
      activationDate: '02-Sep-2023',
      totalInstruments: '1',
      totalAmount: '1,000.00',
      action: [
        {
          "index": 3,
          "onClick": "reconcileSelected",
          "type": "BUTTON",
          "displayName": "Reconcile Selected",
          "icon": "",
          "methodName": "reconcileSelected",
          "parameterList": "id"
        },
        {
          "index": 4,
          "onClick": "reconcileAll",
          "type": "BUTTON",
          "displayName": "Reconcile All",
          "icon": "",
          "methodName": "reconcileAll",
          "parameterList": "id"
        }
      ]
    },
    {
      batchNumber: '1675668821029',
      activationDate: '02-Sep-2023',
      totalInstruments: '1',
      totalAmount: '1,000.00',
      action: [
        {
          "index": 3,
          "onClick": "reconcileSelected",
          "type": "BUTTON",
          "displayName": "Reconcile Selected",
          "icon": "",
          "methodName": "reconcileSelected",
          "parameterList": "id"
        },
        {
          "index": 4,
          "onClick": "reconcileAll",
          "type": "BUTTON",
          "displayName": "Reconcile All",
          "icon": "",
          "methodName": "reconcileAll",
          "parameterList": "id"
        }
      ]
    }
  ];

  onFirstDataRendered(data) {
    console.log(data);

  }

  transactionDetailsColDefUrl: ColDef[] = [
    { headerName: 'Beneficiary Name', field: 'beneficiaryName', checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: 'Debit Account Number', field: 'debitAccountNumber' },
    { headerName: 'Payable Currency', field: 'payableCurrency' },
    { headerName: 'Payable Amount', field: 'payableAmount' },
    { headerName: 'Corporate Reference Number', field: 'corporateRefNo' },
    { headerName: 'Instrument Date', field: 'instrumentDate' },
    { headerName: 'Instrument Number', field: 'instrumentNumber' },
    { headerName: 'Actions', field: 'action', cellRenderer: 'actionCellRenderer', pinned: 'right' }
  ]
  transactionDetailsReviewColDefUrl: ColDef[] = [
    { headerName: 'Beneficiary Name', field: 'beneficiaryName' },
    { headerName: 'Debit Account Number', field: 'debitAccountNumber' },
    { headerName: 'Payable Currency', field: 'payableCurrency' },
    { headerName: 'Payable Amount', field: 'payableAmount' },
    { headerName: 'Corporate Reference Number', field: 'corporateRefNo' },
    { headerName: 'Instrument Date', field: 'instrumentDate' },
    { headerName: 'Instrument Number', field: 'instrumentNumber' },
    { headerName: 'Actions', field: 'action', cellRenderer: 'actionCellRenderer', pinned: 'right' }
  ]

  transactionDetailsdataUrl = [
    {
      beneficiaryName: '1511BEN5',
      debitAccountNumber: '555200000007',
      payableCurrency: 'INR',
      payableAmount: '1,000.00',
      corporateRefNo: 'OCK121',
      instrumentDate: '18-Aug-2023',
      instrumentNumber: '1',
      action: [
        {
          "index": 1,
          "onClick": "view",
          "type": "ICON",
          "displayName": "View",
          "icon": "fa-eye",
          "methodName": "view",
          "parameterList": ""
        }
      ]
    }
  ];

  inventoryDetailsColDefUrl: ColDef[] = [
    { headerName: 'Start Number', field: 'startNumber', checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: 'End Number', field: 'endNumber' },
    { headerName: 'Unused Inventory Count', field: 'unusedInventoryCount' },
    { headerName: 'Debit Account Number', field: 'accountNumber' },
    { headerName: 'MICR Band Printed', field: 'micrBandPrinted' },
    { headerName: 'Print Format', field: 'printFormat' },
    { headerName: 'Corporate/Group Name', field: 'corporateGroupName' },
    { headerName: 'Action', field: 'action', cellRenderer: 'actionCellRenderer', pinned: 'right' },
  ]

  inventoryDetailsReviewColDefUrl: ColDef[] = [
    { headerName: 'Start Number', field: 'startNumber' },
    { headerName: 'End Number', field: 'endNumber' },
    { headerName: 'Unused Inventory Count', field: 'unusedInventoryCount' },
    { headerName: 'Account Number', field: 'accountNumber' },
    { headerName: 'MICR Band Printed', field: 'micrBandPrinted' },
    { headerName: 'Print Format', field: 'printFormat' },
    { headerName: 'Corporate/Group Name', field: 'corporateGroupName' },
    { headerName: 'Action', field: 'action', cellRenderer: 'actionCellRenderer', pinned: 'right' },
  ]

  inventoryDetailsdataUrl = [
    {
      startNumber: '1',
      endNumber: '999',
      unusedInventoryCount: '712',
      accountNumber: '777200000012-INR',
      micrBandPrinted: 'Yes',
      printFormat: 'Three Cheques Per Page Layout',
      corporateGroupName: '100083',
      action: [
        {
          "index": 1,
          "onClick": "transactionDetailsView",
          "type": "ICON",
          "displayName": "View Inventory Details",
          "icon": "fa-inventory",
          "methodName": "transactionDetailsView",
          "parameterList": "id"
        }
      ]
    },
    {
      startNumber: '1',
      endNumber: '999',
      unusedInventoryCount: '712',
      accountNumber: '777200000014-INR',
      micrBandPrinted: 'Yes',
      printFormat: 'Three Cheques Per Page Layout',
      corporateGroupName: '100083',
      action: [
        {
          "index": 1,
          "onClick": "transactionDetailsView",
          "type": "ICON",
          "displayName": "View Inventory Details",
          "icon": "fa-inventory",
          "methodName": "transactionDetailsView",
          "parameterList": "id"
        }
      ]
    },
    {
      startNumber: '1',
      endNumber: '999',
      unusedInventoryCount: '712',
      accountNumber: '777200000139-INR',
      micrBandPrinted: 'Yes',
      printFormat: 'Three Cheques Per Page Layout',
      corporateGroupName: '100083',
      action: [
        {
          "index": 1,
          "onClick": "transactionDetailsView",
          "type": "ICON",
          "displayName": "View Inventory Details",
          "icon": "fa-inventory",
          "methodName": "transactionDetailsView",
          "parameterList": "id"
        }
      ]
    },
    {
      startNumber: '1',
      endNumber: '999',
      unusedInventoryCount: '712',
      accountNumber: '777200000300-INR',
      micrBandPrinted: 'Yes',
      printFormat: 'Three Cheques Per Page Layout',
      corporateGroupName: '100083',
      action: [
        {
          "index": 1,
          "onClick": "transactionDetailsView",
          "type": "ICON",
          "displayName": "View Inventory Details",
          "icon": "fa-inventory",
          "methodName": "transactionDetailsView",
          "parameterList": "id"
        }
      ]
    },
    {
      startNumber: '1',
      endNumber: '999',
      unusedInventoryCount: '712',
      accountNumber: '777200000110-INR',
      micrBandPrinted: 'Yes',
      printFormat: 'Three Cheques Per Page Layout',
      corporateGroupName: '100083',
      action: [
        {
          "index": 1,
          "onClick": "transactionDetailsView",
          "type": "ICON",
          "displayName": "View Inventory Details  ",
          "icon": "fa-inventory",
          "methodName": "transactionDetailsView",
          "parameterList": "id"
        }
      ]
    }
  ];













  reconcileInstrumentColDefUrl: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Old Insturment Details",
      children: [
        { headerName: 'Beneficiary Name', field: 'beneficiaryName', checkboxSelection: true },
        { headerName: 'Payable Amount', field: 'debitAccountNumber' },
        { headerName: 'Payment Method', field: 'corporateReferenceNumber' },
        { headerName: 'Instrument Date', field: 'amount' },
        { headerName: 'Instrument Number', field: 'instrumentDate' }
      ]
    },
    {
      headerName: "Current Instrument Details",
      children: [
        {
          headerName: "Instrument No", field: "instrumentNo",
          // cellRenderer: "pritingReconcileNumberRendererComponent"
        },
        {
          headerName: "Instrument Status", field: "currentInstrumentStatus",
          // cellRenderer: "pritingReconcileDropdownRendererComponent"
        }
      ]
    }
  ]

  reconcileInstrumentdataUrl = [
    {
      beneficiaryName: '1660820406277',
      debitAccountNumber: '555200000007-INR',
      corporateReferenceNumber: 'COR1',
      amount: '1,000.00',
      instrumentDate: '18-Aug-2023',
      instrumentNo: '',
      currentInstrumentStatus: '',
    }
  ];


  usedInventoryColDef: ColDef[] = [
    { headerName: 'Sr Number', field: 'srNo' },
    { headerName: 'Account Number', field: 'accountNo' },
    { headerName: 'Unused Inventory', field: 'unusedInventory' }
  ]

  usedInventorydataUrl = [
    {
      srNo: '1',
      accountNo: '151111000002',
      unusedInventory: '115'
    },
    {
      srNo: '2',
      accountNo: '151111000009',
      unusedInventory: '4'
    },
    {
      srNo: '3',
      accountNo: '151111000004',
      unusedInventory: '1'
    }
  ];





  printAll() {
    console.log("clicked printAll");
  }

  printSelected() {
    this.currentScreen = 'PRINT_SELECTED'
  }

  onPrintReview() {
    this.printSelectedCurrentStep = 'VIEW'
  }

  onReconcileReview() {
    this.reconcileSelectedCurrentStep = 'VIEW'
  }

  onPrintPrevious() {
    this.printSelectedCurrentStep = 'INITIATE'
  }

  onReconcilePrevious() {
    this.reconcileSelectedCurrentStep = 'INITIATE'
  }

  onReconcileSubmit() {
    this.toasterService.showToaster({
      severity: 'success',
      detail: 'Own Cheque Reconcile Initiated Successfully',
    });
    this.currentScreen = 'FILTERS';
  }

  onPrintSubmit() {
    this.toasterService.showToaster({
      severity: 'success',
      detail: 'Own Cheque Printing Initiated Successfully',
    });
    this.currentScreen = 'FILTERS';
  }

  reconcileSelected() {
    this.currentScreen = 'RECONCILE_SELECTED';
  };

  onBackClick() {
    if (this.printSelectedCurrentStep = 'INITIATE') {
      this.currentScreen = 'FILTERS';
    }
  };

  transactionDetailsView() {
    this.viewTransactionDetails = true
  }

  unusedInventoryColDef: ColDef[] = [
    { headerName: 'Start Number', field: 'startNo' },
    { headerName: 'End Number', field: 'endNo' },
    { headerName: 'Used', field: 'used' },
    { headerName: 'Spoil', field: 'spoil' },
    { headerName: 'Unused', field: 'unused' }
  ]

  unusedInventorydataUrl = [
    {
      startNo: '100230',
      endNo: '100940',
      used: '12',
      spoil: '1',
      unused: '698'
    }
  ];
}
