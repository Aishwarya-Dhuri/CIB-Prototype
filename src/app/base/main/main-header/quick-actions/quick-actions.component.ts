import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss'],
})
export class QuickActionsComponent implements OnInit {
  @Input('quickActions') quickActions: { displayName: string; link: string }[];

  constructor() {}

  ngOnInit(): void {}
}
