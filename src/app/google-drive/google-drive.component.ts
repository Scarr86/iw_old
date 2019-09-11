import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { GoogleDriveService } from '../google-drive-service/google-drive.service';
import { GoogleAuth2Service } from '../google-auth2-service/google-auth2.service';
// import { GoogleAuthService, GoogleApiService } from 'ng-gapi';
// import { NgGapiAuth2Service } from '../ng-gapi-auth2.service';

import { concatMap, delay, mergeMap, tap, concatMapTo, takeWhile, mapTo, expand, take, filter, switchMap, map, debounceTime, distinctUntilChanged, delayWhen } from 'rxjs/operators';
import { Observable, of, interval, range, fromEvent, Subscribable, Subscription, observable, concat, merge, from, Subject } from 'rxjs';
import { MatTextareaAutosize } from '@angular/material/input';
import { FormControl, FormControlName } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { resolve } from 'url';

export class File {
  id: string;
  name: string;
  mimeType: string;
}

@Component({
  selector: 'app-google-drive',
  templateUrl: './google-drive.component.html',
  styleUrls: ['./google-drive.component.scss'],
})
export class GoogleDriveComponent implements OnInit {

  @ViewChild("btnUpdate", { static: false }) btnUpdate: MatButton;

  isSigned: boolean = false;


  files: File[] = [];
  editFile: File;


  constructor(
    private drive: GoogleDriveService,
    private auth2: GoogleAuth2Service, // my realizacia
    private cdr: ChangeDetectorRef, // ChangeDetectorRef проверяет все переменные для компонента и его дитей и перересовывает страницу
  ) {


    console.log('GoogleDriveComponent');

  }

  ngOnInit() {

    // this.auth2.initClient().subscribe(() => {

    //   console.log("init Client");
    //   this.cdr.detectChanges();
    // },
    //   (err: Error) => console.log("ERROR INIT CLIENT", err.message));
  }

  signIn() {
    this.auth2.signIn().subscribe(() => {
      console.log("signIn");
      // this.cdr.detectChanges();
    },
      () => console.log("EROOR SIGNIN"));
    // this.ngGapiAuth2.signIn();
    // this.cdr.detectChanges();
  }

  signOut() {
    this.auth2.signOut().pipe(
      tap(console.log)
    )
      .subscribe(
        () => {
          this.cdr.detectChanges();
          console.log("signOut");
        },
        () => console.log("ERROR SIGNOUT"));
    // this.ngGapiAuth2.signOut();
  }

  isLoggedIn(): boolean {
    return this.auth2.isSignedIn();
  }



  /******************************************************* */
  // @ViewChild('ta', { static: false }) ta: MatTextareaAutosize;
  @ViewChild("myInput", { static: false }) myInput: ElementRef;
  @ViewChild("myTa", { static: false }) myTa: ElementRef;

  fcTextarea: FormControl = new FormControl("");
  fcName: FormControl = new FormControl("");


  delete() {
    if (this.editFile)
      this.drive.delete(this.editFile.id).subscribe(res => {
        this.getList();
        this.fcName.setValue("");
        this.fcTextarea.setValue("");
        this.editFile = null;
      });
    else console.log("Не выбран файл");

  }

  update() {

    this.btnUpdate.disabled = true;
    // this.btnUpdate.disabled = false;


    if (this.editFile)
      this.drive.udate(this.editFile.id, this.fcTextarea.value, this.fcName.value)
        .subscribe(
          () => {
            this.btnUpdate.disabled = false;
            this.cdr.detectChanges();
          }
        );
    // this.drive.udate("sdfdsfd", this.fcTextarea.value).subscribe(res=> console.log(res));
    else console.log("Не выбран файл");

  }

  createFile() {
    this.editFile = null;
    this.drive.createFile(this.fcName.value, this.fcTextarea.value).subscribe(res => {
      this.editFile = res;
      this.getList();
    });

  }

  getText(file: File) {
    this.editFile = file;
    this.drive.getTextFile(file.id, file.mimeType).subscribe(text => {
      this.fcTextarea.setValue(text);
      this.fcName.setValue(file.name);
      this.cdr.detectChanges();
    });
  }

  getList() {
    this.files = [];

    this.drive.getPage("")
    .pipe(
      expand(res=>{
        return this.drive.getPage(res.result.nextPageToken)
      }),
      takeWhile((res, i)=>{
        console.log(i, res.result.files);
        return !!res.result.nextPageToken;
      })
    ).subscribe( );
    return;

    this.drive.getList().subscribe(res => {
      this.files = this.files.concat(res);
      // console.log("app", this.files);
      this.cdr.detectChanges();
    });
  }

