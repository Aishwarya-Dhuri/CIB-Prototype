import { ElementRef, Injectable } from '@angular/core';
import { AppSetting, ExtraSetting } from '../@models/app-setting';
import { AppSettingService } from './app-setting.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  direction: string;

  menuType: string;

  constructor(private appSettingService: AppSettingService) {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.menuType = appSetting.menuType;
    });
    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      this.direction = extraSetting.direction;
    });
  }

  scrollLeft(element: ElementRef<any>, scrollThreshold: number) {
    if (this.direction === 'rtl') {
      scrollThreshold = scrollThreshold * -1;
    }
    element.nativeElement.scrollTo({
      left: element.nativeElement.scrollLeft + scrollThreshold,
      behavior: 'smooth',
    });
  }

  scrollRight(element: ElementRef<any>, scrollThreshold: number) {
    if (this.direction === 'rtl') {
      scrollThreshold = scrollThreshold * -1;
    }
    element.nativeElement.scrollTo({
      left: element.nativeElement.scrollLeft - scrollThreshold,
      behavior: 'smooth',
    });
  }

  getNoOfItemsVisibleOnScreen(itemWidth: number, maxItems: number): number {
    let unusableSpace: number = 0;

    if (this.menuType == 'overlay' || this.menuType == 'mobile' || this.menuType == 'horizontal') {
      unusableSpace = 24;
    } else if (this.menuType == 'static') {
      unusableSpace = 310;
    } else {
      unusableSpace = 106;
    }

    const totalItems: number = Math.floor((window.innerWidth - unusableSpace) / itemWidth);

    return totalItems <= maxItems ? totalItems : maxItems;
  }
}
