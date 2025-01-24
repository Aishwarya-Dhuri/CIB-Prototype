import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './shared/@interceptors/interceptor.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Router, RouterModule } from '@angular/router';
import { AccessibilityModule } from './accessibility/accessibility.module';
import { SharedModule } from './shared/shared.module';
import { CurrencyPipe } from '@angular/common';
import { ServerErrorComponent } from './server-error/server-error.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './../assets/i18n/locale_', '.json');
}

@NgModule({
  declarations: [AppComponent, ServerErrorComponent],
  imports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    AccessibilityModule,
    SharedModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      //useClass: AuthInterceptorService,
      useFactory: function (router: Router) {
        return new AuthInterceptorService(router);
      },
      multi: true,
      deps: [Router],
    },
    CurrencyPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
