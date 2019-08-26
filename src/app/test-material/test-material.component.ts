import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-test-material',
  templateUrl: './test-material.component.html',
  styleUrls: ['./test-material.component.scss'],
  providers:[MatIconRegistry]
})
export class TestMaterialComponent implements OnInit {

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    let ico = iconRegistry.addSvgIcon( 'favorite',  sanitizer.bypassSecurityTrustResourceUrl('assets/baseline-favorite-24px.svg') );
    console.log(ico);
    
   }

  ngOnInit() {
  }

}
