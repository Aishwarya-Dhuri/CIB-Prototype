import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { IvrTpin } from './@models/ivr-tpin.model';

@Component({
  selector: 'app-ivr-tpin',
  templateUrl: './ivr-tpin.component.html',
  styleUrls: ['./ivr-tpin.component.scss']
})
export class IvrTpinComponent implements OnInit {


  formData: IvrTpin = new IvrTpin();
  isCurrentTpinVisible: boolean = false;
  isNewTpinVisible: boolean = false;
  isConfirmNewTpinVisible: boolean = false;
  isOneTimePasswordVisible: boolean = false;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private httpService: HttpService,
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.router.navigate(['/dashboard/consolidated'], { relativeTo: this.route });
  };

  reset(): void {
    // const data = { dataMap: { id: this.formData.userId } };
    // this.httpService.httpPost('setup/security/resetUser/private/reset', data).subscribe((res) => {

    // });
    this.toasterService.showToaster({
      severity: 'success',
      detail: 'IVR TPIN Reset Successfully',
    });
    this.formData = new IvrTpin();
  };


}
