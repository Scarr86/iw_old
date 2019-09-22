import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Observable, interval, of, empty, throwError, timer } from 'rxjs';
import { DriveService } from './google-service/drive.service';
import { expand, takeWhile, pluck, scan, tap, map, switchMapTo, switchMap, repeatWhen, delay, switchAll, reduce, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Auth2Service } from './google-service/auth2.service';

const API_KEY: string = 'AIzaSyCofOM8sRo0bZRPxjnZxabuOtjuK6xN48o';
let token: string = 'ya29.ImGLB1g2gHrwTus1hagAEubcHRldY_-UKUnCfkHklAknvLJ7xHUwCyqCuYLabxu-kq_6UNnGEbe1pWnneZU23rf3yj08JRO_ffD5kGzOsUPaBn-ebXysjj42b428y0XMLywj';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None //для отмены внешних стилей
})
export class AppComponent implements OnInit {
  title = 'irksweekend';
  url = "https://content.googleapis.com/drive/v3/files"

  list$: Observable<Object[]>;
  constructor(
    private drive: DriveService,
    private user: Auth2Service,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,

  ) {
  }

  ngOnInit() {
    //Request URL: 
    //https://content.googleapis.com/drive/v3/files?
    //pageSize=1
    //&pageToken
    //&fields=nextPageToken%2C%20files(id%2C%20name%2C%20mimeType%20)
    //&key=AIzaSyCofOM8sRo0bZRPxjnZxabuOtjuK6xN48o

    //Request URL: 
    //https://www.googleapis.com/drive/v3/files?
    //pageSize=1
    //&fields=nextPageToken,%20files(id,%20name,%20mimeType%20)&key=AIzaSyCofOM8sRo0bZRPxjnZxabuOtjuK6xN48o

    //Request URL: 
    //https://www.googleapis.com/drive/v3/files?
    //pageSize=1
    //&fields=name
    //&key=AIzaSyCofOM8sRo0bZRPxjnZxabuOtjuK6xN48o

  }
  getListRecus(nextPageToken: string) {
    console.log("recus");
    const params = {
      'pageSize': "1",
      'fields': "nextPageToken, files(id, name, mimeType )",
      "key": API_KEY,
      "pageToken": nextPageToken
    }
    const headers = {
      Authorization: `Bearer ${token}`
    }
    return this.http.get<gapi.client.drive.FileList>(this.url, { headers, params })
  }
  getList() {
    let nextPageToken = '';
    const params = {
      'pageSize': "1",
      'fields': "nextPageToken, files(id, name, mimeType )",
      "key": API_KEY,
      "pageToken": nextPageToken,
    }
    const headers = {
      Authorization: `Bearer ${token}`
    }

    let time = interval(1000);
    let per = timer(0, 60 * 1000);
    let t = 0;
    time.pipe(
      map(v => t = v),
      switchMap(v => this.http.get<gapi.client.drive.FileList>(this.url, { headers, params }))
    ).subscribe(
      null,
      // (r) => console.log("t", t),
      (e) => console.log('err t', t))

    per.subscribe(
      () => console.log("per", t)
    )

    // this.list$ = this.http.get<gapi.client.drive.FileList>(this.url, { headers, params })
    //   .pipe(
    //     expand((res, i) => {
    //       if (!res.nextPageToken) return empty();
    //       {
    //         console.log(i);
    //         params.pageToken = res.nextPageToken;
    //         return this.http.get<gapi.client.drive.FileList>(this.url, { headers, params })
    //       }
    //     }),
    //     pluck('files'),
    //     scan((acc, f) => acc.concat(f), []),
    //   )


    // this.list$ = interval(1000)
    //   .pipe(
    //     map(v => {
    //     return [{ name: `${v}` }, { name: `${v+1}` }]
    //   }));
    // this.list$ = this.drive.list(1)
    //   .pipe(
    //     expand((res) => this.drive.list(1, res.result.nextPageToken)),
    //     takeWhile((res) => !!res.result.nextPageToken, true),
    //     pluck("result", 'files'),
    //     scan((acc, f) => acc.concat(f), []),
    //     // switchMap((acc) => interval(1000).pipe(map(i=> acc))),
    //     tap((acc) =>this.cdr.markForCheck(), ()=>this.cdr.markForCheck(), () => console.log("comp"))
    //   )
  }
}

