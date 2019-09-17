import { Injectable } from '@angular/core';
import { IBase, IData, IItem, IMonth, IYear, IDataBase } from './base.interface';
import { DriveService } from '../google-service/drive.service';
import { Observer, of, Observable, Subject, pipe, from } from 'rxjs';
import { map, debounce, debounceTime, switchMap, tap, pluck } from 'rxjs/operators';
import { Idata } from '../data-service/data';

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

  get(date: Date): IData {
    this.tmp[1] = 1;
    this.tmp[2] = 2
 
    of(this.dataBase)
      .pipe(
        map(data=>{ 
          return  from(Object.keys(data).map(k=>[k,data[k]]))
          //.map(k=>data[k]) 
        }),
        switchMap(obs=>{
            return obs;
        }),
        tap((res)=>console.log('1',res)),
        map((v,i)=>{
          console.log(i, v);
          return v[i]
        }  ),
        tap((res)=>console.log('2', res)),
      )
      .subscribe((res)=>console.log("3", res));

    return;
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