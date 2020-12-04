import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { FirstRunPage ,MainPage} from '../pages';

@Component({
  template: `
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage: any;

  @ViewChild(Nav) nav: Nav;
  constructor(private fcm: FCM,private translate: TranslateService, platform: Platform, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.fcm.onNotification().subscribe(data => {
        if(data.wasTapped){
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      });
      this.splashScreen.hide();
      if(localStorage.isLogin=='true')
      {
        this.rootPage = MainPage;
      }
      else
      {
       // this.rootPage = MainPage;
        this.rootPage = FirstRunPage;

      }
    });
   
  }

  
  
}
