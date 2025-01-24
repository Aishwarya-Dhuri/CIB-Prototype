import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})
export class InsightsComponent implements OnInit {
  @Input('insights') insights: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
