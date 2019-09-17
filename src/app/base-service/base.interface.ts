import { Observer, Observable } from 'rxjs';


export interface IItem {
    name: string;
    price: number;
    num: number;
}

export interface IData {
    date: Date;
    items: IItem[];
    sale: number;
    total: number;
    other?: any;
}

// export interface IDay extends Array<IData>{
//     [day:number]: IData;
// }

export interface IMonth extends Array<IData> {
    [days: number]: IData;
}
export interface IYear extends Array<IMonth>    {
    [mouths: number]: IMonth;
}
export interface IDataBase {
    [years:string]:IYear;
}
  


export interface IBase {
    dataBase: IDataBase;
    get: (date: Date) => IData;
    save: (data: IData) => any;
}
