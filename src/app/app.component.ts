import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ShepherdService } from 'angular-shepherd';
import Step from 'shepherd.js/src/types/step';
import { cloneDeep } from 'lodash';
import { URL_STEPS_MAP, defaultStepOptions, tourButtons } from './app-tour-data';
import { AppSetting, ExtraSetting, Font } from './shared/@models/app-setting';
import { AppSettingService } from './shared/@services/app-setting.service';
import { HttpService } from './shared/@services/http.service';
import { ViewportService } from './shared/@services/viewport.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  appSetting: AppSetting = new AppSetting();
  fontFileUrl: any;
  direction: string;
  viewport: string;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private viewportService: ViewportService,
    private translate: TranslateService,
    private httpService: HttpService,
    private appSettingService: AppSettingService,
    private sanitizer: DomSanitizer,
    private tourService: ShepherdService,
    private router: Router,
  ) {
    this.fontFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.httpService.getAssetUrl(`assets/fonts/aurionpro-${this.httpService.getHostName()}.css`),
    );

    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.updateAppSetting(appSetting);
    });

    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      /* Updating Direction */
      this.direction = extraSetting.direction;
      const elm = this.document.querySelector('body');
      if (elm) {
        elm.setAttribute('dir', this.direction);
      }
    });

    this.translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.startTour();
      }
    });
  }

  ngOnInit(): void {
    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });
  }

  startTour(): void {
    let tourSteps: Step.StepOptions[] | undefined = URL_STEPS_MAP[this.router.url];
    if (!tourSteps) return;
    this.tourService.defaultStepOptions = defaultStepOptions;
    this.tourService.modal = true;
    this.tourService.confirmCancel = false;
    tourSteps.forEach((step: Step.StepOptions, index) => {
      if (index == 0) step.buttons = [tourButtons.cancel, tourButtons.next];
      else if (index == tourSteps.length - 1) step.buttons = [tourButtons.cancel, tourButtons.back];
      else step.buttons = [tourButtons.cancel, tourButtons.back, tourButtons.next];
    });
    this.tourService.addSteps(tourSteps);
    this.tourService.tourObject.once('complete', function () {
     // alert('complete');
    });
    this.tourService.tourObject.once('cancel', function () {
     // alert('cancel');
    });
    setTimeout(() => {
      this.tourService.start();
    }, 1000);
  }

  isShowAccessibilityIcon(): boolean {
    return this.httpService.isServerConnected;
  }

  updateAppSetting(appSetting: AppSetting): void {
    /* Updatating Dark mode */
    if (appSetting.isDarkTheme) {
      this.document.documentElement.style.setProperty(
        '--dark-filter',
        'invert(1) hue-rotate(180deg)',
      );
    } else {
      this.document.documentElement.style.setProperty(
        '--dark-filter',
        'invert(0) hue-rotate(0deg)',
      );
    }

    /* Updating button style */
    if (
      appSetting.buttonBorderRadius &&
      this.appSetting.buttonBorderRadius != appSetting.buttonBorderRadius
    ) {
      this.document.documentElement.style.setProperty(
        '--btn-border-radius',
        appSetting.buttonBorderRadius,
      );
    }

    if (appSetting.is3dButton) {
      if (this.direction == 'ltr') {
        this.document.documentElement.style.setProperty(
          '--btn-box-shadow',
          '4px 4px 10px var(--primary-color-light)',
        );
      } else {
        this.document.documentElement.style.setProperty(
          '--btn-box-shadow',
          '-4px 4px 10px var(--primary-color-light)',
        );
      }
    } else {
      this.document.documentElement.style.setProperty('--btn-box-shadow', '0px 0px 0px');
    }

    /* Update Theme */

    if (appSetting.themeId && this.appSetting.themeId != appSetting.themeId) {
      this.updateTheme(appSetting.themeId);
    }

    /* Update Font  */
    if (appSetting.fontId && this.appSetting.fontId != appSetting.fontId) {
      this.updateFontFile(appSetting.fontId);
    }

    /* Update Font Size */
    if (appSetting.fontSize && this.appSetting.fontSize != appSetting.fontSize) {
      this.document.documentElement.style.setProperty('--font-size', appSetting.fontSize + 'px');
    }

    /* Updating Form Card style */
    if (
      appSetting.formCardBorderRadius &&
      this.appSetting.formCardBorderRadius != appSetting.formCardBorderRadius
    ) {
      this.document.documentElement.style.setProperty(
        '--aps-card-border-radius',
        appSetting.formCardBorderRadius,
      );
    }

    this.appSetting = cloneDeep(appSetting);
  }

  updateTheme(themeId: any): void {
    const data = { dataMap: { id: themeId } };
    this.httpService
      .httpPost('setup/cibSetup/uiConfiguration/themeConfiguration/private/view', data)
      .subscribe((response: any) => {
        if (!response.themeVariables) return;
        response.themeVariables.forEach((data: any) => {
          this.document.documentElement.style.setProperty(`--${data.variableName}`, data.value);
        });
      });
  }

  updateFontFile(fontId: any): void {
    const data = { dataMap: { id: fontId } };
    this.httpService
      .httpPost('setup/cibSetup/uiConfiguration/fontConfiguration/private/view', data)
      .subscribe((fontDate: Font) => {
        this.fontFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.httpService.getAssetUrl(
            'assets/fonts/' +
              fontDate.fontFileName.toString().slice(0, fontDate.fontFileName.length - 4) +
              '-' +
              this.httpService.getHostName() +
              '.css',
          ),
        );
      });
  }

  ngOnDestroy() {
    this.document.removeAllListeners();
  }
}
