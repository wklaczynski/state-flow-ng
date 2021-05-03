import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { ShowScxmlStructureRoutingModule } from './show-scxml-structure-routing.module';
import { ShowScxmlStructureComponent } from './show-scxml-structure.component';


@NgModule({
  declarations: [
    ShowScxmlStructureComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    ShowScxmlStructureRoutingModule
  ],
  exports: [
    ShowScxmlStructureComponent
  ]
})
export class ShowScxmlStructureModule { }