  clearList() {
    this.files = null;
    this.fcName.setValue("");
    this.fcTextarea.setValue("");
    this.editFile = null;


    // this.example.subscribe(val =>
    //     console.log(`With concatMap: ${val}`)
    //   );
    // this.mergeMapExample
    //   .subscribe(val => console.log(`With mergeMap: ${val}`));

  }

  getPromise(str: string, t: number) {
    return from(new Promise((resolve) => {
      console.log("start promise1");
      setTimeout(() => resolve(str), t);
    }))
  }

  arr: Array<string> = new Array();
  sub: Subject<string> = new Subject();

  addArr(n) {
    this.arr.push(n);
    this.sub.next(n);
    // this.sub.complete();
  }
  simul(r) {
    let rand = r;
    return of(rand).pipe(delay(rand));
  }
 
  isSub: boolean = true;

  test() {
    // this.addArr(2);
    this.arr.length = 0;
    // console.log(this.arr);
    if (this.isSub) {
      this.isSub = false;
     
      this.sub
        .pipe(
          concatMap(l=>{
            let rand = Math.floor(Math.random()*3000);
            console.log("need ",l,  rand);
            return of(l).pipe(delay(rand));
          })
        )
        .subscribe(
          (l) => {
            console.log("end save" , l);
            // this.arr.push(n);
            console.log(this.arr);
            
            // console.log(n);
            // console.log(this.arr);
          }, null,
          () => console.log("complite"));
    }


    from("abc").pipe(
      delayWhen((r,i) => 
      {
        // console.log(r, i);
       return interval(Math.random() * 1000).pipe(tap(()=>console.log(r, i)))
      })
    ).subscribe(
      (r) => {
        console.log("start save", r);
        
        this.addArr(r)
        // console.log(r);
      },
      null,
      () => { }
    )
    // this.simulAdd().subscribe((r)=>this.addArr(r));




    // this.addArr(1);
    // console.log(this.arr);
    // fromEvent(this.myInput.nativeElement, "input")

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


    // let st1$ = new Observable(obs => {
    //   this.getPromise("Hello", 1000).then((s) => {
    //     obs.next(s)
    //     obs.complete();
    //   });
    //   // console.log("start st1$");
    //   // setTimeout(() => {
    //   //   obs.next("Hello")
    //   //   obs.complete();
    //   // }, 1000);
    // });
    // let st2$ = new Observable(obs => {
    //   this.getPromise("All", 1000).then((s) => {
    //     obs.error(new Error("error"));
    //     // obs.next(s)
    //     // obs.complete();
    //   });
    //   // console.log("start st2$");
    //   // setTimeout(() => {
    //   //   obs.next("All")
    //   //   obs.complete();
    //   // }, 500);
    // })
    // let st3$ = new Observable(obs => {
    //   this.getPromise("World", 1000).then((s) => {
    //     obs.next(s)
    //     obs.complete();
    //   });
    // console.log("start st3$");
    // setTimeout(() => {
    //   obs.next("World")
    //   obs.complete();
    // }, 300);
    // })


    // st1$.pipe(
    //   switchMap(() => st2$),
    //   switchMap(() => st3$)
    // )
    // .subscribe(console.log, null, () => console.log("complite"));

    // let res$ = concat(st1$, st2$, st3$);
    // let res$ = concat(st1$, st2$, st3$);
    //let res$ = concat(this.getPromise("Hello", 1000), this.getPromise("All", 1000), this.getPromise("World", 1000));
    //res$.subscribe(console.log, console.error, () => console.log("complite"));

    // this.getPromise("Hello", 1000)
    // .then(s=>{
    //   console.log(s);
    //   return this.getPromise("All", 1000);
    // })
    // .then(s=>{
    //   console.log(s);
    //   return this.getPromise("world",1000);
    // })
    // .then(s=>console.log(s));




    // let stream$ = Observable.create(async (obs) => {
    //   let cc;
    //   do {
    //     await new Promise<number>((resolve) => {
    //       setTimeout(() => resolve(this.cnt++), 1000);
    //     }).then(c => {
    //       cc = c;
    //     });
    //     console.log(cc);
    //     obs.next(cc);
    //   } while (cc < 5);
    //   obs.complete();


    // });

    // stream$.subscribe(console.log, null, ()=>console.log("complite") );

    // range(0, 5).pipe(
    //   // filter(res => res > 2),
    //   // mergeMap( res =>{
    //   //   console.log("next rage",res);
    //   //  return this.getObs(res).pipe(takeWhile(res => res > 2));
    //   // }),
    //   concatMap(res => {
    //     console.log("next rage", res);
    //     // return of(res);
    //     return this.getObs(res)
    //     .pipe(takeWhile(res => res > 2));
    //   })
    // )
    //   .subscribe(res => console.log(res));

  }

}
