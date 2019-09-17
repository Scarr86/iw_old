import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { DataService } from '../data-service/data.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
// import {  Item } from '../data-service/data';
import { BaseService, Data, Item } from '../base-service/dase.service';
import { IData } from '../base-service/base.interface';
import { Observer, Observable } from 'rxjs';




@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {

  formGroup: FormGroup;
  data: Data = new Data(new Date(), [new Item("test1", 1000, 1)], 0, 0);
  item: Item;
  save$: Observable<number>


  options: string[] = ['One', 'Two', 'Three'];
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    // private dataServise: DataService,
    private base: BaseService) {
    // let deleteIco = iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/ic_delete_24px.svg'));
  }

  ngOnInit() {
    // this.save$ = this.base.save$.asObservable();
    // this.save$.subscribe(
    //   res=>(console.log(res))
    // )
    // this.data = this.dataServise.data;
    this.base.saveObservable.subscribe(console.log)
    // this.data.date = new Date(Date.now());

    this.formGroup = new FormGroup({

      "arrayFormGroups": new FormArray([
        new FormGroup({
          "itemName": new FormControl(this.data.items[0].name),
          "price": new FormControl(this.data.items[0].price),
          "num": new FormControl(this.data.items[0].num)
        })
      ]),
      "sale": new FormControl(this.data.sale),
      "total": new FormControl(this.data.total, [Validators.min(0)])

    });

    this.formGroup.statusChanges.subscribe(stat => {
      //this.isSave = stat == "VALID" ? true : false;
      //console.log(this.formGroup.valid);
      //this.cdr.detectChanges();
      //console.log(stat, this.formGroup.controls["total"].value );
    });

    this.formGroup.get('arrayFormGroups').valueChanges

    // .subscribe((items: any[]) => {
    //   this.data.items = items
    //     .filter((val): Item | boolean => {
    //       if (val.num * val.price)
    //         return { name: val.itemName, num: val.num, price: val.price };
    //       else return false;
    //     });
    //   this.formGroup.get("total").setValue(this.data.getTotal());
    // });


    this.formGroup.get("total").valueChanges
    // .subscribe((value: number) => {
    //   this.data.total = value;
    // });

    this.formGroup.get("sale").valueChanges
    // .subscribe((value: number) => {
    //   this.data.sale = value;
    //   this.formGroup.get('total').setValue(this.data.getTotal());
    // });
  }


  save() {
  

    this.base.save(this.data);
    //.subscribe(console.log )
    //.subscribe(res=>console.log(res));
    this.data.date.setDate(this.data.date.getDate() + 1);
    this.data.date.setFullYear(this.data.date.getFullYear()+1);
    this.data.sale++;
    // this.dataServise.save();

  }

  addItems() {
    // let item: Item = new Item();
    // this.data.items.push(item);
    // this.arrayFormGroups.push(new FormGroup({
    //   "itemName": new FormControl(item.name),
    //   "price": new FormControl(item.price),
    //   "num": new FormControl(item.num)
    // }));
  }

  get arrayFormGroups(): FormArray {
    return this.formGroup.get('arrayFormGroups') as FormArray;
  }



  deleteItem(i: number) {
    this.arrayFormGroups.removeAt(i);
  }

  getData() {
    this.base.get(new Date())


  }


}
