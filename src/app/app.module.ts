import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './meterial.module';
import { TestMaterialComponent } from './test-material/test-material.component';

import { HttpClientModule } from '@angular/common/http';

import { GoogleDriveComponent } from './google-drive/google-drive.component';


import { DataFormComponent } from './data-form/data-form.component';
import { HistoryComponent } from './history/history.component';




import { Auth2Service } from './google-service/auth2.service';
import { DriveService } from './google-service/drive.service';
import { SigninComponent } from './components/signin/signin.component';
import { GapiSession } from './service/google/gapi.session';
import { DashboardComponent } from './components/dashboard/dashboard.component';


export function initGapi(gapiSession: GapiSession) {
  return () => gapiSession.initClient();
}

@NgModule({
  declarations: [
    AppComponent,
    TestMaterialComponent,
    GoogleDriveComponent,
    DataFormComponent,
    HistoryComponent,
    SigninComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,

  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initGapi, deps: [GapiSession], multi: true },
    // Auth2Service,
    DriveService,
    GapiSession,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
