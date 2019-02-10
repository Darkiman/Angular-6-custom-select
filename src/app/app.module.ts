import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomSelectComponent } from './components/custom-select.component';
import {
  MatIconModule,
  MatInputModule,
  MatMenuModule
} from '@angular/material';

import { IconInjectorService } from './services/icon-injector.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    CustomSelectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,

    HttpClientModule,
    BrowserAnimationsModule,

    MatIconModule,
    MatInputModule,
    MatMenuModule
  ],
  providers: [
    IconInjectorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
