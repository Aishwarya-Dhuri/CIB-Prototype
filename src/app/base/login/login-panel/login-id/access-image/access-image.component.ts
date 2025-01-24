import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-access-image',
  templateUrl: './access-image.component.html',
  styleUrls: ['./access-image.component.scss'],
})
export class AccessImageComponent implements OnInit {
  @Input() image: string;
  @Input() message: string = 'Welcome Message for CIB';
  @Output() check = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  checked() {
    setTimeout(() => {
      this.check.emit();
    }, 100);
  }
}
