import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
// import { GoogleDriveService } from '../google-drive-service/google-drive.service';
// import { GoogleAuth2Service } from '../google-auth2-service/google-auth2.service';
// import { GoogleAuthService, GoogleApiService } from 'ng-gapi';
// import { NgGapiAuth2Service } from '../ng-gapi-auth2.service';

import { concatMap, delay, mergeMap, tap, concatMapTo, takeWhile, mapTo, expand, take, filter, switchMap, map, debounceTime, distinctUntilChanged, delayWhen, repeatWhen, scan, mergeAll, pluck, repeat, reduce, switchMapTo, finalize } from 'rxjs/operators';
import { Observable, of, interval, range, fromEvent, Subscribable, Subscription, observable, concat, merge, from, Subject, iif, empty, defer, BehaviorSubject } from 'rxjs';
import { MatTextareaAutosize } from '@angular/material/input';
import { FormControl, FormControlName } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Auth2Service } from '../google-service/auth2.service';
import { DriveService } from '../google-service/drive.service';

export class File {
  id: string = "";
  mimeType: string = "";
  name: string = "";
}

@Component({
  selector: 'app-google-drive',
  templateUrl: './google-drive.component.html',
  styleUrls: ['./google-drive.component.scss'],
})
export class GoogleDriveComponent implements OnInit, OnDestroy {

  @ViewChild("btnUpdate", { static: false }) btnUpdate: MatButton;

  delete$: Subject<string> = new Subject();
  getList$: Subject<number> = new Subject();
  _list$: BehaviorSubject<any> = new BehaviorSubject([]);
  _listObs$ = this._list$.asObservable();
  list$: Observable<any[]>;


  files: File[] = [];
  editFile: File;


  constructor(
    private drive: DriveService,
    private auth2: Auth2Service, // my realizacia
    private cdr: ChangeDetectorRef, // ChangeDetectorRef проверяет все переменные для компонента и его дитей и перересовывает страницу
  ) {
    console.log('GoogleDriveComponent');
  }

  ngOnInit() {


    this._list$.subscribe(
      (l) => {
        console.log('value', this._list$.getValue());
      }
    )
    
    // this.getList$
    //   .pipe(
    //     debounceTime(500),
    //     switchMap(size => {
    //       return this.drive.list(size, "")
    //         .pipe(
    //           tap(() => this.files.length = 0),
    //           expand(res => {
    //             if (!!res.result.nextPageToken)
    //               return this.drive.list(size, res.result.nextPageToken);
    //             else
    //               return empty();
    //           }),
    //           map(res => {
    //             return res.result.files.map((f): File => {
    //               return {
    //                 id: f.id,
    //                 name: f.name,
    //                 mimeType: f.mimeType
    //               }
    //             })
    //           }))
    //     }),
    //     scan((acc, f) => acc.concat(f), [])
    //   )
    //   .subscribe((res) => {
    //     this.files = res;
    //     this.cdr.detectChanges();
    //   },
    //     null,
    //     () => console.log("complite"));




    // this.delete$
    //   .pipe(
    //     mergeMap(
    //       (id: string) => this.drive.delete(id)
    //     ),
    //     debounceTime(1000)
    //   )
    //   .subscribe(res => {

    //     this.getList();
    //     this.fcName.setValue("");
    //     this.fcTextarea.setValue("");
    //     this.editFile = null;
    //   },
    //     (err: Error) => console.error(err.message),
    //     () => console.log("Complite"));
  }

  ngOnDestroy() {
    this.delete$.unsubscribe();
  }
  signIn() {
    this.auth2.signIn().subscribe(() => {
      console.log("signIn");
      this.cdr.detectChanges();
    },
      () => console.log("EROOR SIGNIN"));
  }

  signOut() {
    this.auth2.signOut()
      .subscribe(
        () => {
          this.cdr.detectChanges();
          console.log("signOut");
        },
        () => console.log("ERROR SIGNOUT"));
  }

  isLoggedIn(): boolean {
    return this.auth2.isSignedIn;
  }



  /******************************************************* */
  fcTextarea: FormControl = new FormControl("");
  fcName: FormControl = new FormControl("");

  delete(f: File, i: number) {

    this.drive.delete(f.id).pipe(
      tap(() => this._list$.next(f))
    )
      .subscribe(
        () => this.files.splice(i, 1),
        (err: Error) => console.error(err.message),
        () => {
          console.log("DELETE Complite")
          this.cdr.detectChanges();
        }
      )
  }

  update() {
    if (this.editFile) {
      this.btnUpdate.disabled = true;
      this.drive.update(this.editFile.id, { name: this.fcName.value, data: this.fcTextarea.value })
        .subscribe(
          () => {
            this.btnUpdate.disabled = false;
            this.getList();
            this.cdr.detectChanges();
          }
        );
    }
  }

  createFile() {
    this.editFile = null;
    this.drive.create(this.fcName.value, this.fcTextarea.value)
      .subscribe((res: gapi.client.Response<gapi.client.drive.File>) => {
        this.editFile = { id: res.result.id, name: res.result.name, mimeType: res.result.mimeType };
        this.files.push({ id: res.result.id, name: res.result.name, mimeType: res.result.mimeType });
        this._list$.next({ id: res.result.id, name: res.result.name, mimeType: res.result.mimeType });
        // this.getList();
      });
  }

  getText(file: File) {
    this.editFile = file;
    this.drive.text(file.id)
      .pipe(map(res => res.body))
      .subscribe(text => {
        this.fcTextarea.setValue(text);
        this.fcName.setValue(file.name);
        this.cdr.detectChanges();
      });
  }
  getList() {
  
    from(this.drive.list(1)).pipe(
      expand((res) => {
        // this.cdr.detectChanges();
        if(!res.result.nextPageToken) return empty();
        return this.drive.list(1, res.result.nextPageToken)
      }),
      pluck('result','files'),
      scan((acc, f) => acc.concat(f), []),
    ).subscribe(
      (fs)=>{ this.files = fs;
      this.cdr.detectChanges();}
      
    )



      // this.drive.list(1)
      //   .pipe(
      //     // tap(())
      //     // takeWhile((res)=> !!res.result.nextPageToken),
      //     expand((res) => this.drive.list(1, res.result.nextPageToken)),
      //     takeWhile((res) => !!res.result.nextPageToken, true),
      //     pluck("result", 'files'),
      //     scan((acc, f) => acc.concat(f), []),
      //     tap((fs) => {
      //       console.log(fs)
      //       this._list$.next(fs)
      //       this.files = fs
      //     }),
      //   )
 
  }

  clearList() {
    this.files.length = 0;
    this.fcName.setValue("");
    this.fcTextarea.setValue("");
    this.editFile = null;


    console.log(this.auth2.isSignedIn);

    // interval(1000).pipe(
    //   debounceTime(500)
    // )
    //   .subscribe(
    //     console.log
    //   )

  }








  // @ViewChild("myInput", { static: false }) myInput: ElementRef;
  // @ViewChild("myTa", { static: false }) myTa: ElementRef;

  ///fromEvent(this.myInput.nativeElement, "input")
  //   .pipe(
  //     map((ev: any) => ev.data),
  //     debounceTime(500),
  //     tap(console.log),
  //     distinctUntilChanged(),
  //     switchMap(() => from(this.getPromise("hello", 1000)))
  //   )
  //   .subscribe(
  //     (ev: any) => {
  //       this.myTa.nativeElement.value = this.myInput.nativeElement.value;
  //     }
  //   );

}
