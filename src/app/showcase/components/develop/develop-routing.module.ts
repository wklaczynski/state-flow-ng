import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DevelopComponent} from './develop.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {path:'',component: DevelopComponent}
        ])
    ], 
    exports: [
        RouterModule
    ]
})
export class DevelopRoutingModule {}