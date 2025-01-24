import { Component, OnInit } from '@angular/core';
import { AppSetting } from 'src/app/shared/@models/app-setting';
import { Language } from 'src/app/shared/@models/language';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { LanguageService } from 'src/app/shared/@services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  language: Language;
  languages: Language[];

  headerAssetsUrl: string = '';
  bankLogoUrl: string = '';
  productLogoUrl: string = '';

  constructor(
    private languageService: LanguageService,
    private httpService: HttpService,
    private appSettingService: AppSettingService,
  ) {
    this.headerAssetsUrl = this.httpService.getAssetUrl('assets/header-images/');
    this.productLogoUrl = this.headerAssetsUrl + 'product-logo.png';
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      if (
        appSetting.bankLogoFileName &&
        this.bankLogoUrl != this.headerAssetsUrl + appSetting.bankLogoFileName
      ) {
        this.bankLogoUrl = this.headerAssetsUrl + appSetting.bankLogoFileName;
      }
    });
  }

  ngOnInit(): void {
    this.languageService.getLanguage().subscribe((language: Language) => {
      this.language = language;
    });

    this.languageService.getLocalLanguages().subscribe((languages: Language[]) => {
      if (languages.length === 0) {
        this.languageService.getLanguages();
        return;
      }

      this.languages = languages;
      if (!this.language) {
        this.languageService.setLanguage(languages[0]);
      }
    });
  }

  changeLanguage(event: any) {
    const index = this.languages.findIndex(
      (language: Language) => language.id === event.target.value,
    );
    const language = this.languages[index];
    this.languageService.setLanguage(language);
  }
}
