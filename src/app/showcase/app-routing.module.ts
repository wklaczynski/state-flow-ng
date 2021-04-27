import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', component: HomeComponent},
            {path: 'setup', loadChildren: () => import('./components/setup/setup.module').then(m => m.SetupModule)},
            {path: 'design', loadChildren: () => import('./components/design/design.module').then(m => m.DesignModule)}
        ], {scrollPositionRestoration: 'enabled'})    
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}