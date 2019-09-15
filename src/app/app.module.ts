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


export function initGapi(gapiSession: Auth2Service) {
  return () => gapiSession.initClient();
}

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

  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initGapi, deps: [Auth2Service], multi: true },
    Auth2Service,
    DriveService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
