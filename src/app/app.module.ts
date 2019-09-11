import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './meterial.module';
import { TestMaterialComponent } from './test-material/test-material.component';

import { HttpClientModule } from '@angular/common/http';
import { GoogleDriveComponent } from './google-drive/google-drive.component';

import {
  GoogleApiModule,
  GoogleApiService,
  GoogleAuthService,
  NgGapiClientConfig,
  NG_GAPI_CONFIG,
  GoogleApiConfig
} from "ng-gapi";
import { DataFormComponent } from './data-form/data-form.component';
import { HistoryComponent } from './history/history.component';
import { GoogleDriveService } from './google-drive-service/google-drive.service';
import { GoogleAuth2Service } from './google-auth2-service/google-auth2.service';


// let gapiClientConfig: NgGapiClientConfig = {
//   client_id: '843806706192-trsuvvlpi50vohsul3imgjl20o7fnbuo.apps.googleusercontent.com',
//   discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
//   ux_mode: "popup",
//   // redirect_uri: "https://ng-gapi-example.stackblitz.io/redirect",
//   scope: [
//     'https://www.googleapis.com/auth/drive'
//   ].join(" "),

// };


@NgModule({
  declarations: [
    AppComponent,
    TestMaterialComponent,
    GoogleDriveComponent,
    DataFormComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    // GoogleApiModule.forRoot({
    //   provide: NG_GAPI_CONFIG,
    //   useValue: gapiClientConfig
    // })
  ],
  providers: [ GoogleDriveService, GoogleAuth2Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
