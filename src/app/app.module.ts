import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import {User, Api } from '../providers';
import { MyApp } from './app.component';
import {ConfirmAppoitmentPage,AddNewDep} from '../pages/item-detail/item-detail'
import {ForgotPassword} from '../pages/login/login'
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication';
import { FCM } from '@ionic-native/fcm';
import { DatePickerModule } from 'ion-datepicker';
import { PhotoViewer } from '@ionic-native/photo-viewer';


// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
}

@NgModule({
  declarations: [
    MyApp,ConfirmAppoitmentPage,ForgotPassword,AddNewDep,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    DatePickerModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,ConfirmAppoitmentPage,ForgotPassword,AddNewDep,
  ],
  providers: [
    Api,
    User,
    Camera,
    SplashScreen,
    StatusBar,
    Clipboard,
    FirebaseAuthentication,
    FCM,
    PhotoViewer,
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
