import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

/**
 * Generated class for the ChargingScannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-charging-scanner',
  templateUrl: 'charging-scanner.html',
})
export class ChargingScannerPage {

  apiUrl1_init: string;
  data: any;

  constructor(public navCtrl: NavController
    , public alertCtrl: AlertController
    , public navParams: NavParams
    , private qrScanner: QRScanner
    , public http: HttpClient) {

      /* set your api path here */
      this.apiUrl1_init = "http://172.20.10.4:8081/devices/init";
      this.data = navParams.get('data');

      console.log(JSON.stringify(this.data));
  }

  ionViewWillEnter() {
    this.showCamera();
  }

  ionViewWillLeave() {
    this.hideCamera();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChargingScannerPage');

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          console.log('Camera Permission Given');
          let scanSub = this.qrScanner.scan().subscribe((text: any) => {
            console.log('Scanned something --> ' + JSON.stringify(text));


            let alert = this.alertCtrl.create({
                title: 'Confirm purchase',
                message: 'Do you want to buy ' + text.result +' DNKoin?',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                    }
                  },
                  {
                    text: 'Buy',
                    handler: () => {
                      // api1 call
                      console.log('Buy clicked');
                    }
                  }
                ]
              });
              alert.present();

            this.qrScanner.hide();
            scanSub.unsubscribe();

          });

          this.qrScanner.show();
        } else if (status.denied) {
          console.log('Camera permission denied');
        } else {
          console.log('Permission denied for this runtime.');
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

}
