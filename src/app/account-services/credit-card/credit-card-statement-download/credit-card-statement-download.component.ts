import { Component, OnInit, ViewChild } from '@angular/core';
import { CreditCardService } from '../@services/credit-card.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../shared/@services/user.service';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpService } from 'src/app/shared/@services/http.service';
import { Actions } from 'src/app/base/@models/actions';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-credit-card-statement-download',
  templateUrl: './credit-card-statement-download.component.html',
  styleUrls: ['./credit-card-statement-download.component.scss'],
})
export class CreditCardStatementDownloadComponent implements OnInit {
  formData: any = { id: '', statementPeriod: '' };
  creditCardDataList: any;
  selectedCardId: string;
  @ViewChild('statementDownloadForm') statementDownloadForm: NgForm;
  minDate: any;
  maxDate: any;

  constructor(
    private creditCardService: CreditCardService,
    private httpService: HttpService,
    private userService: UserService,
    private actionsService: ActionService,
    private viewService: ViewService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
  ) {
    this.setSelectedCard();
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Credit Card Statement Download',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
      favourite: true,
      help: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Services' },
      { label: 'Credit Card' },
      { label: 'Credit Card Statement Download' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    let prevMonth = month === 0 ? 11 : month - 5;
    let prevYear = prevMonth === 11 || month - 5 < 0 ? year - 1 : year;

    this.minDate = new Date();
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);

    this.maxDate = new Date();

    this.creditCardService
      .getCreditCardList()
      .pipe(map((response: any): any[] => response.data))
      .subscribe((cards: any[]) => {
        this.creditCardDataList = cards.filter((a) => {
          a.displayName = a.cardNo;
          return a;
        });
        if (this.selectedCardId) {
          this.formData = this.creditCardDataList.find(
            (card: any) => card.id === this.selectedCardId,
          );
        }
      });

    if (this.viewService.getMode() == 'PREFILLED') {
      const data = this.viewService.getExtraData();

      this.formData.id = data.id;

      this.viewService.clearAll();
    }
  }

  onCreditCardSelection(data: any) {
    this.formData = data;
    this.statementDownloadForm.controls.statementPeriod.reset();
  }

  setSelectedCard() {
    try {
      this.selectedCardId = this.creditCardService.selectedCardDetails.id;
    } catch (e) {
      console.error('credit Card Id not found');
    }
  }

  onCancelClick(): void {
    this.router.navigateByUrl(this.userService.dashboardRouteUrl);
  }

  downloadStatement() {
    const fileURL = '/CreditCardStatement.pdf';
    this.httpService.httpDownload(environment.serverUrl + fileURL);
  }
}
