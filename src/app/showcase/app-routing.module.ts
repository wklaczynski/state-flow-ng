import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
            {path: '', redirectTo: '/index.html', pathMatch: 'full'},
            {path: 'index.html', component: HomeComponent},
            {path: 'setup', loadChildren: () => import('./components/setup/setup.module').then(m => m.SetupModule)},
            {path: 'develop', loadChildren: () => import('./components/develop/develop.module').then(m => m.DevelopModule)},
            {path: 'example/scxml-structure', loadChildren: () => import('./examples/show-scxml-structure/show-scxml-structure.module').then(m => m.ShowScxmlStructureModule)}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes , {relativeLinkResolution: 'legacy'})    
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}