import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BatteryStatus } from '@ionic-native/battery-status';
import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';
import { QRScanner } from '@ionic-native/qr-scanner';
import { HttpClientModule } from '@angular/common/http';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { BuyCreditPage } from '../pages/buy-credit/buy-credit';

// import { ChargingScannerPage } from '../pages/charging-scanner/charging-scanner';
import { TabsPage } from '../pages/tabs/tabs';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    BuyCreditPage,
    TabsPage
  ],
  imports: [
    BrowserModule
    , HttpClientModule
    , IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    BuyCreditPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BatteryStatus,
    Geolocation,
    QRScanner,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
