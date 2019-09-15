
const idBase:string = " ";

interface IItem{
    name: string;
    price: number;
    num: number;  
}

interface IData{
    date: Date;
    items: IItem[];
    sale: number;
    total: number;
    other?: any;
}

interface IDay{
    data:IData;
}

interface IMonth{
    [key:number]: IDay;
}
interface IDataBase{
    [key:number]: IMonth;
}
