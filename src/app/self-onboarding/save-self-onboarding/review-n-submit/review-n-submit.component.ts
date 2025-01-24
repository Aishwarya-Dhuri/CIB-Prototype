import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { environment } from 'src/environments/environment';
import { SelfOnboarding } from '../../@models/self-onboarding.model';
import { SelfOnboardingService } from '../../@services/self-onboarding.service';

@Component({
  selector: 'app-review-n-submit',
  templateUrl: './review-n-submit.component.html',
  styleUrls: ['./review-n-submit.component.scss'],
})
export class ReviewNSubmitComponent implements OnInit {
  selfOnboarding: SelfOnboarding;
  //files: any;

  @Output() onSelected = new EventEmitter<any>();
  @Output() onUploaded = new EventEmitter<any>();
  @Input() files: any[];

  constructor(
    public selfOnboardingService: SelfOnboardingService,
    private httpService: HttpService,
  ) {
    if (!this.files) {
      this.files = [];
    }
  }

  ngOnInit(): void {
    this.selfOnboarding = this.selfOnboardingService.selfOnboarding;
  }

  getUserInitials(user: any) {
    return user.firstName.substring(0, 1) + user.lastName.substring(0, 1);
  }

  openLink(fileName: string) {
    window.open(this.httpService.getAssetUrl(fileName));
  }

  uploadOperatingMandate(doc: File[]) {
    if (doc && doc.length > 0) {
      const data = new FormData();
      data.append('files', doc[0]);

      this.httpService.httpPost('fileUploadService/uploadedFiles', data).subscribe((res: any) => {
        this.selfOnboarding.documentDetails[0].uploadOperatingMandate = [res.dataMap.file];
      });
    } else {
      this.selfOnboarding.documentDetails[0].uploadOperatingMandate = doc;
    }
  }

  downloadFormPDF(): void {
    const fileUrl = `/assets/selfOnboardingFormPDF.pdf`;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.target = '_blank';
    a.download = 'Self_Onboarding_Form.pdf';
    document.body.appendChild(a);
    a.click();
  }

  fileBrowseHandler(files: any) {
    this.prepareFilesList(files);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      item.status = 'Uploading';
      item.fileName = item.name;
      item.fileSize = item.size;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
    this.onSelected.emit(this.files);
  }

  onFileDropoverAndLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileDropped(event: any) {
    event.preventDefault();
    event.stopPropagation();
    let files = event.dataTransfer.files;
    if (files.length > 0) {
      this.prepareFilesList(files);
    }
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    //do file upload
    setTimeout(() => {
      if (index === this.files.length) {
        this.onUploaded.emit(this.files);
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            this.files[index].fileName = this.files[index].name;
            this.files[index].sysFileName =
              'sys_' +
              new Date().getTime() +
              '_' +
              this.files[index].name.toLowerCase().split(' ').join('-');
            this.files[index].status = 'Completed';
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 100);
      }
    }, 1000);
  }


}
