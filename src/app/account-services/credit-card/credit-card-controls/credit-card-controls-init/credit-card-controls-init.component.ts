import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { CreditCardControlsService } from '../@services/credit-card-controls.service';
import { NgForm } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-credit-card-controls-init',
  templateUrl: './credit-card-controls-init.component.html',
  styleUrls: ['./credit-card-controls-init.component.scss'],
})
export class CreditCardControlsInitComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: NgForm;

  loading: boolean = true;

  @Output() onReview = new EventEmitter<void>();

  formKeys: string[] = [];

  viewport: string;

  editMode = false;

  steps: any[] = [];

  searchBeneficiary = false;

  activeStep: any;
  activeStepIndex: number;

  letterOfCredit: any = {};

  repair = false;
  showBankRemarks = false;

  creditCardData: any;
  unSub$ = new Subject();
  constructor(
    private actionsService: ActionService,
    private cardControlsService: CreditCardControlsService,
    private viewportService: ViewportService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.cardControlsService.creditCardData$.pipe(takeUntil(this.unSub$)).subscribe((data: any) => {
      if (!data) {
        return;
      }

      this.creditCardData = data;
      this.loading = false;
    });

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
      if (viewport === 'web') {
        this.actionsService.setShowActionContainer(false);
      } else {
        this.actionsService.setShowActionContainer(true);
      }
    });

    this.steps = this.cardControlsService.steps;

    this.editMode = this.cardControlsService.editMode;

    this.activeStepIndex = this.cardControlsService.activeStepIndex;

    this.setStep();
  }

  cancel() {
    this.router.navigate(['./listing'], { relativeTo: this.route });
  }

  previous() {
    if (this.activeStepIndex > 0) {
      if (this.isFormValid()) {
        this.steps[this.activeStepIndex].completeStatus = 'success';
      } else {
        this.steps[this.activeStepIndex].completeStatus = 'error';
      }

      this.activeStepIndex--;
      this.setStep();
    }
  }

  isFormValid() {
    return this.form.valid || this.form.disabled;
  }

  next() {
    if (this.activeStepIndex < 2) {
      if (this.isFormValid()) {
        this.steps[this.activeStepIndex].completeStatus = 'success';
      } else {
        this.steps[this.activeStepIndex].completeStatus = 'error';
      }

      this.activeStepIndex++;

      this.setStep();
    }
  }

  changeStep(stepIndex: number) {
    this.showBankRemarks = false;

    if (this.isFormValid()) {
      this.steps[this.activeStepIndex].completeStatus = 'success';
    } else {
      this.steps[this.activeStepIndex].completeStatus = 'error';
    }

    this.activeStepIndex = stepIndex;

    this.setStep();
  }

  review() {
    let allStepsStatus: string[] = [];

    this.steps.forEach((step: any) => {
      allStepsStatus.push(step.completeStatus);
    });

    if (allStepsStatus.includes('error')) {
      return;
    }

    this.onReview.emit();
  }

  setStep() {
    this.activeStep = this.steps[this.activeStepIndex];

    if (this.form) {
      setTimeout(() => {
        this.formKeys = Object.keys(this.form.controls);
        this.setStepCompleted();
      });
    }
  }

  removeDecimal(event, obj: NgForm, field: string) {
    let val = obj.controls[field].value;
    val = val.replace(/\..+/gm, '.00');
    obj.controls[field].setValue(val);
  }

  setStepCompleted() {
    const formKeys = Object.keys(this.form.controls);

    let validCount = 0;

    this.formKeys.forEach((key: string) => {
      if (
        this.form.controls[key].status === 'VALID' ||
        this.form.controls[key].status === 'DISABLED'
      ) {
        validCount++;
      }
    });

    const completePercentage = (validCount * 100) / formKeys.length;

    this.steps[this.activeStepIndex].completePercentage =
      completePercentage > 100 ? 100 : Math.ceil(completePercentage);

    if (completePercentage >= 100) {
      this.steps[this.activeStepIndex].completeStatus = 'success';
    } else {
      this.steps[this.activeStepIndex].completeStatus = 'inProgress';
    }
  }

  ngOnDestroy() {
    this.cardControlsService.activeStepIndex = this.activeStepIndex;
    this.cardControlsService.creditCardData = this.creditCardData;
    this.cardControlsService.editMode = false;
    this.actionsService.setShowActionContainer(true);
    this.unSub$.next(null);
    this.unSub$.complete();
  }

  handleToggle($event, obj: NgForm, field: string) {
    obj.controls[field].reset();
  }

  handleToggleForInterUsage($event, form: NgForm) {
    form.resetForm({
      allowInternationalUsage: form.form.get('allowInternationalUsage').value,
    });
  }
}
