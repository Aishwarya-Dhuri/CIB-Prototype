import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-review-account-structure',
  templateUrl: './review-account-structure.component.html',
  styleUrls: ['./review-account-structure.component.scss'],
})
export class ReviewAccountStructureComponent implements OnInit {
  @ViewChild('structureHierarchy') structureHierarchyGrid: any;

  @Input('parentRef') parentRef: any;

  colDefs: any[] = [
    {
      headerName: 'Account Number',
      field: 'accountNo',
      hide: true,
    },
    {
      headerName: 'Bank',
      field: 'bank',
    },
    {
      headerName: 'Country',
      field: 'country',
    },
    {
      headerName: 'Currency',
      field: 'currency',
    },
    {
      headerName: 'Type',
      field: 'accType',
    },
    {
      headerName: 'Type',
      field: 'type',
    },
  ];
  treeNode: any;

  treeType: string = 'tree';

  gridOptions: any;

  constructor() {}

  ngOnInit(): void {
    this.gridOptions = {
      rowModelType: 'clientSide',
      treeData: true,
      animateRows: true,
      pagination: false,
      groupDefaultExpanded: -1,
      defaultColDef: {
        flex: 1,
        resizable: true,
      },
      autoGroupColumnDef: {
        headerName: 'Account Number',
        minWidth: 400,
        cellRendererParams: {
          suppressCount: true,
        },
      },
      getDataPath: (data: any) => {
        return data.accountNo;
      },
      isGroupOpenByDefault: (params: any) => {
        return true;
      },
    };
  }

  selectedTreeNode(node: any) {
    this.treeNode = node;
  }
}
