import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-maker-checker-details',
  templateUrl: './maker-checker-details.component.html',
  styleUrls: ['./maker-checker-details.component.scss'],
})
export class MakerCheckerDetailsComponent implements OnInit {
  @Input('header') header: string;
  @Input('data') data: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
