import { Injectable } from '@angular/core';
import { IBase, IDataBase, IData, IItem,  IMonth } from './base.interface';


class item implements IItem{
  constructor(public name, public price, public num){}
}



@Injectable({
  providedIn: 'root'
})
export class BaseService implements IBase {

  dataBase: IDataBase = [];

  constructor() {
    let data: IData = {
      date: new Date(),
      items: [new item("Test1", 1000, 1), new item("Test2", 2000, 1), new item("Test3", 3000, 1)],
      sale: 500,
      total: 0,
    }
    let year:IMonth[] = [[data], [data], [data]];
    this.dataBase[2019] = year;
  }

  getData(date: Date): IData {
    console.log(JSON.stringify(this.dataBase, null, 2));

    return;
  }
  setData(data: IData): string {

    return 'ok';
  }

}