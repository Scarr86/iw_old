import { ArrayType } from '@angular/compiler';

const idBase: string = " ";

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



export interface IMonth extends Array<IData> {
    [day: number]: IData;
}
export interface IDataBase extends Array<IMonth[]>   {
    [year: number]: IMonth[];
}

export interface IBase {
    dataBase: IDataBase;
    getData: (date: Date) => IData;
    setData: (data: IData) => string | Error;
}
