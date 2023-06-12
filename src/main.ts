import {enableProdMode, importProvidersFrom, Injectable} from '@angular/core';
import {
  bootstrapApplication,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule
} from '@angular/platform-browser';
import {RouteReuseStrategy, provideRouter} from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from "@ionic/storage-angular";
import {AndroidPermissions} from "@awesome-cordova-plugins/android-permissions/ngx";
import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = {
    'press': { time: 600 } // Minimum press time in milliseconds
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({}), IonicStorageModule.forRoot({name: 'localdb'}), BrowserAnimationsModule, HttpClientModule, HammerModule),
    provideRouter(routes),
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
  ],
});
