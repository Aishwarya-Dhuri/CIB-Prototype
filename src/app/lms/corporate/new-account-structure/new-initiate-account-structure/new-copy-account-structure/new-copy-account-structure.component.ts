import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-copy-account-structure',
  templateUrl: './new-copy-account-structure.component.html',
  styleUrls: ['./new-copy-account-structure.component.scss']
})
export class NewCopyAccountStructureComponent implements OnInit {
  @Input('parentRef') parentRef: any;

  selectedStrictureId: string = '';

  colDefUrl: string = 'lms/corporate/newAccountStructure/private/copyStructureColDef';
  rowDefUrl: string = 'lms/corporate/newAccountStructure/private/getAllList';

  gridOptions: any = {
    rowSelection: 'single',
  };

  constructor() { }

  ngOnInit(): void { }

  gridRowSelected(rowData: any) {
    if (rowData.node.selected) {
      this.selectedStrictureId = rowData.data.id;
    }
  }

}
