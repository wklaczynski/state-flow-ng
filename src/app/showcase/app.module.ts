import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { AppNewsComponent } from './core/decorator/app.news.component';
import { AppTopBarComponent } from './core/decorator/app.topbar.component';
import { AppFooterComponent } from './core/decorator/app.footer.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AppNewsComponent,
    AppTopBarComponent,
    AppFooterComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
