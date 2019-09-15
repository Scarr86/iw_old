import { Injectable } from '@angular/core';
import { Data, Item } from './data';
import { DriveService } from '../google-service/drive.service';




@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _data: Data;
  id: string;
  constructor(private drive: DriveService) {
    this._data = new Data();
  }
  set data(data: Data) {
    this._data = data;
    console.log("data",  JSON.stringify(this._data,null, 2));
  }
  get data() {
    console.log("data",  JSON.stringify(this._data,null, 2));
    return this._data;

  }

  save() {
    
    let pre = this.data.printfData();
    let prototype = Object.getPrototypeOf(this.data);
    console.log('this pre', prototype);
    this.data = JSON.parse(pre) ;
    Object.setPrototypeOf(this.data, prototype);
    // console.log("post", JSON.stringify(this., null, 2));
    console.log("this post", Object.getPrototypeOf(this.data));
    
    // this.drive.create("name", this.data.printfData()).subscribe((res) => {

    //   this.id = res.result.id;

    // });
  }
  getData() {
    this.drive.text(this.id).subscribe(res => {
      let data;
      console.log(res);
      
      if (res.result){
        data = JSON.parse(res.body)
        console.log(typeof data, data);
        
        // this.data = JSON.parse(res.body)
      }
    },
    (err)=> console.log(err))
  }


}
