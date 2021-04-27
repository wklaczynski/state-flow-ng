import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', component: HomeComponent},
            {path: 'setup', loadChildren: () => import('./components/setup/setup.module').then(m => m.SetupModule)},
            {path: 'develop', loadChildren: () => import('./components/develop/develop.module').then(m => m.DevelopModule)},
            {path: 'example/scxml-structure', loadChildren: () => import('./examples/show-scxml-structure/show-scxml-structure.module').then(m => m.ShowScxmlStructureModule)}
        ], {scrollPositionRestoration: 'enabled'})    
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}