import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-request-org-tree',
  templateUrl: './service-request-org-tree.component.html',
  styleUrls: ['./service-request-org-tree.component.scss'],
})
export class ServiceRequestOrgTreeComponent implements OnInit {
  @Input('treeData') treeData: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
