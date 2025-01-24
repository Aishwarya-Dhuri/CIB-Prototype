import { Validators } from '@angular/forms';
import { Master } from 'src/app/base/forms/master.form';

export const Industry: { [key: string]: any } = {
  ...Master,
  industryCode: ['', Validators.required],
  industryDescription: ['', Validators.required],
  effectiveFrom: ['', Validators.required],
  effectiveTill: [''],
};
