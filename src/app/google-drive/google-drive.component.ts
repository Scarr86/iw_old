import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { GoogleAuth2Service } from '../google-auth2-service/google-auth2.service';
// import { GoogleAuthService, GoogleApiService } from 'ng-gapi';
// import { NgGapiAuth2Service } from '../ng-gapi-auth2.service';

import { GoogleDriveService } from '../google-drive-service/google-drive.service';
import { concatMap, delay, mergeMap, tap, concatMapTo,  takeWhile, mapTo, expand, take, filter } from 'rxjs/operators';
import { of, Observable, interval, range, fromEvent, Subscribable, Subscription } from 'rxjs';
import { MatTextareaAutosize } from '@angular/material/input';
import { FormControl, FormControlName } from '@angular/forms';
import { MatButton } from '@angular/material/button';

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

  @ViewChild("btnUpdate",{static: false}) btnUpdate:MatButton;

  isSigned: boolean = false;


  files: File[] = [];
  editFile: File;


  constructor(
    private auth2: GoogleAuth2Service, // my realizacia
    private cdr: ChangeDetectorRef, // ChangeDetectorRef проверяет все переменные для компонента и его дитей и перересовывает страницу
    private drive: GoogleDriveService
  ) {
    this.btnUpdate.disabled = true;

    console.log('GoogleDriveComponent');

  }

  ngOnInit() {
    this.auth2.initClient().subscribe(() => {

      console.log("init Client");
      this.cdr.detectChanges();
    },
      (err: Error) => console.log("ERROR INIT CLIENT", err.message));
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
    this.auth2.signOut().subscribe(() => {
      // this.cdr.detectChanges();
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


    if (this.editFile)
      this.drive.udate(this.editFile.id, this.fcTextarea.value, this.fcName.value).subscribe();
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

    this.drive.getList("") .subscribe(res=>{
      this.files = this.files.concat(res);
      console.log("app", this.files);
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

  // RxJS v6+

  //emit delay value
  source = of(2000, 1000);
  // map value from source into inner observable, when complete emit result and move to next
  example = this.source.pipe(
    tap(val => console.log(val)),
    concatMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
  );
  //output: With concatMap: Delayed by: 2000ms, With concatMap: Delayed by: 1000ms
  //  subscribe = this.example.subscribe(val =>
  //   console.log(`With concatMap: ${val}`)
  // );

  // showing the difference between concatMap and mergeMap
  mergeMapExample = this.source
    .pipe(
      // just so we can log this after the first example has run
      // delay(5000),
      mergeMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
    )
  // .subscribe(val => console.log(`With mergeMap: ${val}`));


  getObs(n) {
    console.log("getObs");

    return of(n).pipe(delay(1000));
  }


  test() {

    range(0, 5).pipe(
      // filter(res => res > 2),
      // mergeMap( res =>{
      //   console.log("next rage",res);
      //  return this.getObs(res).pipe(takeWhile(res => res > 2));
      // }),
      concatMap(res => {
        console.log("next rage", res);
        // return of(res);
        return this.getObs(res)
        .pipe(takeWhile(res => res > 2));
      })
    )
      .subscribe(res => console.log(res));

  }

}
