import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { DocumentDetails } from '../../@models/self-onboarding.model';
import { SelfOnboardingService } from '../../@services/self-onboarding.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
})
export class DocumentUploadComponent implements OnInit, OnDestroy {
  documentTypes: string[] = [
    'Company Trade License',
    'Memorandum of Association',
    'Share Certificates',
    'Board of Directors',
    'Other Documents',
  ];

  activeDocumentType: string = this.documentTypes[0];

  documents: DocumentDetails[];

  constructor(
    private httpService: HttpService,
    private selfOnboardingService: SelfOnboardingService,
  ) {}

  ngOnInit(): void {
    this.documents = this.selfOnboardingService.selfOnboarding.documentDetails;
  }

  uploadCompanyTradeLicense(doc: File[]) {
    if (doc && doc.length > 0) {
      const data = new FormData();
      data.append('files', doc[0]);

      this.httpService.httpPost('fileUploadService/uploadedFiles', data).subscribe((res: any) => {
        this.documents[0].companyTradeLicense = [res.dataMap.file];
      });
    } else {
      this.documents[0].companyTradeLicense = doc;
    }
  }

  uploadMemorandumOfAssociation(doc: File[]) {
    if (doc && doc.length > 0) {
      const data = new FormData();
      data.append('files', doc[0]);

      this.httpService.httpPost('fileUploadService/uploadedFiles', data).subscribe((res: any) => {
        this.documents[0].memorandumOfAssociation = [res.dataMap.file];
      });
    } else {
      this.documents[0].memorandumOfAssociation = doc;
    }
  }

  uploadShareCertificates(doc: File[]) {
    if (doc && doc.length > 0) {
      const data = new FormData();
      data.append('files', doc[0]);

      this.httpService.httpPost('fileUploadService/uploadedFiles', data).subscribe((res: any) => {
        this.documents[0].shareCertificates = [res.dataMap.file];
      });
    } else {
      this.documents[0].shareCertificates = doc;
    }
  }

  uploadBoardOfDirectors(doc: File[]) {
    if (doc && doc.length > 0) {
      const data = new FormData();
      data.append('files', doc[0]);

      this.httpService.httpPost('fileUploadService/uploadedFiles', data).subscribe((res: any) => {
        this.documents[0].boardOfDirectors = [res.dataMap.file];
      });
    } else {
      this.documents[0].boardOfDirectors = doc;
    }
  }

  uploadOtherDocuments(doc: File[]) {
    if (doc && doc.length > 0) {
      const data = new FormData();
      data.append('files', doc[0]);

      this.httpService.httpPost('fileUploadService/uploadedFiles', data).subscribe((res: any) => {
        this.documents[0].otherDocuments = [res.dataMap.file];
      });
    } else {
      this.documents[0].otherDocuments = doc;
    }
  }

  ngOnDestroy() {
    this.selfOnboardingService.selfOnboarding.documentDetails = this.documents;
  }
}
