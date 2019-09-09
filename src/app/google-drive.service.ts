
/// <reference path="../../node_modules/@types/gapi/index.d.ts" />
/// <reference path="../../node_modules/@types/gapi.client/index.d.ts" />

/// <reference path="../../node_modules/@types/gapi.client.drive/index.d.ts" />
import { Injectable } from '@angular/core';
import { GoogleAuth2Service } from './google-auth2.service';
import { Observable, of, from, empty, range, interval } from 'rxjs';

//import drive = gapi.client.drive.files;
import { map, concatMap, tap, catchError, takeWhile, expand, filter, delay, switchMap, concatMapTo, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {

  constructor(private auth2: GoogleAuth2Service) {
    console.log("token", auth2.token);

  }

  delete(id: string) {

    return from(
      gapi.client.drive.files.delete({
        fileId: id
      })).pipe(
        tap(res => console.log("delete OK", res.result)),
        catchError(res => {
          console.log("delete ERROR", res.result);
          return empty();
        })
      );
  }




  getPage(nextPageToken: string): Observable<any> {

    return from(gapi.client.drive.files.list({
      'pageSize': 1,
      'fields': "nextPageToken, files(id, name, mimeType )",
      // 'fields': "*",
      'pageToken': nextPageToken
    }))
    //   .pipe(
    //     tap(({ result }) => console.log(result)),
    //     filter(res => !!res.result.nextPageToken),
    //     concatMap(res => {
    //       return this.getPage(res.result.nextPageToken);
    //     }));
  }



  // Пример с промисом
  async getPagePromise(nextPageToken: string) {
    return gapi.client.drive.files.list({
      'pageSize': 1,
      'fields': "nextPageToken, files(id, name, mimeType )",
      // 'fields': "*",
      'pageToken': nextPageToken
    })
  }
  async getListPromise(nextPageToken: string) {

    let res;

    let promise = this.getPagePromise(nextPageToken);
    await promise;
    promise.then((response) => {
      res = response;
      console.log(response);
      if (response.result.nextPageToken)
        this.getListPromise(response.result.nextPageToken);
    })
    return res;
  }

  getList(nextPageToken: string): Observable<[{ id: string, name: string, mimeType: string }]> {

    let obss = new Observable<[{ id: string, name: string, mimeType: string }]>(obs => {
      this.getPage(nextPageToken)
        .pipe(
          tap((response) => {
            obs.next(response.result.files);
          }),
          filter(response => !!response.result.nextPageToken),
          concatMap(response => {
            return this.getList(response.result.nextPageToken);
          }))
        .subscribe(
          (response) => {
            obs.next(response);
          },
          console.error,
          () => {
            obs.complete();
          });
    })

    return obss;

    // .pipe(
    //   tap(res => {
    //     console.log("getList OK", res.result);
    //   }),
    //   map(res => {
    //     return res.result.files;
    //   }),
    //   catchError(res => {
    //     console.log("getList ERROR", res.result);
    //     return empty();
    //   })
    // );
    // return of();
  }


  getTextFile(id: string, mimeType: string): Observable<any> {
    // application/json
    // application/vnd.google-apps.document
    if (mimeType === "application/json" || mimeType === 'text/plain') {
      return from(
        gapi.client.drive.files.get({
          fileId: id,
          alt: 'media',
          fields: "body"
        })
      ).pipe(
        tap(res => console.log("getTextFile OK", res.result)),
        map(res => {
          return res.body;
        }),
        catchError(res => {
          console.log("getTextFile ERROR", res.result);
          return empty();
        })
      );
    }
    if (mimeType === "application/vnd.google-apps.document") {
      return from(
        gapi.client.drive.files.export({
          fileId: id,
          mimeType: 'text/plain',
          fields: 'body'
        })
      ).pipe(
        tap(res => console.log(res)),
        map(res => {
          return res.body;
        }),
        catchError(res => {
          console.log("getTextFile ERROR", res.result);
          return empty();
        })
      );
    }
    return of("");
  }

  udate(id: string, data): Observable<any> {

    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const contentType = 'application/json';


    var metadata = {
      // 'name': "default name" + ".txt",
      'mimeType': contentType,
    };

    var multipartRequestBody =
      delimiter +
      'Content-Type: application/json \r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json \r\n\r\n' +
      data +
      // JSON.stringify(data, null, 2) +
      close_delim;

    return from(gapi.client.request({
      path: '/upload/drive/v3/files/' + id,
      method: 'PATCH',
      params: { 'uploadType': 'multipart', 'alt': 'json' },
      headers: {
        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
      },
      body: multipartRequestBody
    })).pipe(
      tap(res => console.log("udate OK", res)),
      catchError(res => {
        console.log("udate ERROR", res.result);
        return empty();
      })
    );

  }



  createFile(name, data): Observable<any> {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const contentType = 'application/json';
    if (name == "") name = "default name.txt"
    var metadata = {
      'name': name,
      'mimeType': contentType
    };

    var multipartRequestBody =
      delimiter +
      'Content-Type: application/json \r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json \r\n\r\n' +
      data +
      // JSON.stringify(data, null, 2) +
      close_delim;



    return from(gapi.client.request({
      path: '/upload/drive/v3/files',
      method: 'POST',
      params: { 'uploadType': 'multipart' },
      headers: {
        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
      },
      body: multipartRequestBody
    })).pipe(
      tap(res => {
        console.log("createFile OK", res)
      }),
      map(res => {
        return { id: res.result['id'], name: res.result['name'], mimeType: res.result['mimeType'] };
      }),
      catchError(res => {
        console.log("createFile ERROR", res.result);
        return empty();
      })
    );
  }
}


