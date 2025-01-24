import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelfOnboardingRoutingModule } from './self-onboarding-routing.module';
import { SelfOnboardingComponent } from './self-onboarding.component';
import { SelfOnboardingHomeComponent } from './self-onboarding-home/self-onboarding-home.component';
import { BaseSharedModule } from '../base/base-shared/base-shared.module';
import { DraftApplicationComponent } from './self-onboarding-home/draft-application/draft-application.component';
import { NewApplicationComponent } from './self-onboarding-home/new-application/new-application.component';
import { TrackApplicationComponent } from './self-onboarding-home/track-application/track-application.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SaveSelfOnboardingComponent } from './save-self-onboarding/save-self-onboarding.component';
import { CompanyInformationComponent } from './save-self-onboarding/company-information/company-information.component';
import { UserDetailsComponent } from './save-self-onboarding/user-details/user-details.component';
import { ProductDetailsComponent } from './save-self-onboarding/product-details/product-details.component';
import { DocumentUploadComponent } from './save-self-onboarding/document-upload/document-upload.component';
import { SoDemoVideoComponent } from './save-self-onboarding/so-demo-video/so-demo-video.component';
import { ReviewNSubmitComponent } from './save-self-onboarding/review-n-submit/review-n-submit.component';
import { SuccessfulRegistrationComponent } from './save-self-onboarding/successful-registration/successful-registration.component';

@NgModule({
  declarations: [
    SelfOnboardingComponent,
    SelfOnboardingHomeComponent,
    DraftApplicationComponent,
    NewApplicationComponent,
    TrackApplicationComponent,
    SaveSelfOnboardingComponent,
    CompanyInformationComponent,
    UserDetailsComponent,
    ProductDetailsComponent,
    DocumentUploadComponent,
    SoDemoVideoComponent,
    ReviewNSubmitComponent,
    SuccessfulRegistrationComponent,
  ],
  imports: [CommonModule, BaseSharedModule, SharedModule, SelfOnboardingRoutingModule],
})
export class SelfOnboardingModule {}
