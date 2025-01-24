import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { WidgetService } from 'src/app/base/main/@services/widget.service';
import { ACTION_TYPE } from '../../@enums/action-type.enum';

@Component({
  selector: 'app-widgets-header',
  templateUrl: './widgets-header.component.html',
  styleUrls: ['./widgets-header.component.scss'],
})
export class WidgetsHeaderComponent implements OnInit {
  isFullScreen: boolean;
  isModal: boolean;
  selectedOption: string;

  isMoreOptions: boolean = false;
  isChartOptions: boolean = false;

  actionType = ACTION_TYPE;

  @Input('heading') heading: string;
  @Input('showChangeChartOption') showChangeChartOption: boolean = false;

  @Output() action = new EventEmitter<{ type: string; event?: any }>();
  @Output() changeOption = new EventEmitter<string>();

  constructor(private widgetService: WidgetService) {}

  ngOnInit(): void {
    this.selectedOption = '';
    this.widgetService.getIsFullScreen().subscribe((fullScreen: boolean) => {
      this.isFullScreen = fullScreen;
    });

    this.widgetService.getIsModal().subscribe((isModal: boolean) => {
      this.isModal = isModal;
    });
  }

  actionEvent(type: string, e?: any) {
    if (type === ACTION_TYPE.openMenu) {
      this.isMoreOptions = true;
      return;
    }

    if (type === ACTION_TYPE.changeTitle && this.isModal) {
      return;
    }

    if (type === ACTION_TYPE.fullScreen) {
      this.widgetService.setIsFullScreen(true);
    } else if (type === this.actionType.closeFullScreen) {
      this.widgetService.setIsFullScreen(false);
    }

    this.action.emit({ type, event: e ? e : null });
  }

  changeChartType() {
    if (this.selectedOption) {
      this.changeOption.emit(this.selectedOption);
    }
  }
}
