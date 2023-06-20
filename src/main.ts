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
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { IonicStorageModule } from "@ionic/storage-angular";
import {AndroidPermissions} from "@awesome-cordova-plugins/android-permissions/ngx";
import 'hammerjs';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

if (environment.production) {
  enableProdMode();
}

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = {
    'press': { time: 600 } // Minimum press time in milliseconds
  };
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    importProvidersFrom(
      IonicModule.forRoot({}),
      IonicStorageModule.forRoot({
        name: 'localdb'
      }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'en',
        useDefaultLang: true,
      }),
      BrowserAnimationsModule,
      HttpClientModule,
      HammerModule
    ),
    provideRouter(routes),
    AndroidPermissions
  ],
});
