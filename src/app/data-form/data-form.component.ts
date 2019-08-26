import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { isNull } from 'util';
import { Data, Item, DataService } from '../data.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {

  date: string;
  formGroup: FormGroup;
  isSave: boolean;

  data: Data;
  item: Item;

  constructor(private cdr: ChangeDetectorRef, private dataServise: DataService) { }

  ngOnInit() {
    let d = new Date();
    this.date = d.getFullYear() + "-" + (d.getMonth() + 1) + '-' + d.getDate();

    this.formGroup = new FormGroup({

      "arrayFormGroups": new FormArray([
        new FormGroup({
          "itemName": new FormControl("item", Validators.minLength(5)),
          "price": new FormControl("100", Validators.min(1)),
          "number": new FormControl("1", Validators.min(1))
        })
      ]),
      "sale": new FormControl("50", Validators.min(0)),
      "total": new FormControl("", Validators.min(0))

    });
    this.formGroup.get('total').setValue(this.getTotal());

    this.item = new Item(this.getItemName(0), this.getPrice(0), this.getNum(0));
    this.data = new Data(this.item, this.formGroup.get("sale").value, this.formGroup.get("total").value);
    this.dataServise.data = this.data;






    this.formGroup.statusChanges.subscribe(stat => {
      this.isSave = stat == "VALID" ? true : false;

      //this.cdr.detectChanges();
      console.log(stat);

    });

    this.formGroup.valueChanges.subscribe(val => {
      let price:number = this.getPrice(0);
      if(isNaN(price)) return;
      console.log(price);
      
      

      if (+this.formGroup.get('total').value != this.getTotal())
        this.formGroup.get('total').setValue(this.getTotal());

      if (isNull(val['sale'])) val['sale'] = 0;
      if (isNull(val['sale']) || isNaN(val['sale']) || val['sale'] < 0)
        this.formGroup.controls['sale'].setValue(0);
      // console.log(val);

    });

  }

  getTotal(): number {
    let sum: number = this.arrayFormGroups.controls.reduce((sum: number, group: FormGroup) => {
      sum += +group.get("price").value * +group.get("number").value;
      return sum;
    }, 0);
    sum -= this.formGroup.get('sale').value as number;
    return sum;
  }

  save() {
    this.isSave = true;
    console.log(this.formGroup.value);
  }
  addItems() {
    this.arrayFormGroups.push(new FormGroup({
      "itemName": new FormControl("", Validators.minLength(1)),
      "price": new FormControl("100", Validators.min(1)),
      "number": new FormControl("1", Validators.min(1))
    }));
  }

  get arrayFormGroups(): FormArray {
    return this.formGroup.get('arrayFormGroups') as FormArray;
  }

  getItemName(i: number): any {
    return this.arrayFormGroups.controls[i].get("itemName")['value'];
  }
  getPrice(i: number): any {
    return this.arrayFormGroups.controls[i].get("price")['value'];
  }
  getNum(i: number): any {
    return this.arrayFormGroups.controls[i].get("number")['value'];
  }

  getData() {
    this.dataServise.printfData();
  }

}
