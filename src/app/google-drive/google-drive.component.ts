import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { GoogleDriveService } from '../google-drive-service/google-drive.service';
import { GoogleAuth2Service } from '../google-auth2-service/google-auth2.service';
// import { GoogleAuthService, GoogleApiService } from 'ng-gapi';
// import { NgGapiAuth2Service } from '../ng-gapi-auth2.service';

import { concatMap, delay, mergeMap, tap, concatMapTo, takeWhile, mapTo, expand, take, filter, switchMap, map, debounceTime, distinctUntilChanged, delayWhen } from 'rxjs/operators';
import { Observable, of, interval, range, fromEvent, Subscribable, Subscription, observable, concat, merge, from, Subject, iif, empty } from 'rxjs';
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
  fcTextarea: FormControl = new FormControl("");
  fcName: FormControl = new FormControl("");

  delete(file: File) {

    this.drive.delete(file.id).subscribe(res => {
      this.getList();
      this.fcName.setValue("");
      this.fcTextarea.setValue("");
      this.editFile = null;
    });

  }

  update() {
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

  createFile() {
    this.editFile = null;
    this.drive.create(this.fcName.value, this.fcTextarea.value).subscribe(res => {
      this.editFile = res;
      this.getList();
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
    this.files = [];
    this.drive.list(1)
      .pipe(
        tap(() => this.files.length = 0),
        expand(res => {
          if (!!res.result.nextPageToken)
            return this.drive.list(1, res.result.nextPageToken);
          else empty();
        }),
        map(res => {
          return res.result.files.map(function (f): File {
            return { id: f.id, name: f.name, mimeType: f.mimeType }
          });
        }))
      .subscribe(res => {
        this.files = this.files.concat(res);
        this.cdr.detectChanges();
      }, null, () => console.log("complite"));
  }

  clearList() {
    this.files = null;
    this.fcName.setValue("");
    this.fcTextarea.setValue("");
    this.editFile = null;
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
