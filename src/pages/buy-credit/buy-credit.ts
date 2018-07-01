import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

/**
 * Generated class for the BuyCreditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buy-credit',
  templateUrl: 'buy-credit.html',
})
export class BuyCreditPage {

  apiUrl4_purchase: string;
  purchaseData: any;
  data: any;

  constructor(public navCtrl: NavController
            , public alertCtrl: AlertController
            , public navParams: NavParams
            , private device: Device
            , private qrScanner: QRScanner
            , public http: HttpClient) {

        // this.data = navParams.get('data');

        /* set your api path here */
        this.apiUrl4_purchase = "http://172.20.10.4:8081/devices/purchase";
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
          let scanSub = this.qrScanner.scan().subscribe((amount: any) => {
            console.log('Scanned something --> ' + amount);

            let alert = this.alertCtrl.create({
                title: 'Confirm purchase',
                message: 'Do you want to buy ' + amount +' DNKoin?',
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
                      // api 3 call

                      console.log('Buy clicked');
                      console.log("userId -> " + this.getUserId());
                      console.log("sessionId -> " + this.getSession());
                      console.log("amount -> " + amount);

                      this.purchaseData = {
                          "userId" : this.getUserId(),
                          "sess" : this.getSession(),
                          "amount" : parseFloat(amount),
                          "transaction" : true
                        };

                        console.log(this.purchaseData);

                      this.http
                        .post(this.apiUrl4_purchase, this.purchaseData)
                        .subscribe(
                          data => {
                            console.log(JSON.stringify(data));
                          },
                          err => {
                            console.log("ERROR!: ", err);
                          }
                        );
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

  getSession(): any {
    return this.device.uuid;
  }

  getUserId(): any {
    return "naywinmyint.nay@gmail.com";
    // return this.device.model;
  }

}
