import { Injectable } from '@angular/core';
import { OuterSubscriber } from 'rxjs/internal/OuterSubscriber';


export class Item{
  constructor(public name:string, public price:number, public number:number){}
}
export class Data{

  public items:Item[] = [];
  constructor ( item:Item, public sale:number, public  total:number ){
    this.items.push(item);
  }

}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _data:Data;
  private _item:Item;
  constructor() {
    //this.item = new Item("name", 100, 1);
    //this.data = new Data (this.item, 50, 0);
  }
  set data(data:Data){
    this._data = data;
  }
  get data(){
    return this._data;
  }

  getTotal():number{
    let sum:number;

    
    return sum;

  }

  printfData(){
    console.log(JSON.stringify(this.data, null, 2));    
  }
}
