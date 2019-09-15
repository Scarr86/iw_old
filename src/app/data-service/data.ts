


export interface Iitem {
    name: string;
    price: number;
    num: number;
}

export interface Idata {
    date: Date | number;
    // date: Date;
    items: Iitem[];
    sale: number;
    total: number;
    other?: any;
}

export interface Idate {
    day: number,
    weekday: number,
    month: number,
    year: number,
}

export class Item implements Iitem {
    name: string = "";
    price: number = 0;
    num: number = 0;

    constructor() { }
}

export class Data implements Idata {
     _date: Idate = {
        year: 0,
        month: 0,
        weekday: 0,
        day: 0
    };
    ddate: Date;
    items: Item[] = [];
    sale: number = 0;
    total: number = 0;


    constructor() {
        this.items.push(new Item());
    }
    get date(): Date  {
        return new Date(this._date.year, this._date.month, this._date.day);
    }
    set date(date: Date) {
        let d: Date = new Date(date);

        this._date.year = d.getFullYear();
        this._date.month = d.getMonth();
        this._date.day = d.getDate();
        this._date.weekday = d.getDay();

    }

    getDateToStr(): string {
        let weekday: string[] = [
            "Воскресение",
            "Понедельник",
            "Вторник",
            "Среда",
            "Четверг",
            "Пятница",
            "Суббота",
        ];

        return weekday[this._date.weekday] + ' ' + this._date.day + '-' + (this._date.month + 1) + '-' + this._date.year;
        // return this.date.getDate() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getFullYear();
    }

    getTotal(): number {
        let sumItems = 0;
        if (this.items)
            sumItems = this.items.reduce((sum, item: Item, i: number) => {
                return sum += item.num * item.price;
            }, 0)
        return sumItems - this.sale;
    }

    getSumItems(): number {
        if (this.items)
            return this.items.reduce((sum, item: Item, i: number) => {
                return sum += item.num * item.price;
            }, 0);
        else return 0;
    }
    printfData(): string {
        let str = JSON.stringify(this, null, 2);
        //console.log(str);
        return str;
    }


}