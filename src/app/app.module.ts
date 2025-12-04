import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicStorageModule } from '@ionic/storage-angular';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ChatArchiveComponent } from './chat-archive/chat-archive.component';


import { NativeHttpModule } from 'ionic-native-http-connection-backend';
import { RouteReuseStrategy } from '@angular/router';
import { CustomErrorHandler } from './custom-error-handler';
import { IframeComponent } from './iframe/iframe.component';
import {IconComponent} from "@app/components/icon.component";
import {SimulationCardComponent} from "@app/components/simulation-card.component";

@NgModule({
  declarations: [AppComponent, ChatArchiveComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    NativeHttpModule,
    IframeComponent,
    IconComponent,
    SimulationCardComponent,
    AppComponent,
  ],
  providers: [
    HttpClient,
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: CustomErrorHandler },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
})
export class AppModule {}
