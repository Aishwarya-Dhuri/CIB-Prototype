import { Injectable } from '@angular/core';
import { SelfOnboarding } from '../@models/self-onboarding.model';
import { selfOnboardingExistingData } from './self-onboarding-existing.data';
import { selfOnboardingData } from './self-onboarding.data';
import { cloneDeep } from 'lodash';
@Injectable({
  providedIn: 'root',
})
export class SelfOnboardingService {
  registrationType: string = 'new';

  selfOnboarding: SelfOnboarding;

  constructor() {
    this.selfOnboarding = cloneDeep(selfOnboardingData);
  }

  setDraftData() {
    this.selfOnboarding = { ...selfOnboardingExistingData };
  }

  setExistingData() {
    this.selfOnboarding = { ...selfOnboardingExistingData };
  }

  resetSelfOnboarding() {
    this.selfOnboarding = cloneDeep(selfOnboardingData);
  }
}
