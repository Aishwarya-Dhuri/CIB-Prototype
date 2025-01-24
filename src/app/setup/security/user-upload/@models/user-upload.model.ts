export interface UserUpload {
  dataLayoutId?: string;
  dataLayoutName?: string;
  uploadFileName?: string;
  uploadDateTime?: string;
  uploadedBy?: string;
  uploadStatus?: string;
  uploadFile?: UploadFile[];
}
export interface UploadFile {
  originalFileName?: string;
  sysFileName?: string;
  size?: string;
}
