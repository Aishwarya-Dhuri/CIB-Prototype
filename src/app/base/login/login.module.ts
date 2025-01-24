import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginIdComponent } from './login-panel/login-id/login-id.component';
import { BiomatricComponent } from './login-panel/biomatric/biomatric.component';
import { MPINComponent } from './login-panel/mpin/mpin.component';
import { QRCodeComponent } from './login-panel/qrcode/qrcode.component';
import { CaptchaComponent } from './login-panel/login-id/captcha/captcha.component';
import { AccessImageComponent } from './login-panel/login-id/access-image/access-image.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { LoginPanelComponent } from './login-panel/login-panel.component';
import { AuthenticationComponent } from './login-panel/login-id/authentication/authentication.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedModule } from 'src/app/shared/shared.module';
import { BaseSharedModule } from '../base-shared/base-shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    LoginIdComponent,
    BiomatricComponent,
    MPINComponent,
    QRCodeComponent,
    CaptchaComponent,
    AccessImageComponent,
    InfoPanelComponent,
    LoginPanelComponent,
    AuthenticationComponent,
    ForgetPasswordComponent,
  ],
  imports: [CommonModule, BaseSharedModule, SharedModule, QRCodeModule, LoginRoutingModule],
})
export class LoginModule {}
