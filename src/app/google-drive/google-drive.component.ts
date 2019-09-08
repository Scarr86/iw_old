import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { GoogleAuth2Service } from '../google-auth2.service';
// import { GoogleAuthService, GoogleApiService } from 'ng-gapi';
// import { NgGapiAuth2Service } from '../ng-gapi-auth2.service';

import { GoogleDriveService } from '../google-drive.service';
import { concatMap, delay, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatTextareaAutosize } from '@angular/material/input';
import { FormControl, FormControlName } from '@angular/forms';

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

  isSigned: boolean = false;


  files: File[] = [];
  editFile: File;


  constructor(
    private auth2: GoogleAuth2Service, // my realizacia
    private cdr: ChangeDetectorRef, // ChangeDetectorRef проверяет все переменные для компонента и его дитей и перересовывает страницу
    private drive: GoogleDriveService
  ) {
    console.log('GoogleDriveComponent');

  }

  ngOnInit() {
    this.auth2.initClient().subscribe(() => {

      console.log("init Client");
      this.cdr.detectChanges();
    },
      () => console.log("ERROR INIT CLIENT"));
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

  update() {
    if (this.editFile)
      this.drive.udate(this.editFile.id, this.fcTextarea.value).subscribe();
    else console.log("Не выбран файл");
    
  }

  createFile() {
    this.drive.createFile(this.fcName.value, this.fcTextarea.value).subscribe(res=>{
      this.editFile = res;
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
    this.drive.getList()
      .subscribe(files => {
        this.files = files;
        this.cdr.detectChanges();
      });
  }
  clearList() {
    this.files = null;


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




}
