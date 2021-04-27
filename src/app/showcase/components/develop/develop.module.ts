import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevelopComponent } from './develop.component';
import { DevelopRoutingModule } from './develop-routing.module';

@NgModule({
  declarations: [
    DevelopComponent
  ],
  imports: [
    CommonModule,
    DevelopRoutingModule
  ]
})
export class DevelopModule { }
