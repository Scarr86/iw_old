import { Component, OnInit } from '@angular/core';
import { HistoryDataService } from './history-data.service';
import { Data } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];



@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  toogle:boolean = true;
  color:string = "primary";


  private _data:Data[]|string;

  get data():Data[]|string{
    return JSON.stringify(this._data, null, 2);
  }
  set data(data: Data[]|string){
    this._data = data;
  }


  genData:string;
  
  constructor(private historyService:HistoryDataService) { }

  ngOnInit() {
    
  }

  toogleColor(){
    this.genData = JSON.stringify(this.historyService.genHistoryMonth(new Date(2018, 0) ), null, 2);
  }

  getData(){
     this.historyService.getHistory().subscribe((val:Data[])=>{
      this._data = val;
      });
  }

}
