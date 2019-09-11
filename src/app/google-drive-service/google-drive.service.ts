
/// <reference path="../../../node_modules/@types/gapi/index.d.ts" />
/// <reference path="../../../node_modules/@types/gapi.client/index.d.ts" />

/// <reference path="../../../node_modules/@types/gapi.client.drive/index.d.ts" />
import { Injectable } from '@angular/core';
import { GoogleAuth2Service } from '../google-auth2-service/google-auth2.service';
import { Observable, of, from, empty, range, interval, Subscribable, Subscriber } from 'rxjs';

import Drive = gapi.client.drive.FilesResource;
import { map, concatMap, tap, catchError, takeWhile, expand, filter, delay, switchMap, concatMapTo, mergeMap } from 'rxjs/operators';
import { async } from 'q';

@Injectable()
export class GoogleDriveService {
  drive: Drive;

  constructor(private auth2: GoogleAuth2Service) {
    console.log("Drive service");

  }



  delete(id: string) {
    return from(
      gapi.client.drive.files.delete({
        fileId: id
      })).pipe(
        tap(
          null,
          (err) => console.error("DELETE FAIL", id, err),
          () => console.log(`delete     complite ${id} `))
      );
  }




  getPage(nextPageToken: string): Observable < gapi.client.Response <gapi.client.drive.FileList> >{

    return from( gapi.client.drive.files.list({
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

  getList(size?: number): Observable<any> {
    let nextPageToken = "";
    let exit = 1;

    let request = {
      'pageSize': size ? size : 1,
      'fields': "nextPageToken, files(id, name, mimeType )",
      // 'fields': "*",
      'pageToken': nextPageToken ? nextPageToken : ""
    }

    return Observable.create(async (obs: Subscriber<any>) => {
      do {
        await gapi.client.drive.files.list(request)
          .then((res) => {
            console.log("next page");
            nextPageToken = res.result.nextPageToken;
            obs.next(res.result.files);
            obs.complete();
          });
      } while (nextPageToken && exit );
      return ()=>{ exit = 0; } 
    }).pipe(
      tap(null, (err) => console.error("list      FAIL", err), () => console.log(`list     complite ${size ? size : 100}`))
    )




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
    }).pipe(
      tap(console.log, console.error, () => console.log("getList complite"))
    );

    return obss;

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

  udate(id: string, data: string, name?: string): Observable<any> {

    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const contentType = 'application/json';

    if (!name) name = "default name"
    var metadata = {
      'name': "default name",
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

    return new Observable(obs => {
      gapi.client.request({
        path: '/upload/drive/v3/files/' + id,
        method: 'PATCH',
        params: { 'uploadType': 'multipart', 'alt': 'json' },
        headers: {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"'
        },
        body: multipartRequestBody
      }).then(() => {
        obs.next();
        obs.complete();
      });
    }).pipe(
      tap(null,
        (err) => console.error("udate     FAIL", err),
        () => console.log(`udate      complite ${id}`)
      ));

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



    return new Observable(obs => {

      gapi.client.request({
        path: '/upload/drive/v3/files',
        method: 'POST',
        params: { 'uploadType': 'multipart' },
        headers: {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"'
        },
        body: multipartRequestBody
      }).then((res) => {
        obs.next({ id: res.result['id'], name: res.result['name'], mimeType: res.result['mimeType'] });
        obs.complete();
      })
    }).pipe(
      tap(
        (res) => console.log(`create  ${res.id}`),
        (err) => console.error("create     FAIL", err),
        null
      ));
  }
}


