import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-debit-org-tree',
  templateUrl: './debit-org-tree.component.html',
  styleUrls: ['./debit-org-tree.component.scss'],
})
export class DebitOrgTreeComponent implements OnInit {
  @Input('treeData') treeData: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
