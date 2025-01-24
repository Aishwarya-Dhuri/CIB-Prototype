import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private defaultUrl: string = 'dummyServer/json/';
  private baseUrl: string = '/';

  isLogApi: boolean = false;

  isServerConnected: boolean = false;

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: any) {
    this.buildBaseUrl();
  }

  buildBaseUrl(): void {
    this.baseUrl = this.getAssetUrl('');
  }

  public httpGetJSON(api: string): any {
    return this.http.get('/' + api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      }),
    );
  }

  public httpGet(api: string): any {
    return this.http.get(this.baseUrl + this.defaultUrl + api).pipe(
      map((response: any) => {
        if (response.responseStatus && response.responseStatus.status !== '0')
          console.error(
            this.baseUrl + this.defaultUrl + api + ' : ' + response.responseStatus.message,
          );

        this.isServerConnected = true;

        return response;
      }),
      catchError((err) => {
        return throwError(err);
      }),
    );
  }

  public httpPost(api: string, requestData?: any): Observable<any> {
    return this.http
      .post(this.baseUrl + this.defaultUrl + api, requestData ? requestData : {})
      .pipe(
        map((response: any) => {
          this.addAPiToExcel(api, requestData, response);

          if (response.responseStatus && response.responseStatus.status !== '0')
            console.error(
              this.baseUrl + this.defaultUrl + api + ' : ' + response.responseStatus.message,
            );

          this.isServerConnected = true;

          return response;
        }),
        catchError((err) => {
          return throwError(err);
        }),
      );
  }

  addAPiToExcel(api: string, req: any, res: any) {
    if (!this.isLogApi) {
      return;
    }

    const routes = api.split('/');

    const data = {
      product: routes[0],
      master: routes[1] ? routes[1] : '',
      module: routes[2] ? routes[2] : '',
      api,
      serviceName: routes[2] ? routes[2] : '',
      request: req,
      response: res,
    };

    this.http.post(this.baseUrl + this.defaultUrl + 'cfe/logApi', data).subscribe(
      (response: any) => {
        // console.log(response);
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  public httpPatch(api: string, requestData?: any): any {
    return this.http
      .patch(this.baseUrl + this.defaultUrl + api, requestData ? requestData : {})
      .pipe(
        map((response: any) => {
          if (response.responseStatus && response.responseStatus.status !== '0')
            console.error(
              this.baseUrl + this.defaultUrl + api + ' : ' + response.responseStatus.message,
            );

          this.isServerConnected = true;

          return response;
        }),
        catchError((err) => {
          return throwError(err);
        }),
      );
  }

  public httpPut(api: string, requestData?: any): any {
    return this.http.put(this.baseUrl + api, requestData ? requestData : {}).pipe(
      map((response: any) => {
        if (response.responseStatus && response.responseStatus.status !== '0')
          console.error(
            this.baseUrl + this.defaultUrl + api + ' : ' + response.responseStatus.message,
          );

        this.isServerConnected = true;

        return response;
      }),
      catchError((err) => {
        return throwError(err);
      }),
    );
  }

  public httpDelete(api: string, requestData?: any): any {
    return this.http.delete(this.baseUrl + this.defaultUrl + api).pipe(
      map((response: any) => {
        if (response.responseStatus && response.responseStatus.status !== '0')
          console.error(
            this.baseUrl + this.defaultUrl + api + ' : ' + response.responseStatus.message,
          );

        this.isServerConnected = true;

        return response;
      }),
      catchError((err) => {
        return throwError(err);
      }),
    );
  }

  public httpDownload(api: string): void {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    let serverUrl = this.getAssetUrl('');
    this.http.get(serverUrl + api, httpOptions).subscribe((data: any) => {
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = api.split('/')[api.split('/').length - 1];
      link.click();
    });
  }

  public getProtocol() {
    return this.document.location.protocol;
  }

  public getHostName() {
    return this.document.location.hostname;
  }

  public getAssetUrl(filePath: string): string {
    let serverUrl =
      this.document.location.protocol + '//' + this.document.location.hostname + ':3000/';
    // 'http://182.76.144.73:3000/'; // PUBLIC SERVER
    // 'http://172.16.0.163:3000/'; // QC SERVER
    // 'http://172.16.0.163:3001/'; // QC MOBILE DUMMY SERVER
    return serverUrl + filePath;
  }
}
