import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowScxmlStructureComponent } from './show-scxml-structure.component';

const routes: Routes = [
  { path: '', component: ShowScxmlStructureComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowScxmlStructureRoutingModule { }
