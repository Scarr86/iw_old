import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { DataService } from '../data-service/data.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Data, Item } from '../data-service/data';




@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {
  
  formGroup: FormGroup;
  data: Data;
  item: Item;

  options: string[] = ['One', 'Two', 'Three'];
  constructor(
    private iconRegistry: MatIconRegistry, 
    private sanitizer: DomSanitizer, 
    private cdr: ChangeDetectorRef, 
    private dataServise: DataService) {
    // let deleteIco = iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/ic_delete_24px.svg'));
  }

  ngOnInit() {
    this.data = this.dataServise.data;
    this.data.date = new Date (Date.now());
    this.data.ddate = new Date();

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
    
    .subscribe((items: any[]) => {
      this.data.items = items
        .filter((val): Item | boolean => {
          if (val.num * val.price)
            return { name: val.itemName, num: val.num, price: val.price };
          else return false;
        });
      this.formGroup.get("total").setValue(this.data.getTotal());
    });


    this.formGroup.get("total").valueChanges.subscribe((value: number) => {
      this.data.total = value;
    });

    this.formGroup.get("sale").valueChanges.subscribe((value: number) => {
      this.data.sale = value;
      this.formGroup.get('total').setValue(this.data.getTotal());
    });
  }


  save() {
    this.dataServise.save();

  }

  addItems() {
    let item: Item = new Item();
    this.data.items.push(item);
    this.arrayFormGroups.push(new FormGroup({
      "itemName": new FormControl(item.name),
      "price": new FormControl(item.price),
      "num": new FormControl(item.num)
    }));
  }

  get arrayFormGroups(): FormArray {
    return this.formGroup.get('arrayFormGroups') as FormArray;
  }

  dataJSON() {
   console.log(
     this.data.printfData()
   );
  }

  deleteItem(i: number) {
    this.arrayFormGroups.removeAt(i);
  }

  getData(){
    // console.log("getData");
    
    this.dataServise.getData();
  }


}
