import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppConfigService } from '../service/appconfigservice';
import { VersionService } from '../service/versionservice';

import { AppNewsComponent } from './app.news.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';

@NgModule({
  declarations: [
    AppNewsComponent,
    AppTopBarComponent,
    AppFooterComponent
  ],
  exports: [
    AppNewsComponent,
    AppTopBarComponent,
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
