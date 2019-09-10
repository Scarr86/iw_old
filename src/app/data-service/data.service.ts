import { Injectable } from '@angular/core';
import { Data } from './data';




@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _data:Data;
  constructor() {
    this._data = new Data();
  }
  set data(data:Data){
    this._data = data;
  }
  get data(){
    return this._data;
  }
}
