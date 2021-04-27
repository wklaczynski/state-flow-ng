import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowScxmlStructureRoutingModule } from './show-scxml-structure-routing.module';
import { ShowScxmlStructureComponent } from './show-scxml-structure.component';


@NgModule({
  declarations: [
    ShowScxmlStructureComponent
  ],
  imports: [
    CommonModule,
    ShowScxmlStructureRoutingModule
  ],
  exports: [
    ShowScxmlStructureComponent
  ]
})
export class ShowScxmlStructureModule { }
