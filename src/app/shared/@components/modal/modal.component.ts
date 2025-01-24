import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewportService } from '../../@services/viewport.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() isShow: boolean;
  @Input() headerText?: string;
  @Input() size?: string;

  @Input() hideBackdrop?: boolean;
  @Input() background?: string;
  @Input() customStyles?: any;
  @Input() showBoxShadow: boolean = false;

  @Output() isShowChange = new EventEmitter<boolean>();
  @Output() onClose = new EventEmitter<void>();
  @Output() onBackdrop = new EventEmitter<void>();

  sizeClass: string;
  viewport: string;

  constructor(private viewportService: ViewportService) {}

  ngOnInit(): void {
    this.sizeClass = this.size ? 'modal-' + this.size : 'modal-sm';

    this.customStyles = this.customStyles ? this.customStyles : {};

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
      if (viewport !== 'web') {
        this.sizeClass = 'modal-lg';
      } else {
        this.sizeClass = this.size ? 'modal-' + this.size : 'modal-sm';
      }
    });
  }

  close(): void {
    this.isShow = false;
    this.isShowChange.emit(this.isShow);
    this.onClose.emit();
  }
}
