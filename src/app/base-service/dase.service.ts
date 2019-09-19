import { Injectable } from '@angular/core';
import { IBase, IData, IItem, IMonth, IYear, IDataBase } from './base.interface';
import { DriveService } from '../google-service/drive.service';
import { Observer, of, Observable, Subject, pipe, from, pairs } from 'rxjs';
import { map, debounce, debounceTime, switchMap, tap, pluck, delay, filter } from 'rxjs/operators';

const idBase: string = "1_K6xMleGXyF1qVwQvryEMoUVtSR3IbWJ";

export class Item implements IItem {
  constructor(public name, public price, public num) { }
}
export class Data implements IData {
  constructor(
    public date: Date,
    public items: IItem[],
    public sale: number,
    public total: number,
    public other?: any
  ) { }
}






@Injectable({
  providedIn: 'root'
})
export class BaseService implements IBase {

  save$: Subject<number> = new Subject();
  saveObservable: Observable<number>;

  dataBase: IDataBase = {};
  tmp = {};

  constructor(private drive: DriveService) {

    this.saveObservable = this.save$.pipe(
      debounceTime(500),
      switchMap(() => {
        return this.drive.update(idBase, { data: JSON.stringify(this.dataBase, null, 2) })
          .pipe(map(res => res.status))
      }),
      tap(() => {
        console.log(JSON.stringify(this.dataBase, null, 2))
      })
    )
  }
  log(...arg: Array<any>) {

    // console.dir(arg);
    for (let i = 0; i < arg.length; i++) {
      console.log(arg[i]);

    }
  }

  get(date: Date) {

    this.drive.text(idBase).pipe(
      pluck('body'),
      map((body) => JSON.parse(body, (key, val) => key === 'date' ? new Date(val) : val)),
      tap((data)=> console.log("tap",data)),
      switchMap((data)=> pairs(data) ),
      // map(data => Object.keys(data).map(k => [data[k]]))
    )
      .subscribe(
        (data) => {
          // this.dataBase =  data;
          console.dir(data)
        }



      )

    let data: Data = new Data(new Date(), [], null, null); 
    //= this.dataBase[date.getFullYear()]
    //   && this.dataBase[date.getFullYear()][date.getMonth()]
    //   && this.dataBase[date.getFullYear()][date.getMonth()][date.getDate() - 1];
    // console.log("dataService", data);

    // if (data) {
    //   data = JSON.parse(JSON.stringify(data), (key, val) => {
    //     if (key === 'date')
    //       return new Date(val);
    //     return val
    //   })
    // }
    // else
    //   data = new Data(date, [], null, null);

    return of(data).pipe(delay(1000));
  }
  maxDayOfMouth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  save(data: IData) {

    let _data: IData = JSON.parse(JSON.stringify(data), (key, val) => {
      if (key === 'date')
        return new Date(val);
      return val
    })


    let year: IYear = this.dataBase[data.date.getFullYear()] ? this.dataBase[data.date.getFullYear()] : new Array(12);
    let month: IMonth = year[data.date.getMonth()] ? year[data.date.getMonth()] : new Array(this.maxDayOfMouth(data.date));

    month[data.date.getDate() - 1] = _data;
    year[data.date.getMonth()] = month;
    this.dataBase[data.date.getFullYear()] = year;


    this.save$.next();
  }

}