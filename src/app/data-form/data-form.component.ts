import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, AbstractControl, FormBuilder, FormGroupDirective } from '@angular/forms';
import { DataService } from '../data-service/data.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
// import {  Item } from '../data-service/data';
import { BaseService, Data, Item } from '../base-service/dase.service';
import { IData } from '../base-service/base.interface';
import { Observer, Observable } from 'rxjs';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';




@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {

  formGroup: FormGroup;
  _data: Data; 
  //= new Data(new Date(), [new Item("test1", 1000, 1)], 0, 0);
  //item: Item;
  save$: Observable<number>


  options: string[] = ['One', 'Two', 'Three'];
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    // private dataServise: DataService,
    private base: BaseService,
    private formBuilder: FormBuilder
  ) {
    // let deleteIco = iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/ic_delete_24px.svg'));

  }

  set data(data: Data) {
    this._data = data;
    this.sale = data.sale;
    this.total = data.total;
    data.items.forEach(i=> this.item = i);
  }
  get data(): Data {
    return this._data;
  }
  set sale(s: number) {
    this.formGroup.get("sale").setValue(s);
  }
  set total(t: number) {
    this.formGroup.get("total").setValue(t);
  }
  set item(i: Item) {
    this.arrayFormGroups.push(this.createItemFormGroup(i));
  }

  ngOnInit() {
    this.base.saveObservable.subscribe(console.log)

    this.formGroup = this.formBuilder.group({
      'arrayFormGroups': this.formBuilder.array([]),
      "sale": [null],
      "total": [null]
    })


    // this.base.get(new Date()).subscribe((d)=>  this.data = d );
    // this.formGroup = new FormGroup({

    //   "arrayFormGroups": new FormArray([
    //     // new FormGroup({
    //     //   "itemName": new FormControl(this.data.items[0].name),
    //     //   "price": new FormControl(this.data.items[0].price),
    //     //   "num": new FormControl(this.data.items[0].num)
    //     // })
    //   ]),
    //   "sale": new FormControl(this.data.sale),
    //   "total": new FormControl(this.data.total, [Validators.min(0)])

    // });

    // this.formGroup.statusChanges.subscribe(stat => {
    //   //this.isSave = stat == "VALID" ? true : false;
    //   //console.log(this.formGroup.valid);
    //   //this.cdr.detectChanges();
    //   //console.log(stat, this.formGroup.controls["total"].value );
    // });

    //this.formGroup.get('arrayFormGroups').valueChanges

    // .subscribe((items: any[]) => {
    //   this.data.items = items
    //     .filter((val): Item | boolean => {
    //       if (val.num * val.price)
    //         return { name: val.itemName, num: val.num, price: val.price };
    //       else return false;
    //     });
    //   this.formGroup.get("total").setValue(this.data.getTotal());
    // });


    //this.formGroup.get("total").valueChanges
    // .subscribe((value: number) => {
    //   this.data.total = value;
    // });

    this.formGroup.get("sale").valueChanges
      .subscribe((value: number) => {
        this.data.sale = value;
        console.log(value);

        this.formGroup.get('total').setValue(1);
      }, null, () => console.log("complite"));
  }


  save() {

    let d = new  Date("2019-09-20T12:09:35.498Z");
    let json = JSON.stringify(d);
    let dj:Date = JSON.parse(json, (k, v)=> (new Date(v))); 
    console.log(d);
    console.log( json);
    console.log(dj, dj.getDate());
    
    // d.setUTCFullYear(2019);
    // d.setUTCMonth(8);
    // d.setUTCDate(20);
    // d.setUTCHours(23);
    // // console.log(d.toLocaleString());
    // // this.data.date = d;
    // console.log(d.toLocaleString());
    this.data.date = new Date(2019, 8, 1); 
    this.base.save(this.data);
    
    // this.data.date.setDate(this.data.date.getDate());
    // this.data.date.setFullYear(this.data.date.getFullYear() + 1);
    // this.data.sale++;

  }

  addItem() {
    this.arrayFormGroups.push(this.createItemFormGroup(new Item("", null, null)))
  }

  get arrayFormGroups(): FormArray {
    return this.formGroup.get('arrayFormGroups') as FormArray;
  }

  deleteItem(i: number) {
    this.arrayFormGroups.removeAt(i);
  }

  getData() {
    // let d = new Date();
    // d.setUTCFullYear(2019);
    // d.setUTCMonth(8);
    // d.setUTCDate(20);
    // d.setUTCHours(23);

    this.base.get(new Date(2019, 8, 1)).subscribe((d) => {
      // console.log(d.date.toLocaleString());
      
      this.data = d;

      // this.formGroup = this.formBuilder.group({
      //   'arrayFormGroups': this.formBuilder.array([]),
      //   "sale": [this.data.sale],
      //   "total": [this.data.total, [Validators.min(0), Validators.required]]
      // })

      // this.data.items.forEach((item) => {
      //   this.arrayFormGroups.push(this.createItemFormGroup(item));
      // })
      // console.log(this.formGroup);
    });
  }
  createItemFormGroup(item: Item): FormGroup {
    return this.formBuilder.group({
      "itemName": [item.name],
      "price": [item.price],
      "num": [item.num]
    })

  }


}
