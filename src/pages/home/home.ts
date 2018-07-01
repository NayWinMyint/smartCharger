import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { BatteryStatus } from '@ionic-native/battery-status';
import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';

// import { ChargingScannerPage } from '../charging-scanner/charging-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  status: any;
  percentage: number;
  subscription: any;
  apiUrl1_init: string;
  apiUrl2_signal: string;
  initStatus: any;
  signalData: any;
  coords: any;
  initData: any;

  ava_Credit: any;
  constructor(public navCtrl: NavController
            , public platform: Platform
            , private batteryStatus: BatteryStatus
            , private device: Device
            , private geolocation: Geolocation
            , public http: HttpClient) {

        console.log("------>");

        this.percentage = 0;
        this.status = {
          level: 0
        }

        /* set your api path here */
        this.apiUrl1_init = "http://172.20.10.4:8081/devices/init";

        this.apiUrl2_signal = "http://172.20.10.4:8081/devices/status";

  }

  goToChargingScanner(event) {

      let randomnumber = Math.floor(Math.random() * (1 - 0 + 1)) + 0;

      this.signalData = {
          "location" : [ this.coords.latitude, this.coords.longitude ],
          "userId" : this.getUserId(),
          "sess" : this.getSession(),
          "totalAMP" : this.getBatteryCapacity(),
          "percentage" : randomnumber,
          "transaction" : true
        };
      // console.log(status.level, status.isPlugged);

      this.http
        .post(this.apiUrl2_signal, this.signalData, {observe: "response"})
        .subscribe(
          data => {
            let state = data.body['result']['state'];
            if (state) {
              this.ava_Credit = state[this.getUserId()];
            }
            console.log(state)
            // this.ava_Credit = info.result.state[this.getUserId()];
            // console.log(JSON.stringify(data));

            // this.ava_Credit = data.result.state[this.getUserId()];
            // console.log(this.ava_Credit);
          },
          err => {
            console.log("ERROR!: ", err);
          }
        );
  }

  goToBuyCredit(event) {
      this.navCtrl.push('BuyCreditPage', { data: this.initData });
  }

  ionViewDidLoad() {
    this.startCharging();
  }

  startCharging() {

    this.platform.ready().then(()=>{

      /* get geolocation when the device is ready */
      this.coords = this.getLocation()
        .then((resp) => {
          this.coords[0] = resp.coords.latitude;
          this.coords[1] = resp.coords.longitude;
        }).catch((error) => {
          this.coords = null;
        });

      this.subscription = this.batteryStatus.onChange().subscribe( (status) => {
        this.status = status;

        console.log("userId -> " + this.getUserId());

        /* if there is no difference in battery percentage
        -> send the existing one
          else
        -> send the difference */
        // if percentage == 0 & level = 100 -> percentage = 100 - 0
        console.log("percentage -> " + this.percentage);
        console.log("percentage -> " + this.status.level);

        var percentageDiff = this.percentage == this.status.level ? this.status.level : this.status.level - this.percentage;

        /* change the api path if there is any difference in battery */
        let api = this.percentage == 0 ? this.apiUrl1_init : this.apiUrl2_signal;

        this.percentage = percentageDiff <= 0 ? this.status.level : this.percentage;

        this.percentage = this.percentage == 0 ? percentageDiff : this.status.level;
        // if current level is great than previous percentage
        // this.percentage = this.status.level > this.percentage ? this.status.level : this.percentage;

        console.log("location -> lat -> " + this.coords[0] + " | -> " + this.coords[1]);
        console.log("userId -> " + this.getUserId());
        console.log("sessionId -> " + this.getSession());
        console.log("capacity -> " + this.getBatteryCapacity());
        console.log("percentage -> " + percentageDiff);
        console.log("API -> " + api);


        this.initData = {
            "location" : [ this.coords.latitude, this.coords.longitude ],
            "userId" : this.getUserId(),
            "sess" : this.getSession(),
            "totalAMP" : this.getBatteryCapacity(),
            "percentage" : percentageDiff,
            "transaction" : true
          };
        console.log(status.level, status.isPlugged);

        this.http
          .post(api, this.initData)
          .subscribe(
            data => {
              console.log(JSON.stringify(data));
            },
            err => {
              console.log("ERROR!: ", err);
            }
          );

      });
    });
  }

  ionViewWillLeave() {
      this.subscription.unsubscribe();
  }

  getLocation(): any {
    // resp.coords.latitude
    // resp.coords.longitude
    return this.geolocation.getCurrentPosition();
  }

  getSession(): any {
    return this.device.uuid;
  }

  getUserId(): any {
    return "naywinmyint.nay@gmail.com";
    // return this.device.model;
  }

  getBatteryCapacity(): any {
    return 2716;
  }

}
