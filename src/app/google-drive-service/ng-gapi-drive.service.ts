import { Injectable } from '@angular/core';
import { NgGapiAuth2Service } from '../google-auth2-service/ng-gapi-auth2.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { GoogleApiService } from 'ng-gapi';


const API_KEY: string = 'AIzaSyCofOM8sRo0bZRPxjnZxabuOtjuK6xN48o';

@Injectable({
  providedIn: 'root'
})
export class NgGapiDriveService {
  private readonly API_URL: string = 'https://www.googleapis.com/drive/v3/files';


  constructor(
    private googleApiService: GoogleApiService,
    private httpClient: HttpClient,
    private user: NgGapiAuth2Service) { }


    // obs = new Observable(sub => {
    //   gapi.client.drive.files.list({
    //     'pageSize': 10,
    //     'fields': "*"
    //   }).then(response => {
    //     let files: File[] = [];
    //     response.result.files.map(f => {
    //       let file: File = new File();
    //       file = { id: f.id, name: f.name };
    //       files.push(file);
    //     })
    //     sub.next(files);
    //   });
    // });
  
   // getAuth(newInstance?: boolean): Observable<GoogleAuth>;
   
  // getFilesList(): Observable<any> {

  //   const params = {
  //     pageSize: "10",
  //     fields: '*'
  //   }

  //   const headers = new HttpHeaders({
  //     Authorization: "Bearer " + this.user.getToken()
  //   });

  //   const options = { headers: headers };


  //   //return this.httpClient.get(this.API_URL,  { options , params }  );

  // }
}
