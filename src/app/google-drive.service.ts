
/// <reference path="../../node_modules/@types/gapi/index.d.ts" />
/// <reference path="../../node_modules/@types/gapi.client/index.d.ts" />

/// <reference path="../../node_modules/@types/gapi.client.drive/index.d.ts" />
import { Injectable } from '@angular/core';
import { GoogleAuth2Service } from './google-auth2.service';
import { Observable, of, from } from 'rxjs';

//import drive = gapi.client.drive.files;
import { map, concatMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {

  constructor(private auth2: GoogleAuth2Service) {
    console.log("token", auth2.token);

  }
  getPage(pageToken: string): Observable<any> {
    console.log("getPage");

    return from(gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name, mimeType )",
      // 'fields': "*",
      'pageToken': pageToken
    }));
  }

  getList(): Observable<any> {
    return this.getPage("")
      .pipe(
        tap(res => {
          console.log(res);

        }),
        map(res => {
          return res.result.files.map(file => {
            return { id: file.id, name: file.name, mimeType: file.mimeType }
          })
        }));
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
        tap(res => console.log(res)),
        map(res => {
          return res.body;
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
      tap(res => console.log(res))
    );

  }

  createFile(name, data): Observable<any> {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const contentType = 'application/json';

    var metadata = {
      'name': name + ".txt",
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
      tap(res => console.log(res)),
      map(res => {
        return { id: res.result['id'], name: res.result['name'], mimeType: res.result['mimeType'] };
      })
    );
  }
}


