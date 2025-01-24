import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-limit-bar',
  templateUrl: './limit-bar.component.html',
  styleUrls: ['./limit-bar.component.scss'],
})
export class LimitBarComponent implements OnInit {
  @Input('utilized') utilized: number = 0;
  @Input('available') available: number = 100;
  @Input('showLegend') showLegend: boolean = true;

  utilizedInPercent: number = 0;
  availableInPercent: number = 100;

  constructor() {}

  ngOnInit(): void {
    const totalLimit = +this.utilized + +this.available;

    this.utilizedInPercent = (+this.utilized * 100) / totalLimit;
    this.availableInPercent = 100 - this.utilizedInPercent;
  }
}
