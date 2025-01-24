import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'upload-form-control',
  templateUrl: './upload-form-control.component.html',
  styleUrls: ['./upload-form-control.component.scss'],
})
export class UploadFormControlComponent implements OnInit {
  @ViewChild('fileDropRef') fileDropRef: any;
  @Input() url: string;
  @Input() isMultiple: boolean;
  @Input() isHideUploadList: boolean;
  @Input() files: any[];
  @Input() hideDragDropContainerOnFIleUpload?: boolean = false;
  @Input() hideNoFileMessage?: boolean = false;
  @Input() disabled?: boolean = false;

  @Output() onSelected = new EventEmitter<any>();
  @Output() onUploaded = new EventEmitter<any>();

  constructor() {
    if (!this.files) {
      this.files = [];
    }
  }

  ngOnInit(): void {}

  /**
   * on file drop handler
   */
  onFileDropped(event: any) {
    event.preventDefault();
    event.stopPropagation();
    let files = event.dataTransfer.files;
    if (files.length > 0) {
      this.prepareFilesList(files);
    }
  }

  onFileDropoverAndLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  openFileInput() {
    const elementRef: any = document.getElementById('fileDropRef');

    if (elementRef) {
      elementRef.click();
    }
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (!this.disabled) {
      this.files.splice(index, 1);
      this.onUploaded.emit(this.files);
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

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
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
}
