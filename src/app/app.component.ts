import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  NgZone,
  ChangeDetectionStrategy
} from "@angular/core";
import {
  Observable,
  interval,
  of,
  empty,
  throwError,
  timer,
  from,
  defer,
  EMPTY,
  BehaviorSubject,
  Subscription
} from "rxjs";
import { DriveService } from "./google-service/drive.service";
import {
  expand,
  takeWhile,
  pluck,
  scan,
  tap,
  map,
  switchMapTo,
  switchMap,
  repeatWhen,
  delay,
  switchAll,
  reduce,
  catchError,
  repeat,
  count,
  mergeMap,
  finalize
} from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Auth2Service } from "./google-service/auth2.service";
import { Data } from "./data-service/data";
import { DataSource, CollectionViewer } from '@angular/cdk/collections';

const API_KEY: string = "AIzaSyCofOM8sRo0bZRPxjnZxabuOtjuK6xN48o";
let token: string =
  "ya29.ImGNB9ZU3buV5Yoetj7XvApbamZiMVXVR4XHjkAonPZbHWlwO5KUJL8smnSngyOR6AEX_SzOANMsar9udatZEn5lC5wJBkcEDIiw5gb_NplYyHJCZsAxBF8hKnjZvVMRd2Xs";

interface IW {
  [key: string]: number;
  length: number;
}
class Class implements IW {
  [key: string]: number;
  get length() {
    return Object.keys(this).length;
  }
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None //для отмены внешних стилей
})
export class AppComponent implements OnInit {
  
  ds = new MyDataSource();


  title = "irksweekend";
  url = "https://content.googleapis.com/drive/v3/files";

  list$: Observable<Object[]>;

  iw: Class = new Class();

  constructor(
    private drive: DriveService,
    // private user: Auth2Service,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    this.iw["sdfd"] = 1;
    this.iw["qqq"] = 1;
    console.log(this.iw.length);
  }

  getProm() {
    return new Promise<any>((r, j) => {
      // console.log("prom");

      setTimeout(() => {
        console.log([1, 2, 3]);

        r([1, 2, 3]);
      }, 2000);
    });
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
      pageSize: "1",
      fields: "nextPageToken, files(id, name, mimeType )",
      key: API_KEY,
      pageToken: nextPageToken
    };
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get<gapi.client.drive.FileList>(this.url, {
      headers,
      params
    });
  }

  getList() {
    let nextPageToken = "";
    const params = {
      pageSize: "5",
      fields: "nextPageToken, files(id, name, mimeType )",
      key: API_KEY,
      pageToken: nextPageToken
    };
    const headers = {
      Authorization: `Bearer ${token}`
    };

    // this.list$ = this.http.get<gapi.client.drive.FileList>(this.url, { headers, params })
    //   .pipe(
    //     // expand((res, i) => {
    //     //   if (!res.nextPageToken) return empty();
    //     //   {
    //     //     console.log(i);
    //     //     params.pageToken = res.nextPageToken;
    //     //     return this.http.get<gapi.client.drive.FileList>(this.url, { headers, params })
    //     //   }
    //     // }),
    //     pluck('files'),
    //     scan((acc, f) => acc.concat(f), []),
    //   )

    // this.list$ = interval(1000)
    //   .pipe(
    //     map(v => {
    //     return [{ name: `${v}` }, { name: `${v+1}` }]
    //   }));
    let next = "";
    this.list$ = defer(() => this.drive.list(1, next)).pipe(
      repeat(Infinity),
      takeWhile(res => {
        next = res.result.nextPageToken;
        return !!next;
      }, true),
      pluck("result", "files"),
      scan((acc, f) => acc.concat(f), [])
    );

  }
}


export class MyDataSource extends DataSource<string | undefined> {
  private _length = 10;
  private _pageSize = 1;
  private _cachedData = Array.from<string>({length: this._length});
  private _fetchedPages = new Set<number>();
  private _dataStream = new BehaviorSubject<(string | undefined)[]>(this._cachedData);
  private _subscription = new Subscription();

  connect(collectionViewer: CollectionViewer): Observable<(string | undefined)[]> {
    this._subscription.add(collectionViewer.viewChange.subscribe(range => {
      const startPage =0 //this._getPageForIndex(range.start);
      const endPage = 2//this._getPageForIndex(range.end - 1);
      for (let i = startPage; i <= endPage; i++) {
        this._fetchPage(i);
      }
    }));
    return this._dataStream;
  }

  disconnect(): void {
    this._subscription.unsubscribe();
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  private _fetchPage(page: number) {
    if (this._fetchedPages.has(page)) {
      return;
    }
    this._fetchedPages.add(page);

  
    // Use `setTimeout` to simulate fetching data from server.
    setTimeout(() => {
      this._cachedData.splice(page * this._pageSize, this._pageSize,
          ...Array.from({length: this._pageSize})
              .map((_, i) => `Item #${page * this._pageSize + i}`));
      this._dataStream.next(this._cachedData);
    }, Math.random() * 1000 + 200);
  }
}