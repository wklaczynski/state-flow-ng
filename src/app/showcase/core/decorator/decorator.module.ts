import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppConfigService } from '../service/appconfigservice';
import { VersionService } from '../service/versionservice';

import { AppNewsComponent } from './app.news.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppMenuComponent } from './app.menu.component';
import { AppFooterComponent } from './app.footer.component';

@NgModule({
  declarations: [
    AppNewsComponent,
    AppTopBarComponent,
    AppMenuComponent,
    AppFooterComponent
  ],
  exports: [
    AppNewsComponent,
    AppTopBarComponent,
    AppMenuComponent,
    AppFooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
      VersionService,
      AppConfigService
  ],
  
})
export class DecoratorModule { }
