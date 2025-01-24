import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DemoVideoComponent } from './demo-video/demo-video.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, DemoVideoComponent],
  imports: [CommonModule, SharedModule],
  exports: [HeaderComponent, FooterComponent, DemoVideoComponent],
})
export class BaseSharedModule {}
