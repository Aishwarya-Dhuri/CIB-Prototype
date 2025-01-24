import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss'],
})
export class FileDetailsComponent implements OnInit {
  @Input('data') data: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
