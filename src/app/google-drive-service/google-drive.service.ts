/// <reference path="../../../node_modules/@types/gapi/index.d.ts" />
/// <reference path="../../../node_modules/@types/gapi.client/index.d.ts" />

/// <reference path="../../../node_modules/@types/gapi.client.drive/index.d.ts" />
import { Injectable } from '@angular/core';
import { GoogleAuth2Service } from '../google-auth2-service/google-auth2.service';
import { Observable, of, from, empty, range, interval, Subscribable, Subscriber } from 'rxjs';

import { map, concatMap, tap, catchError, takeWhile, expand, filter, delay, switchMap, concatMapTo, mergeMap } from 'rxjs/operators';

@Injectable()
export class GoogleDriveService {

  constructor(private auth2: GoogleAuth2Service) {
    console.log("Drive service");

  }
  // logger():{next:(x:any)=>void, error:(e:any)=>void, comolite:()=>void) 
  // {
  //   return {
  //     next: console.log,
  //     console.error;


  //   }

  // }

  delete(id: string): Observable<gapi.client.Response<void>> {
    return from(gapi.client.drive.files.delete({ fileId: id }))
      .pipe(tap(
        (res) => console.info(`DELETE   id: ${id}`, res),
        (err) => console.error(`DELETE    fail    id: ${id}`, err)
      ));
  }

  list(size: number, nextPageToken?: string): Observable<gapi.client.Response<gapi.client.drive.FileList>> {

    if (!nextPageToken) {
      nextPageToken = "";
    }
    return from(gapi.client.drive.files.list({
      'pageSize': size,
      'fields': "nextPageToken, files(id, name, mimeType )",
      // 'fields': "*",
      'pageToken': nextPageToken
    })).pipe(tap(
      (res) => console.info(`LIST   size ${res.result.files.length}`, res),
      (err) => console.error("LIST    fail", err)
    ));
  }

  text(id: string) {

    return from(gapi.client.drive.files.get({
      fileId: id,
      alt: 'media',
      fields: "body"
    })).pipe(
      tap(
        (res) => console.info(`TEXT   id: ${id}`, res),
        (err) => console.error(`TEXT    fail    id: ${id}`, err)

      ));

  }

  getTextFile(id: string, mimeType: string): Observable<any> {
    // application/json
    // application/vnd.google-apps.document
    if (mimeType === "application/json" || mimeType === 'text/plain') {
      return new Observable(obs => {
        gapi.client.drive.files.get({
          fileId: id,
          alt: 'media',
          fields: "body"
        }).then(res => {
          obs.next(res.body);
          obs.complete();
        })
      })
        .pipe(
          tap(null, (err) => console.error("text      FAIL", err), () => console.log(`text     complite ${id}`))
        )

    }
    if (mimeType === "application/vnd.google-apps.document") {
      return from(
        gapi.client.drive.files.export({
          fileId: id,
          mimeType: 'text/plain',
          fields: 'body'
        })
      ).pipe(
        tap(console.log,
          console.error,
          () => console.log("getTextFile complite")
        ),
        map(res => {
          return res.body;
        }));
    }
    return of("");
  }

  update(id: string, upd: { name: string, data: string }): Observable<any> {


    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const contentType = 'application/json';

    if (upd.name === undefined) {
      upd.name = "";
    }
    if (upd.data === undefined) {
      upd.data = "";
    }
    var metadata = {
      'name': upd.name,
      'mimeType': contentType,
    };

    var multipartRequestBody =
      delimiter +
      'Content-Type: application/json \r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json \r\n\r\n' +
      upd.data +
      // JSON.stringify(data, null, 2) +
      close_delim;

    // return new Observable(obs => {


    return from(gapi.client.request({
      path: '/upload/drive/v3/files/' + id,
      method: 'PATCH',
      params: { 'uploadType': 'multipart', 'alt': 'json' },
      headers: {
        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
      },
      body: multipartRequestBody
    })).pipe(
      tap(
        (res) => console.info(`UPDATE   id: ${id}`, res),
        (err) => console.error(`UPDATE    fail    ${id}`, err)
      ));
  }



  create(name?: string, data?: string): Observable<any> {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const contentType = 'application/json';

    if (name === undefined) {
      name = "default name.txt";

    }
    if (data === undefined) {
      data = "";
    }

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
      tap(
        (res) => console.info(`CREATE   ${res.result.name}`, res),
        (err) => console.error("CREATE    fail    ${id}", err)
      ));
  }
}


