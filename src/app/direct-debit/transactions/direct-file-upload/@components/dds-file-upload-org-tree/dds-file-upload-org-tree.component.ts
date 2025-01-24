import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dds-file-upload-org-tree',
  templateUrl: './dds-file-upload-org-tree.component.html',
  styleUrls: ['./dds-file-upload-org-tree.component.scss'],
})
export class DdsFileUploadOrgTreeComponent implements OnInit {
  @Input('treeData') treeData: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
