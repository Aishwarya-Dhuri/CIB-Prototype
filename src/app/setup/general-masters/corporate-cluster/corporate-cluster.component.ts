import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { CorporateCluster } from './@models/corporate-cluster.model';

@Component({
  selector: 'app-corporate-cluster',
  templateUrl: './corporate-cluster.component.html',
  styleUrls: ['./corporate-cluster.component.scss'],
})
export class CorporateClusterComponent implements OnInit {
  loading: boolean = false;
  formData: CorporateCluster = new CorporateCluster();

  stepperDetails: Stepper = {
    masterName: 'Corporate Cluster',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: false,
    isSaveDraftApplicable: false,
    headings: ['', ''],
  };

  mode: string = '';

  gridOptions: any = {
    rowModelType: 'clientSide',
  };

  context: any = { componentParent: this };

  loadingList: boolean = false;

  constructor(
    private httpService: HttpService,
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private userService: UserService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Corporate Cluster',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Setup' },
      { label: 'General Masters' },
      { label: 'Corporate Cluster' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData.effectiveFrom = this.userService.applicationDate;

    this.mode = this.viewService.getMode();

    if (this.mode == 'VIEW' || this.mode == 'EDIT') {
      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('setup/generalMasters/corporateCluster/private/view', data)
        .subscribe((formData: CorporateCluster) => {
          this.viewService.clearAll();

          this.formData = formData;

          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          } else {
            this.prepareClusterData();
          }

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onCopyFromExistingCLuster() {
    this.httpService
      .httpPost(
        'setup/generalMasters/corporateCluster/private/' + this.formData.copyClusterFromExisting,
      )
      .subscribe((response: any) => {
        this.formData.clusterDetails = response.clusterDetails;
        this.prepareClusterData();
      });
  }

  onAddNewPrintBranch() {}

  edit(index: number) {}

  delete(index: number) {
    this.formData.clusterDetails.splice(index, 1);
    this.prepareClusterData();
  }

  private prepareClusterData() {
    this.formData.clusterDetails = this.formData.clusterDetails.map((record: any, i: number) => {
      record.index = i + 1;
      if (!record.actions) {
        record.actions = [
          {
            index: 2,
            displayName: 'Edit',
            type: 'ICON',
            icon: 'pi pi-pencil',
            url: 'route~edit',
            methodName: 'edit',
            paramList: 'index',
            color: 'primary',
          },
          {
            index: 5,
            displayName: 'Delete',
            type: 'ICON',
            icon: 'pi pi-trash',
            url: 'private/delete',
            methodName: 'delete',
            paramList: 'index',
            color: 'warn',
          },
        ];
      }

      return record;
    });

    this.refreshGrid();
  }

  private refreshGrid() {
    this.loadingList = true;

    setTimeout(() => {
      this.loadingList = false;
    }, 100);
  }

  beforeSubmit() {
    this.formData.clusterDetails = this.formData.clusterDetails.map((record: any) => {
      delete record.index;
      delete record.actions;
      return record;
    });

    return true;
  }
}
