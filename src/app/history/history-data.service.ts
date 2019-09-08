import { Injectable } from '@angular/core';
import { Data, Item } from '../data';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoryDataService {

  itemName: string[] = ["водолозки", "майки", "футболки", "штаны", "бриджи"];
  date: Date = new Date;
  constructor(private http: HttpClient) { }

  genHistoryDay(date: Date | number): Data {
    let cloneItemName = [...this.itemName];
    let randItem = this.randomInteger(0, cloneItemName.length);
    let data: Data = new Data();
    data.date = new Date(date);

    for (let index = 0; index < randItem; index++) {
      let item: Item = this.genItem(cloneItemName, 1000, 5);
      cloneItemName = cloneItemName.filter((name) => {
        return name != item.name;
      });
      data.items.push(item);
    }
    data.sale = this.randomInteger(0, 1) * data.getSumItems() / 10;
    data.total = data.getTotal();

    return data;
  }
  genItem(name: string[], maxPrice: number, maxNum: number): Item {
    let randNameIndex = this.randomInteger(0, name.length - 1);
    let randPrice = this.randomInteger(100, maxPrice);
    let randNum = this.randomInteger(1, maxNum);
    randPrice -= randPrice % 100;
    return { name: name[randNameIndex], price: randPrice, num: randNum };
  }

  genHistoryMonth(date: Date | number): Data[] {
    let data: Data[] = [];
    let d: Date = new Date(date);
    let month = d.getMonth();
    //console.log(new Date(2018, 1, 1).toDateString());


    for (d.setDate(1); d.getMonth() != month + 1; d.setDate(d.getDate() + 1)) {
      data.push(this.genHistoryDay(d));
    }

    return data;
  }

  getLastDayByMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  randomInteger(min: number, max: number): number {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  getHistory(): Observable<Data[]> {
    return this.http.get('/assets/2018-0.json')
      .pipe(
        map((data: Data[]) => {
          return data;
        })
      );
  }

}
