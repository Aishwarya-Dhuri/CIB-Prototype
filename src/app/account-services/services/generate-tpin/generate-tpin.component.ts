import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { GenerateTpin } from './@models/generate-tpin.model';

@Component({
  selector: 'app-generate-tpin',
  templateUrl: './generate-tpin.component.html',
  styleUrls: ['./generate-tpin.component.scss']
})
export class GenerateTpinComponent implements OnInit {

  formData: GenerateTpin = new GenerateTpin();
  isConfirmNewPasswordVisible: boolean = false;
  isOneTimePasswordVisible: boolean = false;
  isTpinVisible: boolean = false;

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

  generate(): void {
    // const data = { dataMap: { id: this.formData.userId } };
    // this.httpService.httpPost('setup/security/resetUser/private/reset', data).subscribe((res) => {

    // });
    this.toasterService.showToaster({
      severity: 'success',
      detail: 'IVR TPIN Generated Successfully',
    });
    this.formData = new GenerateTpin();
  };

}
